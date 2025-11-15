import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin } from 'lucide-react';

interface Route {
  id: string;
  name: string;
  localitiesCount: number;
  totalDistance: number;
  hasLocalities: boolean;
}

interface RouteSelectorProps {
  routes: Route[];
  selectedRouteId: string | null;
  onSelectRoute: (routeId: string) => void;
}

export const RouteSelector = ({ routes, selectedRouteId, onSelectRoute }: RouteSelectorProps) => {
  return (
    <div className="h-full flex flex-col border-r">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Todos os Percursos</h2>
        <p className="text-sm text-muted-foreground">
          Selecione para gerir localidades
        </p>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-3 space-y-2">
          {routes.map((route) => (
            <Card
              key={route.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedRouteId === route.id ? 'ring-2 ring-primary' : ''
              }`}
              onClick={() => onSelectRoute(route.id)}
            >
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-medium line-clamp-2">{route.name}</h3>
                    {!route.hasLocalities && (
                      <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20 shrink-0">
                        Pendente
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{route.localitiesCount} localidades</span>
                    {route.totalDistance > 0 && (
                      <>
                        <span>•</span>
                        <span>{route.totalDistance.toFixed(2)} km</span>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
