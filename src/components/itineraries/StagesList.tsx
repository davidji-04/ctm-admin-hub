import { useState } from 'react';
import { Edit, Trash2, MapPin, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ItineraryStage, SCHEDULE_STATUS_LABELS } from '@/types/premium-itinerary';
import { AddEditStageModal } from './AddEditStageModal';
import { AddEditScheduleModal } from './AddEditScheduleModal';

interface StagesListProps {
  stages: ItineraryStage[];
}

export const StagesList = ({ stages }: StagesListProps) => {
  const [editingStage, setEditingStage] = useState<ItineraryStage | undefined>();
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedStageForSchedule, setSelectedStageForSchedule] = useState<ItineraryStage | undefined>();

  const getDifficultyColor = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-500';
      case 'moderate':
        return 'text-yellow-500';
      case 'difficult':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getDifficultyLabel = (difficulty?: string) => {
    switch (difficulty) {
      case 'easy':
        return 'Fácil';
      case 'moderate':
        return 'Moderado';
      case 'difficult':
        return 'Difícil';
      default:
        return 'N/A';
    }
  };

  if (stages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Nenhuma etapa criada ainda</p>
        <p className="text-sm text-muted-foreground mt-2">
          Adicione etapas personalizadas baseadas nas capacidades do cliente
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4">
        {stages.map((stage) => (
        <Card key={stage.id}>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">#{stage.order}</Badge>
                  <CardTitle className="text-xl">{stage.title}</CardTitle>
                </div>
                {stage.description && (
                  <CardDescription>{stage.description}</CardDescription>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setEditingStage(stage);
                    setIsStageModalOpen(true);
                  }}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {stage.startLocalityName && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium">Início</p>
                    <p className="text-sm text-muted-foreground">
                      {stage.startLocalityName}
                    </p>
                  </div>
                </div>
              )}
              {stage.endLocalityName && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 text-red-500" />
                  <div>
                    <p className="text-sm font-medium">Fim</p>
                    <p className="text-sm text-muted-foreground">
                      {stage.endLocalityName}
                    </p>
                  </div>
                </div>
              )}
              {stage.distance !== undefined && (
                <div className="flex items-start gap-2">
                  <TrendingUp className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Distância</p>
                    <p className="text-sm text-muted-foreground">
                      {stage.distance.toFixed(1)} km
                    </p>
                  </div>
                </div>
              )}
              {stage.estimatedDuration !== undefined && (
                <div className="flex items-start gap-2">
                  <Clock className="w-4 h-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Duração</p>
                    <p className="text-sm text-muted-foreground">
                      {stage.estimatedDuration.toFixed(1)}h
                    </p>
                  </div>
                </div>
              )}
            </div>

            {stage.difficulty && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Dificuldade:</span>
                <span className={`text-sm font-medium ${getDifficultyColor(stage.difficulty)}`}>
                  {getDifficultyLabel(stage.difficulty)}
                </span>
              </div>
            )}

            {stage.schedules.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium">
                  Programações ({stage.schedules.length})
                </p>
                <div className="space-y-2">
                  {stage.schedules.map((schedule) => (
                    <div
                      key={schedule.id}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-medium">{schedule.title}</p>
                        {schedule.bookingReference && (
                          <p className="text-xs text-muted-foreground">
                            Ref: {schedule.bookingReference}
                          </p>
                        )}
                      </div>
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
                    </div>
                  ))}
                </div>
              </div>
            )}

            {stage.notes && (
              <div className="pt-2 border-t">
                <p className="text-sm font-medium mb-1">Notas</p>
                <p className="text-sm text-muted-foreground">{stage.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
        ))}
      </div>

      <AddEditStageModal
        open={isStageModalOpen}
        onOpenChange={setIsStageModalOpen}
        stage={editingStage}
        order={stages.length + 1}
      />

      <AddEditScheduleModal
        open={isScheduleModalOpen}
        onOpenChange={setIsScheduleModalOpen}
        stageTitle={selectedStageForSchedule?.title || ''}
      />
    </>
  );
};
