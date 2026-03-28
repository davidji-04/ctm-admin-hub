import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Equipment, EquipmentFormData, EquipmentCategory, EQUIPMENT_CATEGORY_LABELS, EQUIPMENT_PRIORITY_LABELS, EquipmentPriority } from '@/types/equipment';
import { toast } from 'sonner';
import { Plus, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SHARED_MOCK_CLIENTS, SHARED_MOCK_ROUTE_OPTIONS } from '@/data/mockData';

const formSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  category: z.enum(['clothing', 'safety', 'navigation', 'food', 'camping', 'first-aid', 'other']),
  description: z.string().optional(),
  weight: z.number().min(0).optional(),
});

interface AddEditEquipmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (equipment: EquipmentFormData) => void;
  equipment?: Equipment;
}

const MOCK_ROUTES = SHARED_MOCK_ROUTE_OPTIONS;
const MOCK_CLIENTS = SHARED_MOCK_CLIENTS;

export const AddEditEquipmentModal = ({
  open,
  onOpenChange,
  onSave,
  equipment,
}: AddEditEquipmentModalProps) => {
  const [linkedRoutes, setLinkedRoutes] = useState<Equipment['linkedRoutes']>([]);
  const [selectedRoute, setSelectedRoute] = useState<string>('');
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedPriority, setSelectedPriority] = useState<EquipmentPriority>('opcional');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category: 'other',
      description: '',
      weight: undefined,
    },
  });

  useEffect(() => {
    if (equipment) {
      form.reset({
        name: equipment.name,
        category: equipment.category,
        description: equipment.description || '',
        weight: equipment.weight,
      });
      setLinkedRoutes(equipment.linkedRoutes);
    } else {
      form.reset({
        name: '',
        category: 'other',
        description: '',
        weight: undefined,
      });
      setLinkedRoutes([]);
    }
  }, [equipment, form, open]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const equipmentData: EquipmentFormData = {
      name: values.name,
      category: values.category,
      description: values.description,
      weight: values.weight,
      linkedRoutes: linkedRoutes,
    };

    onSave(equipmentData);
    toast.success(equipment ? 'Equipamento atualizado' : 'Equipamento criado');
  };

  const handleAddRoute = () => {
    if (!selectedRoute) return;

    const route = MOCK_ROUTES.find((r) => r.id === selectedRoute);
    if (!route) return;

    if (route.type === 'roteiro' && !selectedClientId) {
      toast.error('Selecione o cliente para associar ao roteiro');
      return;
    }

    if (linkedRoutes.some((lr) => lr.routeId === selectedRoute)) {
      toast.error('Este percurso já está vinculado');
      return;
    }

    const selectedClient = MOCK_CLIENTS.find((c) => c.id === selectedClientId);

    setLinkedRoutes([
      ...linkedRoutes,
      {
        routeId: route.id,
        routeName: route.name,
        routeType: route.type,
        clientId: route.type === 'roteiro' ? selectedClient?.id : undefined,
        clientName: route.type === 'roteiro' ? selectedClient?.name : undefined,
        priority: selectedPriority,
      },
    ]);
    setSelectedRoute('');
    setSelectedClientId('');
  };

  const handleRemoveRoute = (routeId: string) => {
    setLinkedRoutes(linkedRoutes.filter((lr) => lr.routeId !== routeId));
  };

  const selectedRouteType = MOCK_ROUTES.find((route) => route.id === selectedRoute)?.type;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{equipment ? 'Editar Equipamento' : 'Adicionar Equipamento'}</DialogTitle>
          <DialogDescription>
            {equipment ? 'Atualizar informações do equipamento' : 'Criar um novo item de equipamento'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Bastões de Caminhada" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoria *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.entries(EQUIPMENT_CATEGORY_LABELS).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descrição</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Descrição do equipamento..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Peso (gramas)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="450"
                      {...field}
                      onChange={(e) => field.onChange(e.target.value ? parseInt(e.target.value) : undefined)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-3">
              <h3 className="text-sm font-medium">Recomendações por Percurso / Roteiro</h3>
              <div className="flex gap-2">
                <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Selecione um percurso ou roteiro" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_ROUTES.map((route) => (
                      <SelectItem key={route.id} value={route.id}>
                        {route.name} ({route.type === 'roteiro' ? 'Roteiro' : 'Percurso'})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedPriority} onValueChange={(value) => setSelectedPriority(value as EquipmentPriority)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(EQUIPMENT_PRIORITY_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" size="icon" onClick={handleAddRoute}>
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              {selectedRouteType === 'roteiro' && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Para roteiro, a associação ao cliente é obrigatória.
                  </p>
                  <Select value={selectedClientId} onValueChange={setSelectedClientId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o cliente do roteiro" />
                    </SelectTrigger>
                    <SelectContent>
                      {MOCK_CLIENTS.map((client) => (
                        <SelectItem key={client.id} value={client.id}>
                          {client.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              {linkedRoutes.length > 0 && (
                <div className="space-y-2 border rounded-md p-3">
                  {linkedRoutes.map((link) => (
                    <div key={link.routeId} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{link.routeName}</span>
                        {link.routeType === 'roteiro' && link.clientName && (
                          <Badge variant="secondary" className="text-xs">
                            Cliente: {link.clientName}
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {EQUIPMENT_PRIORITY_LABELS[link.priority]}
                        </Badge>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => handleRemoveRoute(link.routeId)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {equipment ? 'Guardar Alterações' : 'Criar Equipamento'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
