import { RouteImage } from '@/types/image';

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

const getRouteIdByTitle = (title: string): string => {
  const route = mockRoutes.find((item) => item.title === title);
  return route ? route.id.toString() : mockRoutes[0]?.id.toString() ?? '1';
};

export const mockRouteImages: RouteImage[] = [
  {
    id: '1',
    percurso_id: getRouteIdByTitle('Caminho Portugues'),
    tipo: 'hero',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4',
    filename: 'hero-caminho-portugues.jpg',
    width: 1920,
    height: 1080,
    size: 2048576,
    uploadedAt: '2024-01-15T10:00:00Z',
  },
  {
    id: '2',
    percurso_id: getRouteIdByTitle('Caminho Portugues'),
    tipo: 'galeria',
    url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b',
    filename: 'gallery-1.jpg',
    ordem: 1,
    width: 1600,
    height: 900,
    size: 1524576,
    uploadedAt: '2024-01-15T11:00:00Z',
  },
];
