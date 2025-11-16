import { Calendar, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ItineraryStage,
  SCHEDULE_STATUS_LABELS,
  SCHEDULE_TYPE_LABELS,
} from '@/types/premium-itinerary';

interface SchedulesOverviewProps {
  stages: ItineraryStage[];
}

export const SchedulesOverview = ({ stages }: SchedulesOverviewProps) => {
  const allSchedules = stages.flatMap((stage) =>
    stage.schedules.map((schedule) => ({
      ...schedule,
      stageTitle: stage.title,
      stageOrder: stage.order,
    }))
  );

  const totalCost = allSchedules.reduce(
    (sum, schedule) => sum + (schedule.cost || 0),
    0
  );

  const confirmedCount = allSchedules.filter(
    (s) => s.status === 'confirmed'
  ).length;
  const pendingCount = allSchedules.filter(
    (s) => s.status === 'pending'
  ).length;

  if (allSchedules.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhuma programação criada ainda</p>
        <p className="text-sm text-muted-foreground mt-2">
          Adicione programações às etapas do roteiro
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Calendar className="w-4 h-4" />
            Total de Programações
          </div>
          <div className="text-2xl font-bold">{allSchedules.length}</div>
          <p className="text-xs text-muted-foreground mt-1">
            {confirmedCount} confirmadas, {pendingCount} pendentes
          </p>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <DollarSign className="w-4 h-4" />
            Custo Total
          </div>
          <div className="text-2xl font-bold">€{totalCost.toFixed(2)}</div>
          <p className="text-xs text-muted-foreground mt-1">
            Soma de todas as programações
          </p>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <div className="text-sm text-muted-foreground mb-1">Taxa de Confirmação</div>
          <div className="text-2xl font-bold">
            {allSchedules.length > 0
              ? Math.round((confirmedCount / allSchedules.length) * 100)
              : 0}
            %
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {confirmedCount} de {allSchedules.length}
          </p>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Etapa</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Título</TableHead>
            <TableHead>Serviço</TableHead>
            <TableHead>Referência</TableHead>
            <TableHead>Custo</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allSchedules.map((schedule) => (
            <TableRow key={schedule.id}>
              <TableCell>
                <Badge variant="outline">#{schedule.stageOrder}</Badge>
              </TableCell>
              <TableCell>
                <span className="text-sm">{SCHEDULE_TYPE_LABELS[schedule.type]}</span>
              </TableCell>
              <TableCell className="font-medium">{schedule.title}</TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {schedule.serviceName || '-'}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm text-muted-foreground">
                  {schedule.bookingReference || '-'}
                </span>
              </TableCell>
              <TableCell>
                <span className="text-sm font-medium">
                  {schedule.cost ? `€${schedule.cost.toFixed(2)}` : '-'}
                </span>
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    schedule.status === 'confirmed'
                      ? 'default'
                      : schedule.status === 'pending'
                      ? 'secondary'
                      : 'destructive'
                  }
                >
                  {SCHEDULE_STATUS_LABELS[schedule.status]}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
