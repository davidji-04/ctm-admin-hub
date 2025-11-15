export interface Locality {
  id: string;
  percurso_id: string;
  nome: string;
  ordem_no_percurso: number;
  latitude: number;
  longitude: number;
  elevacao_altimetria?: number;
  distancia_localidade_anterior: number;
  tempo_estimado_da_anterior: number;
  dificuldade_nivel_tecnico: 'facil' | 'media' | 'dificil';
  observacao?: string;
  selo_badge?: string;
}

export type LocalityFormData = Omit<
  Locality,
  'id' | 'percurso_id' | 'ordem_no_percurso' | 'distancia_localidade_anterior' | 'tempo_estimado_da_anterior'
>;
