export type ItineraryStatus = 'draft' | 'in_progress' | 'confirmed' | 'completed' | 'cancelled';
export type ScheduleStatus = 'pending' | 'confirmed' | 'cancelled';

export interface PremiumItinerary {
  id: string;
  code: string; // Unique identifier for the itinerary
  title: string;
  clientId: string;
  clientName: string;
  basePercursoId: string;
  basePercursoName: string;
  basePercursoVersion: number; // Snapshot of the Percurso version
  status: ItineraryStatus;
  startDate: string;
  endDate: string;
  stages: ItineraryStage[];
  trainingPlanId?: string;
  notes?: string;
  sharedWithClient: boolean;
  percursoUpdated: boolean; // Flag if base Percurso has been updated
  createdAt: string;
  updatedAt: string;
}

export interface ItineraryStage {
  id: string;
  itineraryId: string;
  order: number;
  title: string; // e.g., "Day 1: Saint-Jean to Roncesvalles"
  description?: string;
  startLocalityId?: string;
  startLocalityName?: string;
  endLocalityId?: string;
  endLocalityName?: string;
  distance?: number;
  estimatedDuration?: number;
  difficulty?: 'easy' | 'moderate' | 'difficult';
  schedules: StageSchedule[];
  notes?: string;
}

export interface StageSchedule {
  id: string;
  stageId: string;
  type: 'accommodation' | 'restaurant' | 'activity' | 'transport' | 'other';
  title: string;
  serviceId?: string; // Link to Services module
  serviceName?: string;
  status: ScheduleStatus;
  bookingReference?: string;
  scheduledTime?: string;
  confirmationDate?: string;
  cost?: number;
  notes?: string;
}

export type ItineraryFormData = Omit<PremiumItinerary, 'id' | 'code' | 'createdAt' | 'updatedAt'>;

export const ITINERARY_STATUS_LABELS: Record<ItineraryStatus, string> = {
  draft: 'Rascunho',
  in_progress: 'Em Progresso',
  confirmed: 'Confirmado',
  completed: 'Concluído',
  cancelled: 'Cancelado',
};

export const SCHEDULE_STATUS_LABELS: Record<ScheduleStatus, string> = {
  pending: 'Pendente',
  confirmed: 'Confirmado',
  cancelled: 'Cancelado',
};

export const SCHEDULE_TYPE_LABELS: Record<StageSchedule['type'], string> = {
  accommodation: 'Alojamento',
  restaurant: 'Restaurante',
  activity: 'Atividade',
  transport: 'Transporte',
  other: 'Outro',
};
