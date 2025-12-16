import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Timer, Trash2, Pencil } from "lucide-react";
import { Exercise, Difficulty } from "@/types/training";

interface ExerciseLibraryProps {
  exercises: Exercise[];
  onAddExercise: (exercise: Exercise) => void;
  onEditExercise: (exercise: Exercise) => void; // NEW
  onDeleteExercise: (id: string) => void;
}

export const ExerciseLibrary = ({ exercises, onAddExercise, onEditExercise, onDeleteExercise }: ExerciseLibraryProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Exercise>>({});

  const openNew = () => {
    setEditingId(null);
    setFormData({});
    setIsDialogOpen(true);
  };

  const openEdit = (ex: Exercise) => {
    setEditingId(ex.id);
    setFormData(ex);
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.difficulty) return;
    
    const exercise: Exercise = {
      id: editingId || Date.now().toString(),
      title: formData.title,
      description: formData.description || "",
      difficulty: formData.difficulty as Difficulty,
      duration_minutes: formData.duration_minutes || 10,
    };
    
    if (editingId) {
      onEditExercise(exercise);
    } else {
      onAddExercise(exercise);
    }
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Biblioteca de Exercícios</h3>
        <Button size="sm" onClick={openNew}><Plus className="w-4 h-4 mr-2" /> Novo Exercício</Button>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editingId ? 'Editar Exercício' : 'Adicionar Exercício'}</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <Input placeholder="Título" value={formData.title || ''} onChange={e => setFormData({...formData, title: e.target.value})} />
            <Textarea placeholder="Descrição" value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} />
            <div className="flex gap-4">
              <Select value={formData.difficulty} onValueChange={v => setFormData({...formData, difficulty: v as Difficulty})}>
                <SelectTrigger><SelectValue placeholder="Dificuldade" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="facil">Fácil</SelectItem>
                  <SelectItem value="media">Média</SelectItem>
                  <SelectItem value="dificil">Difícil</SelectItem>
                </SelectContent>
              </Select>
              <Input type="number" placeholder="Minutos" value={formData.duration_minutes || ''} onChange={e => setFormData({...formData, duration_minutes: parseInt(e.target.value)})} />
            </div>
            <Button onClick={handleSave} className="w-full">Guardar</Button>
          </div>
        </DialogContent>
      </Dialog>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Dificuldade</TableHead>
              <TableHead>Duração</TableHead>
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {exercises.map((ex) => (
              <TableRow key={ex.id}>
                <TableCell className="font-medium">{ex.title}</TableCell>
                <TableCell>
                  <Badge variant={ex.difficulty === 'dificil' ? 'destructive' : ex.difficulty === 'media' ? 'secondary' : 'default'}>
                    {ex.difficulty}
                  </Badge>
                </TableCell>
                <TableCell><div className="flex items-center gap-1"><Timer className="w-3 h-3" /> {ex.duration_minutes}m</div></TableCell>
                <TableCell className="text-right space-x-2">
                   <Button variant="ghost" size="icon" onClick={() => openEdit(ex)}><Pencil className="w-4 h-4" /></Button>
                   <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDeleteExercise(ex.id)}><Trash2 className="w-4 h-4" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};