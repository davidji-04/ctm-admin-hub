import { useState } from 'react';
import { RouteSelector } from '@/components/localities/RouteSelector';
import { LocalityEditor } from '@/components/localities/LocalityEditor';
import { Locality } from '@/types/locality';

// Mock data - in production this would come from your backend
const MOCK_ROUTES = [
  {
    id: 'route-1',
    name: 'Caminho Francês',
    localitiesCount: 0,
    totalDistance: 0,
    hasLocalities: false,
  },
  {
    id: 'route-2',
    name: 'Caminho Português',
    localitiesCount: 3,
    totalDistance: 245.5,
    hasLocalities: true,
  },
  {
    id: 'route-3',
    name: 'Via Algarviana',
    localitiesCount: 0,
    totalDistance: 0,
    hasLocalities: false,
  },
  {
    id: 'route-4',
    name: 'Rota Vicentina',
    localitiesCount: 5,
    totalDistance: 380.2,
    hasLocalities: true,
  },
];

const MOCK_LOCALITIES: Record<string, Locality[]> = {
  'route-2': [
    {
      id: 'loc-1',
      percurso_id: 'route-2',
      nome: 'Porto',
      ordem_no_percurso: 1,
      latitude: 41.1579,
      longitude: -8.6291,
      elevacao_altimetria: 104,
      distancia_localidade_anterior: 0,
      tempo_estimado_da_anterior: 0,
      dificuldade_nivel_tecnico: 'facil',
      selo_badge: 'Ponto de partida',
    },
    {
      id: 'loc-2',
      percurso_id: 'route-2',
      nome: 'Barcelos',
      ordem_no_percurso: 2,
      latitude: 41.5388,
      longitude: -8.6151,
      elevacao_altimetria: 39,
      distancia_localidade_anterior: 42.5,
      tempo_estimado_da_anterior: 510,
      dificuldade_nivel_tecnico: 'media',
    },
    {
      id: 'loc-3',
      percurso_id: 'route-2',
      nome: 'Ponte de Lima',
      ordem_no_percurso: 3,
      latitude: 41.7676,
      longitude: -8.5839,
      elevacao_altimetria: 15,
      distancia_localidade_anterior: 34.2,
      tempo_estimado_da_anterior: 420,
      dificuldade_nivel_tecnico: 'facil',
    },
  ],
  'route-4': [
    {
      id: 'loc-4',
      percurso_id: 'route-4',
      nome: 'Santiago do Cacém',
      ordem_no_percurso: 1,
      latitude: 38.0166,
      longitude: -8.6973,
      elevacao_altimetria: 230,
      distancia_localidade_anterior: 0,
      tempo_estimado_da_anterior: 0,
      dificuldade_nivel_tecnico: 'media',
      selo_badge: 'Início',
    },
    {
      id: 'loc-5',
      percurso_id: 'route-4',
      nome: 'Porto Covo',
      ordem_no_percurso: 2,
      latitude: 37.8502,
      longitude: -8.7922,
      elevacao_altimetria: 20,
      distancia_localidade_anterior: 22.8,
      tempo_estimado_da_anterior: 330,
      dificuldade_nivel_tecnico: 'facil',
    },
    {
      id: 'loc-6',
      percurso_id: 'route-4',
      nome: 'Vila Nova de Milfontes',
      ordem_no_percurso: 3,
      latitude: 37.7185,
      longitude: -8.7804,
      elevacao_altimetria: 10,
      distancia_localidade_anterior: 15.3,
      tempo_estimado_da_anterior: 240,
      dificuldade_nivel_tecnico: 'facil',
    },
    {
      id: 'loc-7',
      percurso_id: 'route-4',
      nome: 'Almograve',
      ordem_no_percurso: 4,
      latitude: 37.6589,
      longitude: -8.7936,
      elevacao_altimetria: 35,
      distancia_localidade_anterior: 8.5,
      tempo_estimado_da_anterior: 135,
      dificuldade_nivel_tecnico: 'facil',
    },
    {
      id: 'loc-8',
      percurso_id: 'route-4',
      nome: 'Zambujeira do Mar',
      ordem_no_percurso: 5,
      latitude: 37.5272,
      longitude: -8.7853,
      elevacao_altimetria: 50,
      distancia_localidade_anterior: 14.8,
      tempo_estimado_da_anterior: 240,
      dificuldade_nivel_tecnico: 'media',
      selo_badge: 'Fim',
    },
  ],
};

const LocalitiesList = () => {
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>('route-2');
  const [routesData, setRoutesData] = useState(MOCK_ROUTES);
  const [localitiesData, setLocalitiesData] = useState(MOCK_LOCALITIES);

  const selectedRoute = routesData.find((r) => r.id === selectedRouteId);
  const selectedLocalities = selectedRouteId ? localitiesData[selectedRouteId] || [] : [];

  const handleLocalitiesChange = (updatedLocalities: Locality[]) => {
    if (!selectedRouteId) return;

    // Update localities
    setLocalitiesData((prev) => ({
      ...prev,
      [selectedRouteId]: updatedLocalities,
    }));

    // Update route metadata
    const totalDistance = updatedLocalities.reduce(
      (sum, loc) => sum + loc.distancia_localidade_anterior,
      0
    );

    setRoutesData((prev) =>
      prev.map((route) =>
        route.id === selectedRouteId
          ? {
              ...route,
              localitiesCount: updatedLocalities.length,
              totalDistance,
              hasLocalities: updatedLocalities.length > 0,
            }
          : route
      )
    );
  };

  return (
    <div className="h-screen flex">
      {/* Master List - Left Pane */}
      <div className="w-80 flex-shrink-0">
        <RouteSelector
          routes={routesData}
          selectedRouteId={selectedRouteId}
          onSelectRoute={setSelectedRouteId}
        />
      </div>

      {/* Detail View - Right Pane */}
      <div className="flex-1 overflow-hidden">
        {selectedRoute ? (
          <LocalityEditor
            routeId={selectedRoute.id}
            routeName={selectedRoute.name}
            localities={selectedLocalities}
            totalDistance={selectedRoute.totalDistance}
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
