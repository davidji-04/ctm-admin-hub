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
import { Equipment, EquipmentCategory, EQUIPMENT_CATEGORY_LABELS } from '@/types/equipment';
import { EquipmentCard } from '@/components/equipment/EquipmentCard';
import { AddEditEquipmentModal } from '@/components/equipment/AddEditEquipmentModal';
import { DeleteEquipmentModal } from '@/components/equipment/DeleteEquipmentModal';

const EquipmentList = () => {
  const [equipment, setEquipment] = useState<Equipment[]>([
    {
      id: '1',
      name: 'Bastões de Caminhada',
      category: 'safety',
      description: 'Bastões telescópicos ajustáveis para reduzir impacto nas articulações',
      weight: 450,
      linkedRoutes: [
        { routeId: 'r1', routeName: 'Caminho Português', priority: 'opcional' },
        { routeId: 'r2', routeName: 'Rota da Montanha', priority: 'essencial' },
      ],
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<EquipmentCategory | 'all'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const [deletingEquipment, setDeletingEquipment] = useState<Equipment | null>(null);

  const handleAddEquipment = (equipmentData: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newEquipment: Equipment = {
      ...equipmentData,
      id: `equip-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setEquipment([...equipment, newEquipment]);
    setIsAddModalOpen(false);
  };

  const handleEditEquipment = (equipmentData: Omit<Equipment, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!editingEquipment) return;
    
    const updatedEquipment = equipment.map((e) =>
      e.id === editingEquipment.id
        ? { ...equipmentData, id: e.id, createdAt: e.createdAt, updatedAt: new Date().toISOString() }
        : e
    );
    setEquipment(updatedEquipment);
    setEditingEquipment(null);
  };

  const handleDeleteEquipment = () => {
    if (!deletingEquipment) return;
    setEquipment(equipment.filter((e) => e.id !== deletingEquipment.id));
    setDeletingEquipment(null);
  };

  const filteredEquipment = equipment.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Equipamentos</h1>
          <p className="text-muted-foreground mt-1">
            Gerir equipamentos recomendados para percursos
          </p>
        </div>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Equipamento
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Procurar equipamentos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as EquipmentCategory | 'all')}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {Object.entries(EQUIPMENT_CATEGORY_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredEquipment.map((item) => (
          <EquipmentCard
            key={item.id}
            equipment={item}
            onEdit={() => setEditingEquipment(item)}
            onDelete={() => setDeletingEquipment(item)}
          />
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum equipamento encontrado</p>
        </div>
      )}

      <AddEditEquipmentModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSave={handleAddEquipment}
      />

      <AddEditEquipmentModal
        open={!!editingEquipment}
        onOpenChange={(open) => !open && setEditingEquipment(null)}
        onSave={handleEditEquipment}
        equipment={editingEquipment || undefined}
      />

      <DeleteEquipmentModal
        open={!!deletingEquipment}
        onOpenChange={(open) => !open && setDeletingEquipment(null)}
        onConfirm={handleDeleteEquipment}
        equipmentName={deletingEquipment?.name || ''}
      />
    </div>
  );
};

export default EquipmentList;
