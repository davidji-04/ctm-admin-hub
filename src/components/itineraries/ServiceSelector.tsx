import { useState } from 'react';
import { Search, MapPin, Phone } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Service, ServiceCategory, SERVICE_CATEGORY_LABELS } from '@/types/service';

interface ServiceSelectorProps {
  selectedServiceId?: string;
  onServiceSelect: (serviceId: string, serviceName: string) => void;
  categoryFilter?: ServiceCategory;
}

// Mock data - replace with actual API calls
const mockServices: Service[] = [
  {
    id: 'service-1',
    name: 'Albergue Casa Sabina',
    category: 'accommodation',
    description: 'Albergue tradicional com capacidade para 40 peregrinos',
    contact: { phone: '+34 948 760 012', email: 'info@casasabina.com' },
    address: 'Rua Principal 123, Roncesvalles',
    latitude: 43.0099,
    longitude: -1.3196,
    linkedLocalityIds: ['loc-1'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'service-2',
    name: 'Restaurante El Peregrino',
    category: 'food',
    description: 'Especialidade em comida tradicional basca',
    contact: { phone: '+34 948 760 345' },
    address: 'Plaza Mayor 5, Pamplona',
    latitude: 42.8125,
    longitude: -1.6458,
    linkedLocalityIds: ['loc-2'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    id: 'service-3',
    name: 'Hotel Los Arcos',
    category: 'accommodation',
    description: 'Hotel 3 estrelas no centro histórico',
    contact: { phone: '+34 948 640 200', website: 'www.hotellosarcos.com' },
    address: 'Calle Mayor 14, Los Arcos',
    latitude: 42.5691,
    longitude: -2.1861,
    linkedLocalityIds: ['loc-3'],
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

export const ServiceSelector = ({
  selectedServiceId,
  onServiceSelect,
  categoryFilter,
}: ServiceSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilterLocal, setCategoryFilterLocal] = useState<ServiceCategory | 'all'>(
    categoryFilter || 'all'
  );

  const filteredServices = mockServices.filter((service) => {
    const matchesSearch =
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      categoryFilterLocal === 'all' || service.category === categoryFilterLocal;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Procurar serviços..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select
          value={categoryFilterLocal}
          onValueChange={(value) => setCategoryFilterLocal(value as ServiceCategory | 'all')}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas Categorias</SelectItem>
            {Object.entries(SERVICE_CATEGORY_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {filteredServices.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhum serviço encontrado</p>
            <p className="text-sm mt-1">Tente ajustar os filtros de busca</p>
          </div>
        ) : (
          filteredServices.map((service) => (
            <div
              key={service.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors hover:border-primary ${
                selectedServiceId === service.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border'
              }`}
              onClick={() => onServiceSelect(service.id, service.name)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium">{service.name}</h3>
                    <Badge variant="outline">
                      {SERVICE_CATEGORY_LABELS[service.category]}
                    </Badge>
                  </div>
                  {service.description && (
                    <p className="text-sm text-muted-foreground">
                      {service.description}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{service.address}</span>
                    </div>
                    {service.contact.phone && (
                      <div className="flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        <span>{service.contact.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                {selectedServiceId === service.id && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
