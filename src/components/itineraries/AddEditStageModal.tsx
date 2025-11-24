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
import { ItineraryStage } from '@/types/premium-itinerary';
import { toast } from 'sonner';

const formSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  description: z.string().optional(),
  startLocalityName: z.string().optional(),
  endLocalityName: z.string().optional(),
  distance: z.coerce.number().min(0).optional(),
  estimatedDuration: z.coerce.number().min(0).optional(),
  difficulty: z.enum(['easy', 'moderate', 'difficult']).optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddEditStageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stage?: ItineraryStage;
  order: number;
}

export const AddEditStageModal = ({
  open,
  onOpenChange,
  stage,
  order,
}: AddEditStageModalProps) => {
  const isEditing = !!stage;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: stage?.title || `Dia ${order}: `,
      description: stage?.description || '',
      startLocalityName: stage?.startLocalityName || '',
      endLocalityName: stage?.endLocalityName || '',
      distance: stage?.distance || 0,
      estimatedDuration: stage?.estimatedDuration || 0,
      difficulty: stage?.difficulty,
      notes: stage?.notes || '',
    },
  });

  const onSubmit = (data: FormValues) => {
    console.log('Stage data:', data);
    toast.success(isEditing ? 'Etapa atualizada!' : 'Etapa criada!');
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Etapa' : 'Adicionar Etapa'}</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Atualize os detalhes da etapa do roteiro'
              : 'Defina uma nova etapa personalizada para o roteiro'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título da Etapa</FormLabel>
                  <FormControl>
                    <Input placeholder="Dia 1: Saint-Jean a Roncesvalles" {...field} />
                  </FormControl>
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
                    <Textarea
                      placeholder="Descrição da etapa, adaptações para o cliente..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="startLocalityName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localidade Início</FormLabel>
                    <FormControl>
                      <Input placeholder="Saint-Jean-Pied-de-Port" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="endLocalityName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Localidade Fim</FormLabel>
                    <FormControl>
                      <Input placeholder="Roncesvalles" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="distance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distância (km)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="25.3" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="estimatedDuration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duração (horas)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.1" placeholder="6.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Dificuldade</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="easy">Fácil</SelectItem>
                        <SelectItem value="moderate">Moderado</SelectItem>
                        <SelectItem value="difficult">Difícil</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notas Internas</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Observações sobre esta etapa..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Notas visíveis apenas internamente
                  </FormDescription>
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
                {isEditing ? 'Atualizar' : 'Criar'} Etapa
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
