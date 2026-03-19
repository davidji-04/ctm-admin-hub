export interface AppRoute {
  id: number;
  title: string;
  country: string;
  status: "active" | "draft" | "inactive";
  category: "premium" | "free";
  distance: string;
  localities: number;
  modality: "walking" | "bike";
  lastUpdated: string;
  startCoordinates: [number, number];
}

export const mockRoutes: AppRoute[] = [
  {
    id: 1,
    title: "Caminho Portugues",
    country: "Portugal",
    status: "active",
    category: "premium",
    distance: "245 km",
    localities: 12,
    modality: "walking",
    lastUpdated: "2024-01-15",
    startCoordinates: [41.1579, -8.6291],
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
    startCoordinates: [37.2985, -7.9304],
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
    startCoordinates: [37.9577, -8.7853],
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
    startCoordinates: [41.6901, -8.8344],
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
    startCoordinates: [37.1893, -7.4428],
  },
];
