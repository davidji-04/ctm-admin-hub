import { Locality } from '@/types/locality';
import { recalculateAllDistances } from '@/utils/localityCalculations';

export const extractLocalitiesFromGPX = async (gpxUrl: string, routeId: string): Promise<Locality[]> => {
  try {
    // 1. Fazer o download do ficheiro GPX
    const response = await fetch(gpxUrl);
    if (!response.ok) throw new Error('Falha ao carregar o GPX');
    const gpxText = await response.text();

    // 2. Fazer parse do XML
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(gpxText, "text/xml");

    // 3. Procurar todas as tags <wpt> (Waypoints)
    const waypoints = xmlDoc.getElementsByTagName("wpt");

    // 4. Mapear para o teu formato Locality
    const extractedLocalities: Locality[] = Array.from(waypoints).map((wpt, index) => {
      const lat = parseFloat(wpt.getAttribute("lat") || "0");
      const lon = parseFloat(wpt.getAttribute("lon") || "0");

      // Extrair o nome (<name>) e elevação (<ele>), se existirem
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
        distancia_localidade_anterior: 0, // Será calculado a seguir
        tempo_estimado_da_anterior: 0,    // Será calculado a seguir
        dificuldade_nivel_tecnico: 'media', // Valor por defeito
      };
    });

    // 5. Usar a tua função para calcular as distâncias e tempos entre estes pontos
    return recalculateAllDistances(extractedLocalities);

  } catch (error) {
    console.error("Erro ao processar GPX:", error);
    return [];
  }
};