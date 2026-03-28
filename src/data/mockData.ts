// src/data/mockData.ts

export const SHARED_MOCK_ROUTES = [
  {
    id: 1,
    title: "Caminho Português",
    country: "Portugal",
    status: "active",
    category: "premium",
    distance: "245 km",
    localities: 12,
    modality: "walking",
    lastUpdated: "2024-01-15",
    startCoordinates: [41.1579, -8.6291] as [number, number],
    gpxUrl: "/gpx/exemplo.gpx", // Associado ao teu ficheiro!
  },
  {
    id: 2,
    title: "Via Algarviana",
    country: "Portugal",
    status: "draft",
    category: "free",
    distance: "187 km",
    localities: 8,
    modality: "bike",
    lastUpdated: "2024-01-14",
    startCoordinates: [37.2985, -7.9304] as [number, number],
    gpxUrl: "/exemplo.gpx", // Podes usar o mesmo ficheiro para testar noutro percurso
  },
  {
    id: 3,
    title: "Rota Vicentina",
    country: "Portugal",
    status: "active",
    category: "premium",
    distance: "320 km",
    localities: 15,
    modality: "walking",
    lastUpdated: "2024-01-12",
    startCoordinates: [37.9577, -8.7853] as [number, number],
    gpxUrl: "/exemplo.gpx",
  },
  {
    id: 4,
    title: "Caminho de Santiago - Costa",
    country: "Portugal",
    status: "active",
    category: "free",
    distance: "280 km",
    localities: 18,
    modality: "walking",
    lastUpdated: "2024-01-10",
    startCoordinates: [41.6901, -8.8344] as [number, number],
    gpxUrl: undefined, // Deixei este sem GPX para veres como a interface reage quando não há ficheiro
  },
  {
    id: 5,
    title: "Grande Rota do Guadiana",
    country: "Portugal",
    status: "inactive",
    category: "free",
    distance: "65 km",
    localities: 6,
    modality: "bike",
    lastUpdated: "2023-12-20",
    startCoordinates: [37.1893, -7.4428] as [number, number],
    gpxUrl: undefined,
  },
];

export type SharedRouteType = 'percurso' | 'roteiro';

export interface SharedMockClient {
  id: string;
  name: string;
}

export interface SharedMockRouteOption {
  id: string;
  name: string;
  distance: string;
  est_time: string;
  type: SharedRouteType;
  clientId?: string;
}

export const SHARED_MOCK_CLIENTS: SharedMockClient[] = [
  { id: 'u1', name: 'João Silva' },
  { id: 'u2', name: 'Maria Santos' },
  { id: 'u3', name: 'Pedro Costa' },
];

export const SHARED_MOCK_ROUTE_OPTIONS: SharedMockRouteOption[] = [
  { id: '1', name: 'Caminho Português', distance: '245 km', est_time: '12 dias', type: 'percurso' },
  { id: '2', name: 'Rota Vicentina', distance: '320 km', est_time: '15 dias', type: 'percurso' },
  { id: '3', name: 'Via Algarviana', distance: '300 km', est_time: '14 dias', type: 'percurso' },
  { id: '4', name: 'Roteiro Premium Norte', distance: '120 km', est_time: '6 dias', type: 'roteiro', clientId: 'u1' },
  { id: '5', name: 'Roteiro Premium Costa', distance: '90 km', est_time: '5 dias', type: 'roteiro', clientId: 'u2' },
];