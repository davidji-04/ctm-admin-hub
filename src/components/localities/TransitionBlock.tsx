import { ArrowDown, Timer, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface TransitionBlockProps {
  distance: number;
  time: number;
  difficulty: 'facil' | 'media' | 'dificil';
}

const DIFFICULTY_CONFIG = {
  facil: { label: 'Fácil', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
  media: { label: 'Média', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' },
  dificil: { label: 'Difícil', color: 'bg-red-500/10 text-red-500 border-red-500/20' },
};

export const TransitionBlock = ({ distance, time, difficulty }: TransitionBlockProps) => {
  const hours = Math.floor(time / 60);
  const minutes = time % 60;
  const timeDisplay = hours > 0 ? `${hours}.${minutes}h` : `${minutes}min`;

  return (
    <div className="flex items-center gap-3 py-2 px-4 my-2 bg-muted/30 rounded-lg border border-dashed">
      <ArrowDown className="w-4 h-4 text-muted-foreground" />
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{distance.toFixed(1)} km</span>
        </div>
        <span className="text-muted-foreground">|</span>
        <div className="flex items-center gap-1.5">
          <Timer className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium">{timeDisplay}</span>
        </div>
        <span className="text-muted-foreground">|</span>
        <Badge variant="outline" className={DIFFICULTY_CONFIG[difficulty].color}>
          {DIFFICULTY_CONFIG[difficulty].label}
        </Badge>
      </div>
    </div>
  );
};
