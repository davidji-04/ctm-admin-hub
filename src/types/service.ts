export type ServiceCategory = 
  | 'accommodation' 
  | 'food' 
  | 'medical' 
  | 'shopping' 
  | 'transport' 
  | 'tourism' 
  | 'emergency';

export interface Service {
  id: string;
  name: string;
  category: ServiceCategory;
  description?: string;
  contact: {
    phone?: string;
    email?: string;
    website?: string;
  };
  address: string;
  latitude: number;
  longitude: number;
  linkedLocalityIds: string[]; // Many-to-many relationship with localities
  createdAt: string;
  updatedAt: string;
}

export type ServiceFormData = Omit<Service, 'id' | 'createdAt' | 'updatedAt'>;

export const SERVICE_CATEGORY_LABELS: Record<ServiceCategory, string> = {
  accommodation: 'Alojamento',
  food: 'Alimentação',
  medical: 'Médico',
  shopping: 'Compras',
  transport: 'Transporte',
  tourism: 'Turismo',
  emergency: 'Emergência',
};
