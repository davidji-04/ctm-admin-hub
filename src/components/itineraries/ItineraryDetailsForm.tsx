import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

const formSchema = z.object({
  title: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  startDate: z.string().min(1, 'Data de início é obrigatória'),
  duration: z.coerce.number().min(1, 'Duração deve ser pelo menos 1 dia'),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface ItineraryDetailsFormProps {
  clientName?: string;
  routeName?: string;
  onSubmit: (data: FormValues) => void;
}

export const ItineraryDetailsForm = ({
  clientName,
  routeName,
  onSubmit,
}: ItineraryDetailsFormProps) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: `${routeName || 'Roteiro'} - ${clientName || 'Cliente'}`,
      startDate: '',
      duration: 30,
      notes: '',
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-muted rounded-lg">
          <div>
            <Label className="text-sm font-medium">Cliente Selecionado</Label>
            <p className="text-sm text-muted-foreground mt-1">
              {clientName || 'Nenhum cliente selecionado'}
            </p>
          </div>
          <div>
            <Label className="text-sm font-medium">Percurso Base</Label>
            <p className="text-sm text-muted-foreground mt-1">
              {routeName || 'Nenhum percurso selecionado'}
            </p>
          </div>
        </div>

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título do Roteiro</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Caminho Francês - João Silva" {...field} />
              </FormControl>
              <FormDescription>
                Nome identificativo do roteiro para o cliente
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Início</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input type="date" {...field} />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                  </div>
                </FormControl>
                <FormDescription>
                  Quando o cliente iniciará a viagem
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duração (dias)</FormLabel>
                <FormControl>
                  <Input type="number" min="1" placeholder="30" {...field} />
                </FormControl>
                <FormDescription>
                  Número total de dias do roteiro
                </FormDescription>
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
              <FormLabel>Notas e Observações</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Informações adicionais sobre o roteiro, preferências do cliente, etc."
                  className="min-h-[120px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Notas internas sobre personalizações e preferências
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};
