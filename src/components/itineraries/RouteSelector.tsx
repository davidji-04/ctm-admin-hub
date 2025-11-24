import { useState } from 'react';
import { Search, MapPin, TrendingUp, Clock, Check, AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface Route {
  id: string;
  name: string;
  category: 'free' | 'premium';
  distance: number;
  duration: number;
  difficulty: 'easy' | 'moderate' | 'difficult';
  localities: number;
  version: number;
}

interface RouteSelectorProps {
  selectedRouteId?: string;
  onRouteSelect: (routeId: string) => void;
}

export const RouteSelector = ({ selectedRouteId, onRouteSelect }: RouteSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data - replace with actual API call
  const routes: Route[] = [
    {
      id: 'route-1',
      name: 'Caminho Francês',
      category: 'premium',
      distance: 783,
      duration: 35,
      difficulty: 'moderate',
      localities: 45,
      version: 2,
    },
    {
      id: 'route-2',
      name: 'Caminho Português',
      category: 'premium',
      distance: 620,
      duration: 28,
      difficulty: 'easy',
      localities: 38,
      version: 1,
    },
    {
      id: 'route-3',
      name: 'Caminho do Norte',
      category: 'premium',
      distance: 825,
      duration: 38,
      difficulty: 'difficult',
      localities: 52,
      version: 1,
    },
    {
      id: 'route-4',
      name: 'Caminho Primitivo',
      category: 'free',
      distance: 320,
      duration: 14,
      difficulty: 'difficult',
      localities: 22,
      version: 1,
    },
  ];

  const premiumRoutes = routes.filter((route) => route.category === 'premium');
  
  const filteredRoutes = premiumRoutes.filter((route) =>
    route.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Fácil';
      case 'moderate': return 'Moderado';
      case 'difficult': return 'Difícil';
      default: return difficulty;
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'text-green-500';
      case 'moderate': return 'text-yellow-500';
      case 'difficult': return 'text-red-500';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="space-y-4">
      <Alert className="border-yellow-500/20 bg-yellow-500/10">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-600 dark:text-yellow-400">
          <strong>RN-003:</strong> Apenas percursos categorizados como 'Premium' podem ser usados para criar roteiros premium.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="search">Pesquisar Percurso Premium</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="search"
            placeholder="Nome do percurso..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <RadioGroup value={selectedRouteId} onValueChange={onRouteSelect}>
        <div className="space-y-3">
          {filteredRoutes.map((route) => (
            <Card
              key={route.id}
              className={`cursor-pointer transition-colors ${
                selectedRouteId === route.id
                  ? 'border-primary bg-primary/5'
                  : 'hover:border-primary/50'
              }`}
              onClick={() => onRouteSelect(route.id)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <RadioGroupItem value={route.id} id={route.id} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{route.name}</CardTitle>
                        <Badge>Premium</Badge>
                        <Badge variant="outline">v{route.version}</Badge>
                      </div>
                      <CardDescription className="mt-2 grid grid-cols-2 md:grid-cols-4 gap-3">
                        <div className="flex items-center gap-1.5 text-xs">
                          <TrendingUp className="w-3.5 h-3.5" />
                          {route.distance} km
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <Clock className="w-3.5 h-3.5" />
                          {route.duration} dias
                        </div>
                        <div className="flex items-center gap-1.5 text-xs">
                          <MapPin className="w-3.5 h-3.5" />
                          {route.localities} localidades
                        </div>
                        <div className={`flex items-center gap-1.5 text-xs font-medium ${getDifficultyColor(route.difficulty)}`}>
                          {getDifficultyLabel(route.difficulty)}
                        </div>
                      </CardDescription>
                    </div>
                  </div>
                  {selectedRouteId === route.id && (
                    <Check className="w-5 h-5 text-primary" />
                  )}
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </RadioGroup>

      {filteredRoutes.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          Nenhum percurso premium encontrado
        </div>
      )}
    </div>
  );
};
