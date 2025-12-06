import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { 
  MoreHorizontal, 
  Pencil, 
  Trash2, 
  Search,
  Clock,
  MapPin,
  CloudRain,
  Wind,
  Thermometer,
  Snowflake,
  CloudFog,
  CloudLightning,
  ThermometerSun
} from 'lucide-react';
import { AlertRule, AlertPriority, WeatherCondition } from '@/types/weather';
import { mockRoutes } from '@/data/weatherMocks';
import { cn } from '@/lib/utils';

interface AlertRulesListProps {
  rules: AlertRule[];
  onEdit: (rule: AlertRule) => void;
  onDelete: (ruleId: string) => void;
  onToggle: (ruleId: string) => void;
}

const priorityConfig: Record<AlertPriority, { label: string; className: string }> = {
  critical: { label: 'Crítica', className: 'bg-destructive text-destructive-foreground' },
  important: { label: 'Importante', className: 'bg-orange-500 text-white' },
  attention: { label: 'Atenção', className: 'bg-warning text-warning-foreground' },
  informative: { label: 'Informativa', className: 'bg-info text-info-foreground' },
};

const conditionIcons: Record<WeatherCondition, React.ReactNode> = {
  heavy_rain: <CloudRain className="h-4 w-4" />,
  strong_wind: <Wind className="h-4 w-4" />,
  low_temperature: <Thermometer className="h-4 w-4" />,
  high_temperature: <ThermometerSun className="h-4 w-4" />,
  snow: <Snowflake className="h-4 w-4" />,
  fog: <CloudFog className="h-4 w-4" />,
  thunderstorm: <CloudLightning className="h-4 w-4" />,
};

const conditionLabels: Record<WeatherCondition, string> = {
  heavy_rain: 'Chuva Forte',
  strong_wind: 'Vento Forte',
  low_temperature: 'Temp. Baixa',
  high_temperature: 'Temp. Alta',
  snow: 'Neve',
  fog: 'Nevoeiro',
  thunderstorm: 'Trovoada',
};

export function AlertRulesList({ rules, onEdit, onDelete, onToggle }: AlertRulesListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteRuleId, setDeleteRuleId] = useState<string | null>(null);

  const filteredRules = rules.filter(rule =>
    rule.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRouteNames = (routeIds: string[]) => {
    return routeIds
      .map(id => mockRoutes.find(r => r.id === id)?.name)
      .filter(Boolean)
      .join(', ');
  };

  const handleDeleteConfirm = () => {
    if (deleteRuleId) {
      onDelete(deleteRuleId);
      setDeleteRuleId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Pesquisar regras..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Rules List */}
      <div className="grid gap-4">
        {filteredRules.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <CloudRain className="h-12 w-12 mb-4 opacity-40" />
              <p className="text-lg font-medium">Nenhuma regra encontrada</p>
              <p className="text-sm">Crie uma nova regra de alerta para começar</p>
            </CardContent>
          </Card>
        ) : (
          filteredRules.map((rule) => (
            <Card key={rule.id} className={cn(!rule.isActive && 'opacity-60')}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={rule.isActive}
                        onCheckedChange={() => onToggle(rule.id)}
                      />
                      <div>
                        <CardTitle className="text-lg">{rule.name}</CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={priorityConfig[rule.priority].className}>
                            {priorityConfig[rule.priority].label}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {rule.timeWindowStart} - {rule.timeWindowEnd}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover">
                      <DropdownMenuItem onClick={() => onEdit(rule)}>
                        <Pencil className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => setDeleteRuleId(rule.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid gap-3 md:grid-cols-2">
                  {/* Conditions */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">Condições</p>
                    <div className="flex flex-wrap gap-1.5">
                      {rule.conditions.map((condition) => (
                        <Badge key={condition} variant="outline" className="gap-1">
                          {conditionIcons[condition]}
                          {conditionLabels[condition]}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Routes */}
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      Percursos Aplicáveis
                    </p>
                    <p className="text-sm text-foreground">
                      {getRouteNames(rule.routeIds) || 'Nenhum percurso selecionado'}
                    </p>
                    {rule.localityIds.length > 0 && (
                      <p className="text-xs text-muted-foreground mt-1">
                        + {rule.localityIds.length} localidade(s) específica(s)
                      </p>
                    )}
                  </div>
                </div>

                {/* Message Template */}
                <div className="mt-3 pt-3 border-t">
                  <p className="text-xs font-medium text-muted-foreground mb-1">Modelo de Mensagem</p>
                  <p className="text-sm text-muted-foreground italic">
                    "{rule.messageTemplate}"
                  </p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteRuleId} onOpenChange={() => setDeleteRuleId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Regra de Alerta</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que deseja eliminar esta regra? Esta ação não pode ser revertida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
