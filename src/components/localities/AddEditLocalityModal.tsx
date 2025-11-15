import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
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
import { LocalityMap } from './LocalityMap';
import { Locality, LocalityFormData } from '@/types/locality';
import { useState } from 'react';
import { validateCoordinates, suggestDifficulty } from '@/utils/localityCalculations';

const formSchema = z.object({
  nome: z.string().min(2, 'Name must be at least 2 characters').max(255),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  elevacao_altimetria: z.number().min(0).max(9000).optional().or(z.literal(undefined)),
  dificuldade_nivel_tecnico: z.enum(['facil', 'media', 'dificil']),
  observacao: z.string().max(500).optional().or(z.literal('')),
  selo_badge: z.string().max(50).optional().or(z.literal('')),
});

interface AddEditLocalityModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: LocalityFormData) => Promise<void>;
  locality?: Locality;
  previousLocality?: Locality;
}

export const AddEditLocalityModal = ({
  open,
  onOpenChange,
  onSave,
  locality,
  previousLocality,
}: AddEditLocalityModalProps) => {
  const [isSaving, setIsSaving] = useState(false);
  const isEdit = !!locality;

  const form = useForm<LocalityFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: locality
      ? {
          nome: locality.nome,
          latitude: locality.latitude,
          longitude: locality.longitude,
          elevacao_altimetria: locality.elevacao_altimetria,
          dificuldade_nivel_tecnico: locality.dificuldade_nivel_tecnico,
          observacao: locality.observacao || '',
          selo_badge: locality.selo_badge || '',
        }
      : {
          nome: '',
          latitude: 39.5,
          longitude: -8.0,
          elevacao_altimetria: undefined,
          dificuldade_nivel_tecnico: 'media',
          observacao: '',
          selo_badge: '',
        },
  });

  const currentLat = form.watch('latitude');
  const currentLon = form.watch('longitude');
  const currentElevation = form.watch('elevacao_altimetria');

  const handleLocationSelect = (lat: number, lng: number) => {
    form.setValue('latitude', Math.round(lat * 1000000) / 1000000);
    form.setValue('longitude', Math.round(lng * 1000000) / 1000000);

    // Auto-suggest difficulty if we have previous locality
    if (previousLocality) {
      const elevationDiff = currentElevation && previousLocality.elevacao_altimetria
        ? currentElevation - previousLocality.elevacao_altimetria
        : undefined;
      // Distance will be calculated on save, so we estimate
      const suggestedDiff = suggestDifficulty(10, elevationDiff);
      form.setValue('dificuldade_nivel_tecnico', suggestedDiff);
    }
  };

  const handleSubmit = async (data: LocalityFormData) => {
    if (!validateCoordinates(data.latitude, data.longitude)) {
      form.setError('latitude', { message: 'Invalid coordinates' });
      return;
    }

    setIsSaving(true);
    try {
      await onSave(data);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Failed to save locality:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const previewLocality: Locality = {
    id: 'preview',
    percurso_id: '',
    nome: form.watch('nome') || 'New Locality',
    ordem_no_percurso: 0,
    latitude: currentLat,
    longitude: currentLon,
    elevacao_altimetria: currentElevation,
    distancia_localidade_anterior: 0,
    tempo_estimado_da_anterior: 0,
    dificuldade_nivel_tecnico: form.watch('dificuldade_nivel_tecnico'),
    observacao: form.watch('observacao'),
    selo_badge: form.watch('selo_badge'),
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit Locality' : 'Add New Locality'}</DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Form Column */}
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="nome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Porto" {...field} />
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
                            step="0.000001"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>-90 to +90</FormDescription>
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
                            step="0.000001"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                          />
                        </FormControl>
                        <FormDescription>-180 to +180</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="elevacao_altimetria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Elevation (m)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="e.g., 450"
                          {...field}
                          value={field.value ?? ''}
                          onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === '' ? undefined : parseInt(val));
                          }}
                        />
                      </FormControl>
                      <FormDescription>Optional - elevation in meters</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dificuldade_nivel_tecnico"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Difficulty Level *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="facil">Easy</SelectItem>
                          <SelectItem value="media">Medium</SelectItem>
                          <SelectItem value="dificil">Difficult</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="selo_badge"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Badge/Seal</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Historic Site" {...field} />
                      </FormControl>
                      <FormDescription>Optional badge or certification</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="observacao"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Additional observations or notes..."
                          className="min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Map Column */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <p className="text-sm text-muted-foreground mb-2">
                  Click on the map to set coordinates
                </p>
                <LocalityMap
                  localities={[previewLocality]}
                  selectedLocalityId="preview"
                  onLocationSelect={handleLocationSelect}
                  clickable
                  height="h-[500px]"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : isEdit ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
