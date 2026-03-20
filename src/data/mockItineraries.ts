// src/data/mockItineraries.ts

// 1. Definição dos Tipos (Interfaces)
export type ItineraryStatus = 'draft' | 'in_progress' | 'completed' | 'cancelled';
export type StageDifficulty = 'easy' | 'moderate' | 'difficult' | 'extreme';
export type ScheduleType = 'accommodation' | 'transport' | 'activity' | 'restaurant';
export type ScheduleStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Schedule {
  id: string;
  stageId: string;
  type: ScheduleType;
  title: string;
  serviceId?: string;
  serviceName?: string;
  status: ScheduleStatus;
  bookingReference?: string;
  cost?: number;
}

export interface Stage {
  id: string;
  itineraryId: string;
  order: number;
  title: string;
  description: string;
  startLocalityId: string;
  startLocalityName: string;
  endLocalityId: string;
  endLocalityName: string;
  distance: number;
  estimatedDuration: number;
  difficulty: StageDifficulty;
  schedules: Schedule[];
}

export interface Itinerary {
  id: string;
  code: string;
  title: string;
  clientId: string;
  clientName: string;
  basePercursoId: string;
  basePercursoName: string;
  basePercursoVersion: number;
  status: ItineraryStatus;
  startDate: string;
  endDate: string;
  stages: Stage[];
  trainingPlanId?: string;
  sharedWithClient: boolean;
  percursoUpdated: boolean;
  createdAt: string;
  updatedAt: string;
  gpxUrl?: string; // Ficheiro GPX associado ao Roteiro
}

// 2. Os Dados Fictícios (Mock Data)
export const MOCK_ITINERARIES: Itinerary[] = [
  {
    id: '1',
    code: 'ITN-2024-001',
    title: 'Caminho Francês - João Silva',
    clientId: 'client-1',
    clientName: 'João Silva',
    basePercursoId: 'percurso-1',
    basePercursoName: 'Caminho Francês',
    basePercursoVersion: 1,
    status: 'in_progress',
    startDate: '2024-05-01',
    endDate: '2024-06-15',
    gpxUrl: '/exemplo.gpx', // O teu ficheiro GPX associado!
    stages: [
      {
        id: 'stage-1',
        itineraryId: '1',
        order: 1,
        title: 'Dia 1: Saint-Jean-Pied-de-Port a Roncesvalles',
        description: 'Primeira etapa adaptada às capacidades do cliente',
        startLocalityId: 'loc-1',
        startLocalityName: 'Saint-Jean-Pied-de-Port',
        endLocalityId: 'loc-2',
        endLocalityName: 'Roncesvalles',
        distance: 25.3,
        estimatedDuration: 6.3,
        difficulty: 'difficult',
        schedules: [
          {
            id: 'sched-1',
            stageId: 'stage-1',
            type: 'accommodation',
            title: 'Albergue Casa Sabina',
            serviceId: 'service-1',
            serviceName: 'Albergue Casa Sabina',
            status: 'confirmed',
            bookingReference: 'REF-12345',
            cost: 45,
          },
        ],
      },
    ],
    trainingPlanId: 'training-1',
    sharedWithClient: true,
    percursoUpdated: false,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  },
  {
    id: '2',
    code: 'ITN-2024-002',
    title: 'Via Algarviana - Maria Santos',
    clientId: 'client-2',
    clientName: 'Maria Santos',
    basePercursoId: 'percurso-2',
    basePercursoName: 'Via Algarviana',
    basePercursoVersion: 2,
    status: 'draft',
    startDate: '2024-09-10',
    endDate: '2024-09-24',
    gpxUrl: '/exemplo.gpx', // Podes usar o mesmo ficheiro para testar
    stages: [
      {
        id: 'stage-2',
        itineraryId: '2',
        order: 1,
        title: 'Dia 1: Alcoutim a Balurcos',
        description: 'Etapa inicial mais suave para aquecimento.',
        startLocalityId: 'loc-10',
        startLocalityName: 'Alcoutim',
        endLocalityId: 'loc-11',
        endLocalityName: 'Balurcos',
        distance: 24.2,
        estimatedDuration: 5.5,
        difficulty: 'moderate',
        schedules: [],
      },
    ],
    sharedWithClient: false,
    percursoUpdated: true,
    createdAt: '2024-02-10T09:15:00Z',
    updatedAt: '2024-02-12T11:20:00Z',
  }
];

// 3. Funções de Serviço (API Simulator)

// Obter todos os roteiros
export const getItineraries = async (): Promise<Itinerary[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_ITINERARIES);
    }, 500);
  });
};

// Obter um roteiro específico por ID
export const getItineraryById = async (id: string): Promise<Itinerary | undefined> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_ITINERARIES.find(itinerary => itinerary.id === id));
    }, 400);
  });
};

// Obter todos os roteiros de um cliente específico
export const getItinerariesByClient = async (clientId: string): Promise<Itinerary[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_ITINERARIES.filter(itinerary => itinerary.clientId === clientId));
    }, 450);
  });
};