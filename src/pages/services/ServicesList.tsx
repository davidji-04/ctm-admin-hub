import { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Service, ServiceCategory, SERVICE_CATEGORY_LABELS } from '@/types/service';
import { ServiceCard } from '@/components/services/ServiceCard';
import { AddEditServiceModal } from '@/components/services/AddEditServiceModal';
import { DeleteServiceModal } from '@/components/services/DeleteServiceModal';

const ServicesList = () => {
  const [services, setServices] = useState<Service[]>([
    {
      id: '1',
      name: 'Albergue do Caminho',
      category: 'accommodation',
      description: 'Albergue acolhedor com capacidade para 30 pessoas',
      contact: {
        phone: '+351 912 345 678',
        email: 'albergue@caminho.pt',
        website: 'https://alberguecaminho.pt',
      },
      address: 'Rua Principal, 123, Porto',
      latitude: 41.1579,
      longitude: -8.6291,
      linkedLocalityIds: ['loc-1', 'loc-2'],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<ServiceCategory | 'all'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deletingService, setDeletingService] = useState<Service | null>(null);

  const handleAddService = (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newService: Service = {
      ...serviceData,
      id: `service-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setServices([...services, newService]);
    setIsAddModalOpen(false);
  };

  const handleEditService = (serviceData: Omit<Service, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingService) return;
    
    const updatedServices = services.map((s) =>
      s.id === editingService.id
        ? { ...serviceData, id: s.id, createdAt: s.createdAt, updatedAt: new Date().toISOString() }
        : s
    );
    setServices(updatedServices);
    setEditingService(null);
  };

  const handleDeleteService = () => {
    if (!deletingService) return;
    setServices(services.filter((s) => s.id !== deletingService.id));
    setDeletingService(null);
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Serviços</h1>
          <p className="text-muted-foreground mt-1">
            Gerir estabelecimentos e pontos de interesse
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Serviço
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Procurar serviços..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as ServiceCategory | 'all')}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {Object.entries(SERVICE_CATEGORY_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            onEdit={() => setEditingService(service)}
            onDelete={() => setDeletingService(service)}
          />
        ))}
      </div>

      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum serviço encontrado</p>
        </div>
      )}

      <AddEditServiceModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSave={handleAddService}
      />

      <AddEditServiceModal
        open={!!editingService}
        onOpenChange={(open) => !open && setEditingService(null)}
        onSave={handleEditService}
        service={editingService || undefined}
      />

      <DeleteServiceModal
        open={!!deletingService}
        onOpenChange={(open) => !open && setDeletingService(null)}
        onConfirm={handleDeleteService}
        serviceName={deletingService?.name || ''}
      />
    </div>
  );
};

export default ServicesList;
