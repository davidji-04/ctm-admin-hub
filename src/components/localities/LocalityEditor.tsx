import { useState } from 'react';
import { Plus, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Locality } from '@/types/locality';
import { LocalityMap } from './LocalityMap';
import { LocalitySequenceList } from './LocalitySequenceList';
import { AddEditLocalityModal } from './AddEditLocalityModal';
import { GPXImportModal } from './GPXImportModal';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { recalculateAllDistances } from '@/utils/localityCalculations';
import { toast } from 'sonner';
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

interface LocalityEditorProps {
  routeId: string;
  routeName: string;
  localities: Locality[];
  totalDistance: number;
  onLocalitiesChange: (localities: Locality[]) => void;
}

export const LocalityEditor = ({
  routeId,
  routeName,
  localities,
  totalDistance,
  onLocalitiesChange,
}: LocalityEditorProps) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isGPXModalOpen, setIsGPXModalOpen] = useState(false);
  const [editingLocality, setEditingLocality] = useState<Locality | null>(null);
  const [deletingLocality, setDeletingLocality] = useState<Locality | null>(null);
  const [selectedLocalityId, setSelectedLocalityId] = useState<string | null>(null);

  const handleAddLocality = async (localityData: Omit<Locality, 'id' | 'percurso_id' | 'ordem_no_percurso' | 'distancia_localidade_anterior' | 'tempo_estimado_da_anterior'>) => {
    const newLocality: Locality = {
      ...localityData,
      id: `loc-${Date.now()}`,
      percurso_id: routeId,
      ordem_no_percurso: localities.length + 1,
      distancia_localidade_anterior: 0,
      tempo_estimado_da_anterior: 0,
    };

    const updatedLocalities = [...localities, newLocality];
    const recalculated = recalculateAllDistances(updatedLocalities);
    onLocalitiesChange(recalculated);
    setIsAddModalOpen(false);
    toast.success('Localidade adicionada com sucesso');
  };

  const handleEditLocality = async (localityData: Omit<Locality, 'id' | 'percurso_id' | 'ordem_no_percurso' | 'distancia_localidade_anterior' | 'tempo_estimado_da_anterior'>) => {
    if (!editingLocality) return;

    const updatedLocalities = localities.map((loc) =>
      loc.id === editingLocality.id
        ? {
            ...localityData,
            id: loc.id,
            percurso_id: loc.percurso_id,
            ordem_no_percurso: loc.ordem_no_percurso,
            distancia_localidade_anterior: loc.distancia_localidade_anterior,
            tempo_estimado_da_anterior: loc.tempo_estimado_da_anterior,
          }
        : loc
    );

    const recalculated = recalculateAllDistances(updatedLocalities);
    onLocalitiesChange(recalculated);
    setEditingLocality(null);
    toast.success('Localidade atualizada com sucesso');
  };

  const handleDeleteLocality = () => {
    if (!deletingLocality) return;

    const updatedLocalities = localities.filter((loc) => loc.id !== deletingLocality.id);
    const recalculated = recalculateAllDistances(updatedLocalities);
    onLocalitiesChange(recalculated);
    setDeletingLocality(null);
    toast.success('Localidade eliminada com sucesso');
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = localities.findIndex((loc) => loc.id === active.id);
    const newIndex = localities.findIndex((loc) => loc.id === over.id);

    const reordered = arrayMove(localities, oldIndex, newIndex);
    const withUpdatedOrder = reordered.map((loc, index) => ({
      ...loc,
      ordem_no_percurso: index + 1,
    }));

    const recalculated = recalculateAllDistances(withUpdatedOrder);
    onLocalitiesChange(recalculated);
    toast.success('Ordem atualizada');
  };

  const handleGPXImport = async (importedLocalities: Omit<Locality, 'id' | 'percurso_id' | 'ordem_no_percurso' | 'distancia_localidade_anterior' | 'tempo_estimado_da_anterior'>[]) => {
    const newLocalities: Locality[] = importedLocalities.map((loc, index) => ({
      ...loc,
      id: `loc-gpx-${Date.now()}-${index}`,
      percurso_id: routeId,
      ordem_no_percurso: localities.length + index + 1,
      distancia_localidade_anterior: 0,
      tempo_estimado_da_anterior: 0,
    }));

    const updatedLocalities = [...localities, ...newLocalities];
    const recalculated = recalculateAllDistances(updatedLocalities);
    onLocalitiesChange(recalculated);
    setIsGPXModalOpen(false);
    toast.success(`${newLocalities.length} localidades importadas com sucesso`);
  };

  const previousLocality = editingLocality
    ? localities[localities.findIndex((loc) => loc.id === editingLocality.id) - 1]
    : localities[localities.length - 1];

  return (
    <div className="h-full flex flex-col">
      {/* Context Header */}
      <div className="p-6 border-b bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground uppercase tracking-wide">Percurso</p>
            <h1 className="text-2xl font-bold mt-1">{routeName}</h1>
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Distância Total Calculada</p>
            <p className="text-3xl font-bold text-primary">{totalDistance.toFixed(2)} km</p>
          </div>
        </div>
      </div>

      {/* Main Controls */}
      <div className="p-4 border-b flex gap-2">
        <Button onClick={() => setIsAddModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Localidade
        </Button>
        <Button variant="outline" onClick={() => setIsGPXModalOpen(true)}>
          <Upload className="w-4 h-4 mr-2" />
          Importar de GPX
        </Button>
      </div>

      {/* Content Area */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 overflow-hidden">
        {/* Sequential Locality List */}
        <div className="h-full overflow-y-auto">
          <LocalitySequenceList
            localities={localities}
            onEdit={setEditingLocality}
            onDelete={setDeletingLocality}
            onReorder={handleDragEnd}
          />
        </div>
      </div>

      {/* Modals */}
      <AddEditLocalityModal
        open={isAddModalOpen}
        onOpenChange={setIsAddModalOpen}
        onSave={handleAddLocality}
        previousLocality={previousLocality}
      />

      <AddEditLocalityModal
        open={!!editingLocality}
        onOpenChange={(open) => !open && setEditingLocality(null)}
        onSave={handleEditLocality}
        locality={editingLocality || undefined}
        previousLocality={previousLocality}
      />

      <GPXImportModal
        open={isGPXModalOpen}
        onOpenChange={setIsGPXModalOpen}
        onImport={handleGPXImport}
        routeId={routeId}
      />

      <AlertDialog open={!!deletingLocality} onOpenChange={(open) => !open && setDeletingLocality(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Eliminar Localidade</AlertDialogTitle>
            <AlertDialogDescription>
              Tem a certeza que deseja eliminar <strong>"{deletingLocality?.nome}"</strong>?
              Esta ação irá recalcular as distâncias e tempos de todas as localidades seguintes.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteLocality}
              className="bg-destructive hover:bg-destructive/90"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
