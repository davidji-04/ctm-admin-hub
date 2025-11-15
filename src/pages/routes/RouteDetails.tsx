import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Edit, MapPin, Mountain, Clock } from 'lucide-react';
import { LocalityMap } from '@/components/localities/LocalityMap';
import { Locality } from '@/types/locality';

interface RouteDetails {
  id: string;
  title: string;
  localidade_pais: string;
  categoria: 'free' | 'premium';
  modalidade: string[];
  dificuldade_geral: 'facil' | 'media' | 'dificil';
  status: 'rascunho' | 'ativo' | 'inativo';
  distancia_total: number;
  elevacao_altimetria?: number;
  tipo_terreno: string;
  descricao: string;
  imagem_hero?: string;
  version: number;
  localities?: Locality[];
}

export const RouteDetails = () => {
  const { routeId } = useParams<{ routeId: string }>();
  const navigate = useNavigate();
  const [route, setRoute] = useState<RouteDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRoute();
  }, [routeId]);

  const loadRoute = async () => {
    setIsLoading(true);
    try {
      // Mock API call
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Mock data
      const mockRoute: RouteDetails = {
        id: routeId || '',
        title: 'Caminho Português',
        localidade_pais: 'PT',
        categoria: 'premium',
        modalidade: ['a_pe'],
        dificuldade_geral: 'media',
        status: 'ativo',
        distancia_total: 245.5,
        elevacao_altimetria: 2340,
        tipo_terreno: 'mixed',
        descricao: 'Historic pilgrimage route through Portugal...',
        version: 3,
        localities: [],
      };

      setRoute(mockRoute);
    } catch (error) {
      console.error('Failed to load route:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading route details...</p>
        </div>
      </div>
    );
  }

  if (!route) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Route not found</p>
        <Button variant="outline" onClick={() => navigate('/routes')} className="mt-4">
          Back to Routes
        </Button>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'default';
      case 'rascunho':
        return 'secondary';
      case 'inativo':
        return 'outline';
      default:
        return 'secondary';
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case 'facil':
        return 'Easy';
      case 'media':
        return 'Medium';
      case 'dificil':
        return 'Difficult';
      default:
        return difficulty;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate('/routes')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{route.title}</h1>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={getStatusColor(route.status)}>{route.status}</Badge>
              <Badge variant={route.categoria === 'premium' ? 'default' : 'secondary'}>
                {route.categoria}
              </Badge>
              <span className="text-sm text-muted-foreground">Version {route.version}</span>
            </div>
          </div>
        </div>
        <Button onClick={() => navigate(`/routes/${routeId}/edit`)}>
          <Edit className="h-4 w-4 mr-2" />
          Edit Route
        </Button>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Distance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{route.distancia_total} km</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Mountain className="h-4 w-4" />
              Elevation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {route.elevacao_altimetria ? `${route.elevacao_altimetria}m` : 'N/A'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Difficulty</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getDifficultyLabel(route.dificuldade_geral)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Terrain</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">{route.tipo_terreno}</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="localities">Localities</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="history">Version History</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{route.descricao}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Route Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-muted-foreground">Country:</span>
                  <p className="font-medium">{route.localidade_pais}</p>
                </div>
                <div>
                  <span className="text-sm text-muted-foreground">Modalities:</span>
                  <div className="flex gap-2 mt-1">
                    {route.modalidade.map((mod) => (
                      <Badge key={mod} variant="secondary">
                        {mod === 'a_pe' && 'Walking'}
                        {mod === 'bicicleta' && 'Bicycle'}
                        {mod === 'autocaravana' && 'Caravan'}
                        {mod === 'grupo' && 'Group'}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="localities">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Route Localities</CardTitle>
                <Button variant="outline" onClick={() => navigate(`/routes/${routeId}/localities`)}>
                  <MapPin className="h-4 w-4 mr-2" />
                  Manage Localities
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {route.localities && route.localities.length > 0 ? (
                <LocalityMap localities={route.localities} height="h-96" />
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No localities added yet
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="media">
          <Card>
            <CardHeader>
              <CardTitle>Route Media</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                Hero image and gallery will be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Version History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border-l-2 border-primary pl-4 py-2">
                  <div className="font-medium">Version {route.version}</div>
                  <div className="text-sm text-muted-foreground">Current version</div>
                </div>
                <div className="border-l-2 border-muted pl-4 py-2">
                  <div className="font-medium">Version {route.version - 1}</div>
                  <div className="text-sm text-muted-foreground">Previous version</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
