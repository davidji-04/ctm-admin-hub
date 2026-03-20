import { Edit, Trash2, MapPin, Mountain, Tag, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Locality } from '@/types/locality';
import { TransitionBlock } from './TransitionBlock';
import { useNavigate } from 'react-router-dom';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from 'lucide-react';

interface LocalitySequenceListProps {
  localities: Locality[];
  onEdit: (locality: Locality) => void;
  onDelete: (locality: Locality) => void;
  onReorder: (event: DragEndEvent) => void;
}

const SortableLocalityItem = ({
  locality,
  showTransition,
  onEdit,
  onDelete,
}: {
  locality: Locality;
  showTransition: boolean;
  onEdit: (locality: Locality) => void;
  onDelete: (locality: Locality) => void;
}) => {
  const navigate = useNavigate();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: locality.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleViewServices = () => {
    navigate(`/services?locality=${locality.id}`);
  };

  return (
    <>
      <Card ref={setNodeRef} style={style} className="hover:shadow-md transition-shadow">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div
              {...attributes}
              {...listeners}
              className="cursor-grab active:cursor-grabbing pt-1"
            >
              <GripVertical className="w-5 h-5 text-muted-foreground" />
            </div>

            <div className="flex-1 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-baseline gap-2">
                  <span className="text-lg font-bold text-primary">#{locality.ordem_no_percurso}</span>
                  <h3 className="text-lg font-semibold">{locality.nome}</h3>
                </div>
                {locality.selo_badge && (
                  <Badge variant="secondary" className="shrink-0">
                    <Tag className="w-3 h-3 mr-1" />
                    {locality.selo_badge}
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {locality.latitude.toFixed(6)}, {locality.longitude.toFixed(6)}
                  </span>
                </div>
                {locality.elevacao_altimetria && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Mountain className="w-4 h-4" />
                    <span>{locality.elevacao_altimetria}m</span>
                  </div>
                )}
              </div>

              {locality.observacao && (
                <p className="text-sm text-muted-foreground">{locality.observacao}</p>
              )}

              <div className="flex items-center gap-2 pt-2 border-t">

                <Button variant="outline" size="sm" onClick={handleViewServices}>
                  <ExternalLink className="w-3 h-3 mr-1" />
                  Ver Serviços
                </Button>

              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {showTransition && (
        <TransitionBlock
          distance={locality.distancia_localidade_anterior}
          time={locality.tempo_estimado_da_anterior}
          difficulty={locality.dificuldade_nivel_tecnico}
        />
      )}
    </>
  );
};

export const LocalitySequenceList = ({
  localities,
  onEdit,
  onDelete,
  onReorder,
}: LocalitySequenceListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (localities.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Nenhuma localidade adicionada. Use os botões acima para adicionar localidades.
        </p>
      </div>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={onReorder}
    >
      <SortableContext
        items={localities.map((l) => l.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-1">
          {localities.map((locality, index) => (
            <SortableLocalityItem
              key={locality.id}
              locality={locality}
              showTransition={index < localities.length - 1}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};
