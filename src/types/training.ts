export type Difficulty = 'facil' | 'media' | 'dificil';

export interface Exercise {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  duration_minutes: number;
}

export interface TrainingSession {
  id: string;
  title: string;
  description?: string;
  exercises: Exercise[];
}

export interface TrainingPlan {
  id: string;
  name: string;
  description: string;
  route_id?: string;
  user_id?: string;
  sessions: TrainingSession[];
  status: 'draft' | 'active';
  createdAt: string;
}