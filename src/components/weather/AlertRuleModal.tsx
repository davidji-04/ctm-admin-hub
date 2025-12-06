import { useEffect, useState } from 'react';
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
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { 
  CloudRain, 
  Wind, 
  Thermometer, 
  Snowflake, 
  CloudFog, 
  CloudLightning,
  ThermometerSun,
  X 
} from 'lucide-react';
import { AlertRule, AlertPriority, WeatherCondition, WEATHER_CONDITIONS } from '@/types/weather';
import { mockRoutes, mockLocalities } from '@/data/weatherMocks';

interface AlertRuleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rule: AlertRule | null;
  onSave: (ruleData: Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

const formSchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  priority: z.enum(['critical', 'important', 'attention', 'informative']),
  conditions: z.array(z.string()).min(1, 'Selecione pelo menos uma condição'),
  routeIds: z.array(z.string()).min(1, 'Selecione pelo menos um percurso'),
  localityIds: z.array(z.string()),
  timeWindowStart: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (HH:mm)'),
  timeWindowEnd: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Formato inválido (HH:mm)'),
  messageTemplate: z.string().min(10, 'Modelo de mensagem deve ter pelo menos 10 caracteres'),
  isActive: z.boolean(),
});

type FormData = z.infer<typeof formSchema>;

const conditionIcons: Record<WeatherCondition, React.ReactNode> = {
  heavy_rain: <CloudRain className="h-4 w-4" />,
  strong_wind: <Wind className="h-4 w-4" />,
  low_temperature: <Thermometer className="h-4 w-4" />,
  high_temperature: <ThermometerSun className="h-4 w-4" />,
  snow: <Snowflake className="h-4 w-4" />,
  fog: <CloudFog className="h-4 w-4" />,
  thunderstorm: <CloudLightning className="h-4 w-4" />,
};

const priorityOptions: { value: AlertPriority; label: string }[] = [
  { value: 'critical', label: 'Crítica' },
  { value: 'important', label: 'Importante' },
  { value: 'attention', label: 'Atenção' },
  { value: 'informative', label: 'Informativa' },
];

