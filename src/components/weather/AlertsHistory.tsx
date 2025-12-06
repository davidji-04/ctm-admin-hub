import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { 
  Search, 
  Filter, 
  CalendarIcon, 
  Check, 
  X,
  Download,
  AlertCircle,
  AlertTriangle,
  Info,
  Zap
} from 'lucide-react';
import { AlertRule, WeatherAlert, AlertPriority } from '@/types/weather';
import { mockRoutes } from '@/data/weatherMocks';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface AlertsHistoryProps {
  alerts: WeatherAlert[];
  rules: AlertRule[];
  onDismiss: (alertId: string) => void;
}

const priorityConfig: Record<AlertPriority, { label: string; icon: React.ReactNode; className: string }> = {
  critical: { 
    label: 'Crítica', 
    icon: <AlertCircle className="h-4 w-4" />,
    className: 'text-destructive' 
  },
  important: { 
    label: 'Importante', 
    icon: <Zap className="h-4 w-4" />,
    className: 'text-orange-500' 
  },
  attention: { 
    label: 'Atenção', 
    icon: <AlertTriangle className="h-4 w-4" />,
    className: 'text-yellow-500' 
  },
  informative: { 
    label: 'Informativa', 
    icon: <Info className="h-4 w-4" />,
    className: 'text-blue-500' 
  },
};

const statusConfig = {
  active: { label: 'Ativo', className: 'bg-destructive text-destructive-foreground' },
  dismissed: { label: 'Dispensado', className: 'bg-muted text-muted-foreground' },
  expired: { label: 'Expirado', className: 'bg-secondary text-secondary-foreground' },
};

