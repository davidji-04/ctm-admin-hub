import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { StageSchedule } from '@/types/premium-itinerary';
import { ServiceSelector } from './ServiceSelector';
import { toast } from 'sonner';
import { useState } from 'react';

const formSchema = z.object({
  type: z.enum(['accommodation', 'restaurant', 'activity', 'transport', 'other']),
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  serviceId: z.string().optional(),
  serviceName: z.string().optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled']),
  bookingReference: z.string().optional(),
  scheduledTime: z.string().optional(),
  cost: z.coerce.number().min(0).optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddEditScheduleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule?: StageSchedule;
  stageTitle: string;
}

export const AddEditScheduleModal = ({
  open,
  onOpenChange,
  schedule,
  stageTitle,
}: AddEditScheduleModalProps) => {
  const isEditing = !!schedule;
  const [showServiceSelector, setShowServiceSelector] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: schedule?.type || 'accommodation',
      title: schedule?.title || '',
      serviceId: schedule?.serviceId || '',
      serviceName: schedule?.serviceName || '',
      status: schedule?.status || 'pending',
      bookingReference: schedule?.bookingReference || '',
      scheduledTime: schedule?.scheduledTime || '',
      cost: schedule?.cost || 0,
      notes: schedule?.notes || '',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Schedule data:', data);
    toast.success(isEditing ? 'Programação atualizada!' : 'Programação criada!');
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar Programação' : 'Adicionar Programação'}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Atualize os detalhes da programação'
              : `Adicione uma nova programação para: ${stageTitle}`}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Programação</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="accommodation">Alojamento</SelectItem>
                        <SelectItem value="restaurant">Restaurante</SelectItem>
                        <SelectItem value="activity">Atividade</SelectItem>
                        <SelectItem value="transport">Transporte</SelectItem>
                        <SelectItem value="other">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Estado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pending">Pendente</SelectItem>
                        <SelectItem value="confirmed">Confirmado</SelectItem>
                        <SelectItem value="cancelled">Cancelado</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Albergue Casa Sabina" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <FormLabel>Serviço Vinculado (Opcional)</FormLabel>
              {!showServiceSelector ? (
                <div className="space-y-2">
                  {form.watch('serviceName') ? (
                    <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                      <span className="text-sm">{form.watch('serviceName')}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          form.setValue('serviceId', '');
                          form.setValue('serviceName', '');
                        }}
                      >
                        Remover
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      Nenhum serviço vinculado
                    </p>
                  )}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setShowServiceSelector(true)}
                  >
                    {form.watch('serviceName') ? 'Alterar Serviço' : 'Vincular Serviço'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <ServiceSelector
                    selectedServiceId={form.watch('serviceId')}
                    onServiceSelect={(serviceId, serviceName) => {
                      form.setValue('serviceId', serviceId);
                      form.setValue('serviceName', serviceName);
                      setShowServiceSelector(false);
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowServiceSelector(false)}
                  >
                    Cancelar
                  </Button>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="bookingReference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Referência de Reserva</FormLabel>
                    <FormControl>
                      <Input placeholder="REF-12345" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="scheduledTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horário Agendado</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="cost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Custo (€)</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormDescription>
                    Valor da programação ou reserva
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações sobre esta programação..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                {isEditing ? 'Atualizar' : 'Criar'} Programação
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