export function AlertRuleModal({ open, onOpenChange, rule, onSave }: AlertRuleModalProps) {
  const [availableLocalities, setAvailableLocalities] = useState(mockLocalities);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      priority: 'attention',
      conditions: [],
      routeIds: [],
      localityIds: [],
      timeWindowStart: '06:00',
      timeWindowEnd: '20:00',
      messageTemplate: 'Alerta em [Nome do Percurso] perto de [Nome da Localidade]: [Condição].',
      isActive: true,
    },
  });

  const selectedRouteIds = form.watch('routeIds');

  // Update available localities when routes change
  useEffect(() => {
    if (selectedRouteIds.length > 0) {
      setAvailableLocalities(
        mockLocalities.filter(loc => selectedRouteIds.includes(loc.routeId))
      );
    } else {
      setAvailableLocalities([]);
    }
    // Clear locality selection if routes change
    form.setValue('localityIds', []);
  }, [selectedRouteIds, form]);

  // Populate form when editing
  useEffect(() => {
    if (rule) {
      form.reset({
        name: rule.name,
        priority: rule.priority,
        conditions: rule.conditions,
        routeIds: rule.routeIds,
        localityIds: rule.localityIds,
        timeWindowStart: rule.timeWindowStart,
        timeWindowEnd: rule.timeWindowEnd,
        messageTemplate: rule.messageTemplate,
        isActive: rule.isActive,
      });
    } else {
      form.reset({
        name: '',
        priority: 'attention',
        conditions: [],
        routeIds: [],
        localityIds: [],
        timeWindowStart: '06:00',
        timeWindowEnd: '20:00',
        messageTemplate: 'Alerta em [Nome do Percurso] perto de [Nome da Localidade]: [Condição].',
        isActive: true,
      });
    }
  }, [rule, form, open]);

  const handleSubmit = (data: FormData) => {
    onSave({
      name: data.name,
      priority: data.priority,
      conditions: data.conditions as WeatherCondition[],
      routeIds: data.routeIds,
      localityIds: data.localityIds,
      timeWindowStart: data.timeWindowStart,
      timeWindowEnd: data.timeWindowEnd,
      messageTemplate: data.messageTemplate,
      isActive: data.isActive,
    });
  };

  const toggleCondition = (conditionId: string) => {
    const current = form.getValues('conditions');
    if (current.includes(conditionId)) {
      form.setValue('conditions', current.filter(c => c !== conditionId));
    } else {
      form.setValue('conditions', [...current, conditionId]);
    }
  };

  const toggleRoute = (routeId: string) => {
    const current = form.getValues('routeIds');
    if (current.includes(routeId)) {
      form.setValue('routeIds', current.filter(r => r !== routeId));
    } else {
      form.setValue('routeIds', [...current, routeId]);
    }
  };

  const toggleLocality = (localityId: string) => {
    const current = form.getValues('localityIds');
    if (current.includes(localityId)) {
      form.setValue('localityIds', current.filter(l => l !== localityId));
    } else {
      form.setValue('localityIds', [...current, localityId]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>
            {rule ? 'Editar Regra de Alerta' : 'Nova Regra de Alerta'}
          </DialogTitle>
          <DialogDescription>
            Configure as condições que irão acionar alertas meteorológicos
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col flex-1 overflow-hidden">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-6 pb-4">
                {/* Basic Info */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Regra *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Alerta Chuva Forte - Norte" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="priority"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Prioridade *</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecionar prioridade" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-popover">
                            {priorityOptions.map(opt => (
                              <SelectItem key={opt.value} value={opt.value}>
                                {opt.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* Conditions */}
                <FormField
                  control={form.control}
                  name="conditions"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condições Críticas *</FormLabel>
                      <FormDescription>
                        Selecione as condições meteorológicas que devem acionar o alerta
                      </FormDescription>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {WEATHER_CONDITIONS.map(condition => (
                          <div
                            key={condition.id}
                            onClick={() => toggleCondition(condition.id)}
                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                              field.value.includes(condition.id)
                                ? 'border-primary bg-primary/10'
                                : 'border-border hover:bg-muted/50'
                            }`}
                          >
                            <Checkbox 
                              checked={field.value.includes(condition.id)}
                              onCheckedChange={() => toggleCondition(condition.id)}
                            />
                            <div className="flex items-center gap-2">
                              {conditionIcons[condition.id]}
                              <div>
                                <p className="text-sm font-medium">{condition.label}</p>
                                <p className="text-xs text-muted-foreground">{condition.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Separator />

                {/* Routes Selection */}
                <FormField
                  control={form.control}
                  name="routeIds"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Percursos Aplicáveis *</FormLabel>
                      <FormDescription>
                        Selecione os percursos onde esta regra será aplicada
                      </FormDescription>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {mockRoutes.map(route => (
                          <Badge
                            key={route.id}
                            variant={field.value.includes(route.id) ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => toggleRoute(route.id)}
                          >
                            {route.name}
                            {field.value.includes(route.id) && (
                              <X className="h-3 w-3 ml-1" />
                            )}
                          </Badge>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Localities Selection (Optional) */}
                {availableLocalities.length > 0 && (
                  <FormField
                    control={form.control}
                    name="localityIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Localidades Específicas (Opcional)</FormLabel>
                        <FormDescription>
                          Deixe vazio para aplicar a todas as localidades dos percursos selecionados
                        </FormDescription>
                        <ScrollArea className="h-32 border rounded-md p-2">
                          <div className="space-y-1">
                            {availableLocalities.map(locality => (
                              <div
                                key={locality.id}
                                className="flex items-center gap-2 p-2 hover:bg-muted/50 rounded cursor-pointer"
                                onClick={() => toggleLocality(locality.id)}
                              >
                                <Checkbox 
                                  checked={field.value.includes(locality.id)}
                                  onCheckedChange={() => toggleLocality(locality.id)}
                                />
                                <span className="text-sm">{locality.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  ({mockRoutes.find(r => r.id === locality.routeId)?.name})
                                </span>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </FormItem>
                    )}
                  />
                )}

                <Separator />

                {/* Time Window */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="timeWindowStart"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hora de Início *</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timeWindowEnd"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hora de Fim *</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <Separator />

                {/* Message Template */}
                <FormField
                  control={form.control}
                  name="messageTemplate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modelo de Mensagem *</FormLabel>
                      <FormDescription>
                        Use variáveis: [Nome do Percurso], [Nome da Localidade], [Condição]
                      </FormDescription>
                      <FormControl>
                        <Textarea 
                          placeholder="Ex: Alerta em [Nome do Percurso] perto de [Nome da Localidade]: [Condição]."
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Active Toggle */}
                <FormField
                  control={form.control}
                  name="isActive"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Regra Ativa</FormLabel>
                        <FormDescription>
                          Desative para pausar temporariamente os alertas desta regra
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </ScrollArea>

            <DialogFooter className="pt-4 border-t mt-4">
              <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                Cancelar
              </Button>
              <Button type="submit">
                {rule ? 'Guardar Alterações' : 'Criar Regra'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