export function AlertsHistory({ alerts, rules, onDismiss }: AlertsHistoryProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRule, setSelectedRule] = useState<string>('all');
  const [selectedRoute, setSelectedRoute] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({});
  const [showFilters, setShowFilters] = useState(false);

  const filteredAlerts = useMemo(() => {
    return alerts.filter(alert => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        if (
          !alert.message.toLowerCase().includes(query) &&
          !alert.localityName.toLowerCase().includes(query) &&
          !alert.routeName.toLowerCase().includes(query)
        ) {
          return false;
        }
      }

      // Rule filter
      if (selectedRule !== 'all' && alert.ruleId !== selectedRule) {
        return false;
      }

      // Route filter
      if (selectedRoute !== 'all' && alert.routeId !== selectedRoute) {
        return false;
      }

      // Status filter
      if (selectedStatus !== 'all' && alert.status !== selectedStatus) {
        return false;
      }

      // Date range filter
      if (dateRange.from && alert.triggeredAt < dateRange.from) {
        return false;
      }
      if (dateRange.to) {
        const endOfDay = new Date(dateRange.to);
        endOfDay.setHours(23, 59, 59, 999);
        if (alert.triggeredAt > endOfDay) {
          return false;
        }
      }

      return true;
    }).sort((a, b) => b.triggeredAt.getTime() - a.triggeredAt.getTime());
  }, [alerts, searchQuery, selectedRule, selectedRoute, selectedStatus, dateRange]);

  const handleExport = () => {
    // Simulated export - in production would generate CSV/Excel
    const csvContent = [
      ['Data/Hora', 'Percurso', 'Localidade', 'Condição', 'Prioridade', 'Estado', 'Mensagem'].join(','),
      ...filteredAlerts.map(alert => [
        format(alert.triggeredAt, 'dd/MM/yyyy HH:mm'),
        alert.routeName,
        alert.localityName,
        alert.condition,
        priorityConfig[alert.priority].label,
        statusConfig[alert.status].label,
        `"${alert.message}"`
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `alertas_meteorologicos_${format(new Date(), 'yyyyMMdd')}.csv`;
    link.click();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRule('all');
    setSelectedRoute('all');
    setSelectedStatus('all');
    setDateRange({});
  };

  const hasActiveFilters = searchQuery || selectedRule !== 'all' || selectedRoute !== 'all' || selectedStatus !== 'all' || dateRange.from || dateRange.to;

  return (
    <div className="space-y-4">
      {/* Filters Bar */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex flex-1 gap-4 flex-wrap">
              {/* Search */}
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar alertas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              {/* Toggle Filters */}
              <Button 
                variant="outline" 
                onClick={() => setShowFilters(!showFilters)}
                className={cn(hasActiveFilters && 'border-primary')}
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                {hasActiveFilters && (
                  <Badge variant="secondary" className="ml-2">
                    {[selectedRule !== 'all', selectedRoute !== 'all', selectedStatus !== 'all', dateRange.from].filter(Boolean).length}
                  </Badge>
                )}
              </Button>
            </div>

            <Button variant="outline" onClick={handleExport} className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {/* Rule Filter */}
              <div className="space-y-2">
                <Label>Regra</Label>
                <Select value={selectedRule} onValueChange={setSelectedRule}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todas as regras" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all">Todas as regras</SelectItem>
                    {rules.map(rule => (
                      <SelectItem key={rule.id} value={rule.id}>{rule.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Route Filter */}
              <div className="space-y-2">
                <Label>Percurso</Label>
                <Select value={selectedRoute} onValueChange={setSelectedRoute}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os percursos" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all">Todos os percursos</SelectItem>
                    {mockRoutes.map(route => (
                      <SelectItem key={route.id} value={route.id}>{route.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Status Filter */}
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger>
                    <SelectValue placeholder="Todos os estados" />
                  </SelectTrigger>
                  <SelectContent className="bg-popover">
                    <SelectItem value="all">Todos os estados</SelectItem>
                    <SelectItem value="active">Ativo</SelectItem>
                    <SelectItem value="dismissed">Dispensado</SelectItem>
                    <SelectItem value="expired">Expirado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Range */}
              <div className="space-y-2">
                <Label>Período</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateRange.from ? (
                        dateRange.to ? (
                          <>
                            {format(dateRange.from, 'dd/MM/yy')} - {format(dateRange.to, 'dd/MM/yy')}
                          </>
                        ) : (
                          format(dateRange.from, 'dd/MM/yyyy')
                        )
                      ) : (
                        <span className="text-muted-foreground">Selecionar datas</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-popover" align="start">
                    <Calendar
                      mode="range"
                      selected={{ from: dateRange.from, to: dateRange.to }}
                      onSelect={(range) => setDateRange({ from: range?.from, to: range?.to })}
                      locale={pt}
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {hasActiveFilters && (
                <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Limpar filtros
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alerts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Histórico de Alertas
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({filteredAlerts.length} {filteredAlerts.length === 1 ? 'alerta' : 'alertas'})
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredAlerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <AlertTriangle className="h-12 w-12 mb-4 opacity-40" />
              <p className="text-lg font-medium">Nenhum alerta encontrado</p>
              <p className="text-sm">Ajuste os filtros ou aguarde novos alertas</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data/Hora</TableHead>
                    <TableHead>Percurso</TableHead>
                    <TableHead>Localidade</TableHead>
                    <TableHead>Condição</TableHead>
                    <TableHead>Prioridade</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAlerts.map((alert) => (
                    <TableRow key={alert.id}>
                      <TableCell className="whitespace-nowrap">
                        <div>
                          <p className="font-medium">
                            {format(alert.triggeredAt, 'dd/MM/yyyy')}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {format(alert.triggeredAt, 'HH:mm')}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{alert.routeName}</TableCell>
                      <TableCell>{alert.localityName}</TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{alert.conditionValue}</p>
                          <p className="text-xs text-muted-foreground">{alert.condition}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className={cn('flex items-center gap-1.5', priorityConfig[alert.priority].className)}>
                          {priorityConfig[alert.priority].icon}
                          <span className="text-sm">{priorityConfig[alert.priority].label}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusConfig[alert.status].className}>
                          {statusConfig[alert.status].label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {alert.status === 'active' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => onDismiss(alert.id)}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Dispensar
                          </Button>
                        )}
                        {alert.status === 'dismissed' && alert.dismissedBy && (
                          <span className="text-xs text-muted-foreground">
                            por {alert.dismissedBy.split('@')[0]}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
