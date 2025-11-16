import { useState } from 'react';
import { Plus, Search, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { PremiumItinerary, ItineraryStatus, ITINERARY_STATUS_LABELS } from '@/types/premium-itinerary';

const PremiumItinerariesList = () => {
  const navigate = useNavigate();
  
  const [itineraries] = useState<PremiumItinerary[]>([
    {
      id: '1',
      code: 'ITN-2024-001',
      title: 'Caminho Francês - João Silva',
      clientId: 'client-1',
      clientName: 'João Silva',
      basePercursoId: 'percurso-1',
      basePercursoName: 'Caminho Francês',
      basePercursoVersion: 1,
      status: 'in_progress',
      startDate: '2024-05-01',
      endDate: '2024-06-15',
      stages: [],
      sharedWithClient: false,
      percursoUpdated: true,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-20T14:30:00Z',
    },
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<ItineraryStatus | 'all'>('all');

  const filteredItineraries = itineraries.filter((itinerary) => {
    const matchesSearch = 
      itinerary.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      itinerary.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      itinerary.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || itinerary.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeVariant = (status: ItineraryStatus) => {
    switch (status) {
      case 'draft':
        return 'secondary';
      case 'in_progress':
        return 'default';
      case 'confirmed':
        return 'default';
      case 'completed':
        return 'default';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestão de Roteiros Premium</h1>
          <p className="text-muted-foreground mt-1">
            Criar e gerir roteiros personalizados para clientes premium
          </p>
        </div>
        <Button onClick={() => navigate('/itineraries/create')}>
          <Plus className="w-4 h-4 mr-2" />
          Criar Roteiro Premium
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Procure e filtre roteiros premium</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Procurar por código, cliente ou título..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ItineraryStatus | 'all')}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os estados</SelectItem>
                {Object.entries(ITINERARY_STATUS_LABELS).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Roteiros Premium</CardTitle>
          <CardDescription>
            {filteredItineraries.length} roteiro(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Percurso Base</TableHead>
                <TableHead>Datas</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItineraries.map((itinerary) => (
                <TableRow 
                  key={itinerary.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => navigate(`/itineraries/${itinerary.id}`)}
                >
                  <TableCell className="font-medium">{itinerary.code}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {itinerary.title}
                      {itinerary.percursoUpdated && (
                        <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{itinerary.clientName}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{itinerary.basePercursoName}</div>
                      <div className="text-muted-foreground">v{itinerary.basePercursoVersion}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <div>{new Date(itinerary.startDate).toLocaleDateString('pt-PT')}</div>
                      <div className="text-muted-foreground">
                        até {new Date(itinerary.endDate).toLocaleDateString('pt-PT')}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(itinerary.status)}>
                      {ITINERARY_STATUS_LABELS[itinerary.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/itineraries/${itinerary.id}`);
                      }}
                    >
                      Gerir
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredItineraries.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum roteiro encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PremiumItinerariesList;
