import { useState } from 'react';
import { Search, Calendar, TrendingUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';

interface TrainingPlan {
  id: string;
  name: string;
  duration: number; // weeks
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  description?: string;
  clientId?: string;
  createdAt: string;
}

interface TrainingPlanSelectorProps {
  selectedPlanId?: string;
  onPlanSelect: (planId?: string) => void;
  clientId?: string;
}

// Mock data - replace with actual API calls
const mockPlans: TrainingPlan[] = [
  {
    id: 'plan-1',
    name: 'Preparação Caminho Francês - Básico',
    duration: 8,
    difficulty: 'beginner',
    description: 'Plano de 8 semanas para iniciantes, focado em resistência',
    clientId: 'client-1',
    createdAt: '2024-01-01',
  },
  {
    id: 'plan-2',
    name: 'Treino Intensivo Montanha',
    duration: 12,
    difficulty: 'advanced',
    description: 'Preparação para percursos com elevação, inclui treino de força',
    clientId: 'client-1',
    createdAt: '2024-01-15',
  },
  {
    id: 'plan-3',
    name: 'Condicionamento Geral Peregrino',
    duration: 6,
    difficulty: 'intermediate',
    description: 'Plano intermediário focado em caminhadas longas',
    clientId: 'client-2',
    createdAt: '2024-02-01',
  },
];

const getDifficultyLabel = (difficulty: string) => {
  const labels: Record<string, string> = {
    beginner: 'Iniciante',
    intermediate: 'Intermediário',
    advanced: 'Avançado',
  };
  return labels[difficulty] || difficulty;
};

const getDifficultyColor = (difficulty: string) => {
  const colors: Record<string, string> = {
    beginner: 'text-green-500',
    intermediate: 'text-yellow-500',
    advanced: 'text-red-500',
  };
  return colors[difficulty] || 'text-muted-foreground';
};

export const TrainingPlanSelector = ({
  selectedPlanId,
  onPlanSelect,
  clientId,
}: TrainingPlanSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPlans = mockPlans.filter((plan) => {
    const matchesSearch = plan.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesClient = !clientId || plan.clientId === clientId;
    return matchesSearch && matchesClient;
  });

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Procurar planos de treino..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      <div className="space-y-2 max-h-[400px] overflow-y-auto">
        {/* Option to not link any plan */}
        <div
          className={`p-4 border rounded-lg cursor-pointer transition-colors hover:border-primary ${
            !selectedPlanId ? 'border-primary bg-primary/5' : 'border-border'
          }`}
          onClick={() => onPlanSelect(undefined)}
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Sem Plano de Treino</h3>
              <p className="text-sm text-muted-foreground">
                Continuar sem vincular plano de preparação
              </p>
            </div>
            {!selectedPlanId && (
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <div className="w-2 h-2 bg-primary-foreground rounded-full" />
              </div>
            )}
          </div>
        </div>

        {filteredPlans.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Nenhum plano de treino encontrado</p>
            <p className="text-sm mt-1">
              {clientId
                ? 'Este cliente ainda não possui planos de treino'
                : 'Tente ajustar a busca'}
            </p>
          </div>
        ) : (
          filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className={`p-4 border rounded-lg cursor-pointer transition-colors hover:border-primary ${
                selectedPlanId === plan.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border'
              }`}
              onClick={() => onPlanSelect(plan.id)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-medium">{plan.name}</h3>
                    <Badge variant="outline" className={getDifficultyColor(plan.difficulty)}>
                      {getDifficultyLabel(plan.difficulty)}
                    </Badge>
                  </div>
                  {plan.description && (
                    <p className="text-sm text-muted-foreground">{plan.description}</p>
                  )}
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{plan.duration} semanas</span>
                    </div>
                  </div>
                </div>
                {selectedPlanId === plan.id && (
                  <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                    <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
