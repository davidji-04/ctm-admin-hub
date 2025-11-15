import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Upload,
  GripVertical,
  Edit,
  Trash2,
  ArrowLeft,
  MapPin,
  Mountain,
  Clock,
} from 'lucide-react';
import { LocalityMap } from '@/components/localities/LocalityMap';
import { AddEditLocalityModal } from '@/components/localities/AddEditLocalityModal';
import { GPXImportModal } from '@/components/localities/GPXImportModal';
import { Locality, LocalityFormData } from '@/types/locality';
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
import {
  calculateDistance,
  calculateEstimatedTime,
  recalculateAllDistances,
  validateLocalityDistance,
  suggestDifficulty,
} from '@/utils/localityCalculations';

// Mock user role
const getUserRole = (): 'admin' | 'editor' => 'admin';

const SortableLocalityRow = ({ locality, onEdit, onDelete }: {
  locality: Locality;
  onEdit: () => void;
  onDelete: () => void;
}) => {
  const userRole = getUserRole();
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: locality.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facil':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'media':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'dificil':
        return 'bg-red-500/10 text-red-700 border-red-200';
      default:
        return 'bg-muted';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border rounded-lg p-4 bg-card hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-4">
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="h-5 w-5 text-muted-foreground" />
        </div>

        <div className="flex-1 grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <div className="font-semibold text-foreground">{locality.nome}</div>
            <div className="text-sm text-muted-foreground">
              Position #{locality.ordem_no_percurso + 1}
            </div>
            {locality.selo_badge && (
              <Badge variant="secondary" className="mt-1">
                {locality.selo_badge}
              </Badge>
            )}
          </div>

          <div className="space-y-1">
            <div className="text-xs text-muted-foreground">Coordinates</div>
            <div className="text-sm font-mono">
              {locality.latitude.toFixed(4)}, {locality.longitude.toFixed(4)}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <MapPin className="h-3 w-3" />
              Distance
            </div>
            <div className="text-sm font-medium">
              {locality.distancia_localidade_anterior > 0
                ? `${locality.distancia_localidade_anterior} km`
                : 'Start'}
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              Time
            </div>
            <div className="text-sm font-medium">
              {locality.tempo_estimado_da_anterior > 0
                ? `${Math.floor(locality.tempo_estimado_da_anterior / 60)}h ${locality.tempo_estimado_da_anterior % 60}m`
                : '-'}
            </div>
            {locality.elevacao_altimetria && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Mountain className="h-3 w-3" />
                {locality.elevacao_altimetria}m
              </div>
            )}
          </div>

          <div className="flex items-center justify-between gap-2">
            <Badge className={getDifficultyColor(locality.dificuldade_nivel_tecnico)}>
              {locality.dificuldade_nivel_tecnico === 'facil' && 'Easy'}
              {locality.dificuldade_nivel_tecnico === 'media' && 'Medium'}
              {locality.dificuldade_nivel_tecnico === 'dificil' && 'Difficult'}
            </Badge>

            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={onEdit}>
                <Edit className="h-4 w-4" />
              </Button>
              {userRole === 'admin' && (
                <Button variant="ghost" size="icon" onClick={onDelete} className="text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const LocalitiesManager = () => {
  const { routeId } = useParams<{ routeId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const userRole = getUserRole();

  const [localities, setLocalities] = useState<Locality[]>([]);
  const [selectedLocality, setSelectedLocality] = useState<Locality | undefined>();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showGPXModal, setShowGPXModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Locality | null>(null);
  const [routeName, setRouteName] = useState('Caminho Português');
  const [isLoading, setIsLoading] = useState(true);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadLocalities();
  }, [routeId]);

  const loadLocalities = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock data
      const mockLocalities: Locality[] = [
        {
          id: '1',
          percurso_id: routeId || '',
          nome: 'Porto',
          ordem_no_percurso: 0,
          latitude: 41.1579,
          longitude: -8.6291,
          elevacao_altimetria: 104,
          distancia_localidade_anterior: 0,
          tempo_estimado_da_anterior: 0,
          dificuldade_nivel_tecnico: 'facil',
          selo_badge: 'UNESCO',
        },
        {
          id: '2',
          percurso_id: routeId || '',
          nome: 'Vila do Conde',
          ordem_no_percurso: 1,
          latitude: 41.3517,
          longitude: -8.7391,
          elevacao_altimetria: 25,
          distancia_localidade_anterior: 27.5,
          tempo_estimado_da_anterior: 330,
          dificuldade_nivel_tecnico: 'media',
        },
        {
          id: '3',
          percurso_id: routeId || '',
          nome: 'Barcelos',
          ordem_no_percurso: 2,
          latitude: 41.5318,
          longitude: -8.6174,
          elevacao_altimetria: 39,
          distancia_localidade_anterior: 22.3,
          tempo_estimado_da_anterior: 268,
          dificuldade_nivel_tecnico: 'media',
          selo_badge: 'Historic',
        },
      ];

      setLocalities(mockLocalities);
    } catch (error) {
      toast({
        title: 'Failed to load localities',
        description: 'Please try again',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = localities.findIndex((l) => l.id === active.id);
    const newIndex = localities.findIndex((l) => l.id === over.id);

    const reordered = arrayMove(localities, oldIndex, newIndex).map((loc, idx) => ({
      ...loc,
      ordem_no_percurso: idx,
    }));

    const recalculated = recalculateAllDistances(reordered);
    setLocalities(recalculated);

    toast({
      title: 'Localities reordered',
      description: 'Distances and times have been recalculated',
    });
  };

  const handleAddLocality = async (data: LocalityFormData) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const previousLocality = localities[localities.length - 1];
      let distance = 0;
      let time = 0;
      let suggestedDiff: 'facil' | 'media' | 'dificil' = data.dificuldade_nivel_tecnico;

      if (previousLocality) {
        distance = calculateDistance(
          previousLocality.latitude,
          previousLocality.longitude,
          data.latitude,
          data.longitude
        );

        if (!validateLocalityDistance(distance)) {
          toast({
            title: 'Distance too large',
            description: 'Distance between localities cannot exceed 200km',
            variant: 'destructive',
          });
          throw new Error('Distance validation failed');
        }

        const elevationDiff = data.elevacao_altimetria && previousLocality.elevacao_altimetria
          ? data.elevacao_altimetria - previousLocality.elevacao_altimetria
          : undefined;

        time = calculateEstimatedTime(distance, elevationDiff);
        suggestedDiff = suggestDifficulty(distance, elevationDiff);
      }

      const newLocality: Locality = {
        id: `loc-${Date.now()}`,
        percurso_id: routeId || '',
        ...data,
        ordem_no_percurso: localities.length,
        distancia_localidade_anterior: distance,
        tempo_estimado_da_anterior: time,
        dificuldade_nivel_tecnico: data.dificuldade_nivel_tecnico || suggestedDiff,
      };

      setLocalities([...localities, newLocality]);

      toast({
        title: 'Locality added',
        description: `${newLocality.nome} has been added to the route`,
      });
    } catch (error) {
      console.error('Failed to add locality:', error);
      throw error;
    }
  };

  const handleEditLocality = async (data: LocalityFormData) => {
    if (!selectedLocality) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const updatedLocalities = localities.map((loc) =>
        loc.id === selectedLocality.id
          ? { ...loc, ...data }
          : loc
      );

      const recalculated = recalculateAllDistances(updatedLocalities);
      setLocalities(recalculated);

      toast({
        title: 'Locality updated',
        description: 'Distances have been recalculated',
      });

      setSelectedLocality(undefined);
    } catch (error) {
      console.error('Failed to update locality:', error);
      throw error;
    }
  };

  const handleDeleteLocality = async () => {
    if (!deleteTarget) return;

    if (localities.length <= 2) {
      toast({
        title: 'Cannot delete',
        description: 'A route must have at least 2 localities',
        variant: 'destructive',
      });
      setDeleteTarget(null);
      return;
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 500));

      const filtered = localities.filter((l) => l.id !== deleteTarget.id);
      const reordered = filtered.map((loc, idx) => ({ ...loc, ordem_no_percurso: idx }));
      const recalculated = recalculateAllDistances(reordered);

      setLocalities(recalculated);

      toast({
        title: 'Locality deleted',
        description: 'Route has been updated',
      });

      setDeleteTarget(null);
    } catch (error) {
      toast({
        title: 'Failed to delete',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const handleGPXImport = async (importedData: LocalityFormData[]) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const newLocalities: Locality[] = importedData.map((data, index) => ({
        id: `gpx-${Date.now()}-${index}`,
        percurso_id: routeId || '',
        ...data,
        ordem_no_percurso: localities.length + index,
        distancia_localidade_anterior: 0,
        tempo_estimado_da_anterior: 0,
      }));

      const combined = [...localities, ...newLocalities];
      const recalculated = recalculateAllDistances(combined);

      setLocalities(recalculated);
    } catch (error) {
      console.error('Failed to import GPX:', error);
      throw error;
    }
  };

  const totalDistance = localities.reduce((sum, loc) => sum + loc.distancia_localidade_anterior, 0);
  const totalTime = localities.reduce((sum, loc) => sum + loc.tempo_estimado_da_anterior, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/routes')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Localities</h1>
            <p className="text-muted-foreground">{routeName}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {userRole === 'admin' && (
            <Button variant="outline" onClick={() => setShowGPXModal(true)}>
              <Upload className="h-4 w-4 mr-2" />
              Import GPX
            </Button>
          )}
          <Button onClick={() => setShowAddModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Locality
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Localities</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{localities.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Distance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDistance.toFixed(1)} km</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.floor(totalTime / 60)}h {totalTime % 60}m
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map */}
      <Card>
        <CardHeader>
          <CardTitle>Route Map</CardTitle>
        </CardHeader>
        <CardContent>
          <LocalityMap localities={localities} height="h-96" />
        </CardContent>
      </Card>

      {/* Localities List */}
      <Card>
        <CardHeader>
          <CardTitle>Localities List</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading localities...</div>
          ) : localities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No localities yet. Add your first locality or import from GPX.
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={localities.map((l) => l.id)} strategy={verticalListSortingStrategy}>
                <div className="space-y-3">
                  {localities.map((locality) => (
                    <SortableLocalityRow
                      key={locality.id}
                      locality={locality}
                      onEdit={() => {
                        setSelectedLocality(locality);
                        setShowEditModal(true);
                      }}
                      onDelete={() => setDeleteTarget(locality)}
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </CardContent>
      </Card>

      {/* Add Modal */}
      <AddEditLocalityModal
        open={showAddModal}
        onOpenChange={setShowAddModal}
        onSave={handleAddLocality}
        previousLocality={localities[localities.length - 1]}
      />

      {/* Edit Modal */}
      <AddEditLocalityModal
        open={showEditModal}
        onOpenChange={(open) => {
          setShowEditModal(open);
          if (!open) setSelectedLocality(undefined);
        }}
        onSave={handleEditLocality}
        locality={selectedLocality}
        previousLocality={
          selectedLocality
            ? localities[localities.findIndex((l) => l.id === selectedLocality.id) - 1]
            : undefined
        }
      />

      {/* GPX Import Modal */}
      <GPXImportModal
        open={showGPXModal}
        onOpenChange={setShowGPXModal}
        onImport={handleGPXImport}
        routeId={routeId || ''}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Locality</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteTarget?.nome}"? This will recalculate distances for
              neighboring localities. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteLocality} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
