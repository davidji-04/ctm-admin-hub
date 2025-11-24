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
import { Checkbox } from '@/components/ui/checkbox';
import { Service, ServiceFormData, ServiceCategory, SERVICE_CATEGORY_LABELS } from '@/types/service';
import { toast } from 'sonner';

const formSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  category: z.enum(['accommodation', 'food', 'medical', 'shopping', 'transport', 'tourism', 'emergency']),
  description: z.string().optional(),
  contactPhone: z.string().optional(),
  contactEmail: z.string().email('Email inválido').optional().or(z.literal('')),
  contactWebsite: z.string().url('URL inválida').optional().or(z.literal('')),
  address: z.string().min(1, 'Morada é obrigatória'),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  linkedLocalityIds: z.array(z.string()),
});

interface AddEditServiceModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (service: ServiceFormData) => void;
  service?: Service;
  localities: Array<{ id: string; name: string }>;
}


export const AddEditServiceModal = ({
  open,
  onOpenChange,
  onSave,
  service,
  localities,
}: AddEditServiceModalProps) => {
  const [selectedLocalities, setSelectedLocalities] = useState<string[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      category: 'accommodation',
      description: '',
      contactPhone: '',
      contactEmail: '',
      contactWebsite: '',
      address: '',
      latitude: 41.1579,
      longitude: -8.6291,
      linkedLocalityIds: [],
    },
  });

  useEffect(() => {
    if (service) {
      form.reset({
        name: service.name,
        category: service.category,
        description: service.description || '',
        contactPhone: service.contact.phone || '',
        contactEmail: service.contact.email || '',
        contactWebsite: service.contact.website || '',
        address: service.address,
        latitude: service.latitude,
        longitude: service.longitude,
        linkedLocalityIds: service.linkedLocalityIds,
      });
      setSelectedLocalities(service.linkedLocalityIds);
    } else {
      form.reset({
        name: '',
        category: 'accommodation',
        description: '',
        contactPhone: '',
        contactEmail: '',
        contactWebsite: '',
        address: '',
        latitude: 41.1579,
        longitude: -8.6291,
        linkedLocalityIds: [],
      });
      setSelectedLocalities([]);
    }
  }, [service, form, open]);

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    const serviceData: ServiceFormData = {
      name: values.name,
      category: values.category,
      description: values.description,
      contact: {
        phone: values.contactPhone,
        email: values.contactEmail,
        website: values.contactWebsite,
      },
      address: values.address,
      latitude: values.latitude,
      longitude: values.longitude,
      linkedLocalityIds: selectedLocalities,
    };

    onSave(serviceData);
    toast.success(service ? 'Serviço atualizado com sucesso' : 'Serviço criado com sucesso');
  };

  const toggleLocality = (localityId: string) => {
    setSelectedLocalities((prev) =>
      prev.includes(localityId)
        ? prev.filter((id) => id !== localityId)
        : [...prev, localityId]
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{service ? 'Editar Serviço' : 'Adicionar Serviço'}</DialogTitle>
          <DialogDescription>
            {service ? 'Atualizar informações do serviço' : 'Criar um novo serviço/estabelecimento'}
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
                    <Input placeholder="Ex: Albergue do Caminho" {...field} />
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
                      {Object.entries(SERVICE_CATEGORY_LABELS).map(([value, label]) => (
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
                    <Textarea placeholder="Breve descrição do serviço..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Contactos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="contactPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="+351 912 345 678" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="servico@exemplo.pt" type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="contactWebsite"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://exemplo.pt" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Localização</h3>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Morada *</FormLabel>
                    <FormControl>
                      <Input placeholder="Rua Principal, 123, Porto" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="latitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Latitude *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="41.1579"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="longitude"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Longitude *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="any"
                          placeholder="-8.6291"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Vincular a Localidades (N:M)</h3>
              <p className="text-sm text-muted-foreground">
                Selecione as localidades onde este serviço está disponível
              </p>
              <div className="space-y-2 border rounded-md p-4">
                {localities.map((locality) => (
                  <div key={locality.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={locality.id}
                      checked={selectedLocalities.includes(locality.id)}
                      onCheckedChange={() => toggleLocality(locality.id)}
                    />
                    <label
                      htmlFor={locality.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      {locality.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {service ? 'Guardar Alterações' : 'Criar Serviço'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
