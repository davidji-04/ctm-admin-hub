import { useState, useEffect } from 'react';
import { RouteSelector } from '@/components/localities/RouteSelector';
import { LocalityEditor } from '@/components/localities/LocalityEditor';
import { Locality } from '@/types/locality';
import { recalculateAllDistances } from '@/utils/localityCalculations';
import { SHARED_MOCK_ROUTES } from '@/data/mockData'; // Certifica-te que este caminho está correto

// 1. Função que lê o ficheiro GPX e converte as tags <wpt> nas tuas Localidades
export const extractLocalitiesFromGPX = async (gpxUrl: string, routeId: string): Promise<Locality[]> => {
  try {
    console.log("A TENTAR LER O FICHEIRO:", gpxUrl);
    const response = await fetch(gpxUrl);
    console.log("STATUS DA RESPOSTA:", response.status);

    if (!response.ok) throw new Error('Falha ao carregar o GPX');
    const gpxText = await response.text();

    console.log("CONTEÚDO LIDO (Primeiras 200 letras):");
    console.log(gpxText.substring(0, 200));
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(gpxText, "text/xml");

    const waypoints = xmlDoc.getElementsByTagName("wpt");

    const extractedLocalities: Locality[] = Array.from(waypoints).map((wpt, index) => {
      const lat = parseFloat(wpt.getAttribute("lat") || "0");
      const lon = parseFloat(wpt.getAttribute("lon") || "0");

      const nameNode = wpt.getElementsByTagName("name")[0];
      const eleNode = wpt.getElementsByTagName("ele")[0];

      const name = nameNode?.textContent || `Ponto ${index + 1}`;
      const ele = eleNode?.textContent ? parseFloat(eleNode.textContent) : 0;

      return {
        id: `loc-gpx-${Date.now()}-${index}`,
        percurso_id: routeId,
        nome: name,
        ordem_no_percurso: index + 1,
        latitude: lat,
        longitude: lon,
        elevacao_altimetria: ele,
        distancia_localidade_anterior: 0,
        tempo_estimado_da_anterior: 0,
        dificuldade_nivel_tecnico: 'media',
      };
    });

    // Calcula as distâncias reais entre os pontos extraídos
    return recalculateAllDistances(extractedLocalities);

  } catch (error) {
    console.error("Erro ao processar GPX:", error);
    return [];
  }
};

// 2. Componente Principal
const LocalitiesList = () => {
  // Adaptamos o array partilhado para o formato que a barra lateral espera
  const initialRoutes = SHARED_MOCK_ROUTES.map(route => ({
    id: route.id.toString(),
    name: route.title,
    localitiesCount: route.localities,
    totalDistance: parseFloat(route.distance.replace(' km', '')), // Garante que tira o " km" se existir
    hasLocalities: route.localities > 0,
    gpxUrl: route.gpxUrl
  }));

  const [routesData, setRoutesData] = useState(initialRoutes);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(initialRoutes[0]?.id || null);

  const [currentLocalities, setCurrentLocalities] = useState<Locality[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const selectedRoute = routesData.find((r) => r.id === selectedRouteId);

  // Função auxiliar para atualizar a metadata da rota (distância total e número de localidades)
  const updateRouteMetadata = (routeId: string, locs: Locality[]) => {
    const totalDistance = locs.reduce((sum, loc) => sum + loc.distancia_localidade_anterior, 0);
    setRoutesData(prev => prev.map(r => r.id === routeId ? {
      ...r,
      localitiesCount: locs.length,
      totalDistance: totalDistance,
      hasLocalities: locs.length > 0
    } : r));
  };

  // Efeito que reage sempre que selecionas um percurso diferente na esquerda
  useEffect(() => {
    const loadLocalitiesFromGPX = async () => {
      if (!selectedRoute || !selectedRoute.gpxUrl) {
        setCurrentLocalities([]);
        return;
      }

      setIsLoading(true);
      const extractedPoints = await extractLocalitiesFromGPX(selectedRoute.gpxUrl, selectedRoute.id);
      setCurrentLocalities(extractedPoints);

      updateRouteMetadata(selectedRoute.id, extractedPoints);
      setIsLoading(false);
    };

    loadLocalitiesFromGPX();
  }, [selectedRouteId]); // Dependência: só corre quando o ID muda

  // Função que é chamada quando o utilizador edita/apaga uma localidade no Editor
  const handleLocalitiesChange = (updatedLocalities: Locality[]) => {
    setCurrentLocalities(updatedLocalities);
    if (selectedRouteId) {
      updateRouteMetadata(selectedRouteId, updatedLocalities);
    }
  };

  return (
    <div className="h-screen flex">
      {/* Lado Esquerdo - Lista de Percursos */}
      <div className="w-80 flex-shrink-0">
        <RouteSelector
          routes={routesData}
          selectedRouteId={selectedRouteId}
          onSelectRoute={setSelectedRouteId}
        />
      </div>

      {/* Lado Direito - Editor e Mapa */}
      <div className="flex-1 overflow-hidden">
        {isLoading ? (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground animate-pulse">A extrair localidades do ficheiro GPX...</p>
          </div>
        ) : selectedRoute ? (
          <LocalityEditor
            routeId={selectedRoute.id}
            routeName={selectedRoute.name}
            localities={currentLocalities}
            totalDistance={selectedRoute.totalDistance}
            gpxUrl={selectedRoute.gpxUrl}
            onLocalitiesChange={handleLocalitiesChange}
          />
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-muted-foreground">Selecione um percurso para gerir localidades</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocalitiesList;