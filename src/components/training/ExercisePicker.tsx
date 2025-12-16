import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Plus, Check } from "lucide-react";
import { Exercise } from "@/types/training";

interface ExercisePickerProps {
  exercises: Exercise[];
  onSelect: (exercise: Exercise) => void;
  selectedIds?: string[]; // To visually disable already selected ones
}

export const ExercisePicker = ({ exercises, onSelect, selectedIds = [] }: ExercisePickerProps) => {
  const [search, setSearch] = useState("");

  const filtered = exercises.filter(ex => 
    ex.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-3 border rounded-md p-3 bg-card">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input 
          placeholder="Procurar exercício..." 
          className="pl-8 h-9" 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>
      <ScrollArea className="h-[200px]">
        <div className="space-y-2">
          {filtered.length === 0 ? (
             <p className="text-xs text-muted-foreground text-center py-4">Nenhum exercício encontrado.</p>
          ) : (
            filtered.map((ex) => {
              const isSelected = selectedIds.includes(ex.id);
              return (
                <div key={ex.id} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50 border border-transparent hover:border-border transition-colors">
                  <div className="flex-1 overflow-hidden mr-2">
                    <div className="font-medium text-sm truncate">{ex.title}</div>
                    <div className="flex gap-2 text-xs text-muted-foreground">
                      <Badge variant="secondary" className="text-[10px] h-5 px-1">{ex.difficulty}</Badge>
                      <span className="flex items-center">{ex.duration_minutes}m</span>
                    </div>
                  </div>
                  <Button 
                    size="icon" 
                    variant={isSelected ? "secondary" : "default"} 
                    className="h-7 w-7 shrink-0"
                    disabled={isSelected}
                    onClick={() => onSelect(ex)}
                  >
                    {isSelected ? <Check className="h-3 w-3" /> : <Plus className="h-3 w-3" />}
                  </Button>
                </div>
              );
            })
          )}
        </div>
      </ScrollArea>
    </div>
  );
};