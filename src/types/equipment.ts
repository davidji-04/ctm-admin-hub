export type EquipmentCategory = 
  | 'clothing' 
  | 'safety' 
  | 'navigation' 
  | 'food' 
  | 'camping' 
  | 'first-aid'
  | 'other';

export type EquipmentPriority = 'essencial' | 'opcional';

export interface Equipment {
  id: string;
  name: string;
  category: EquipmentCategory;
  description?: string;
  image?: string;
  weight?: number; // in grams
  linkedRoutes: {
    routeId: string;
    routeName: string;
    routeType?: 'percurso' | 'roteiro';
    clientId?: string;
    clientName?: string;
    priority: EquipmentPriority;
  }[];
  createdAt: string;
  updatedAt: string;
}

export type EquipmentFormData = Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>;

export const EQUIPMENT_CATEGORY_LABELS: Record<EquipmentCategory, string> = {
  clothing: 'Vestuário',
  safety: 'Segurança',
  navigation: 'Navegação',
  food: 'Alimentação',
  camping: 'Camping',
  'first-aid': 'Primeiros Socorros',
  other: 'Outro',
};

export const EQUIPMENT_PRIORITY_LABELS: Record<EquipmentPriority, string> = {
  essencial: 'Essencial',
  opcional: 'Opcional',
};
