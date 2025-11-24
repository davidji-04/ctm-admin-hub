import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Share2, AlertTriangle, Calendar, User, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { PremiumItinerary, ITINERARY_STATUS_LABELS } from '@/types/premium-itinerary';
import { StagesList } from '@/components/itineraries/StagesList';
import { SchedulesOverview } from '@/components/itineraries/SchedulesOverview';
import { AddEditStageModal } from '@/components/itineraries/AddEditStageModal';
import { toast } from 'sonner';

const ManageItinerary = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isAddStageModalOpen, setIsAddStageModalOpen] = useState(false);

  const [itinerary] = useState<PremiumItinerary>({
    id: id || '1',
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
    stages: [
      {
        id: 'stage-1',
        itineraryId: id || '1',
        order: 1,
        title: 'Dia 1: Saint-Jean-Pied-de-Port a Roncesvalles',
        description: 'Primeira etapa adaptada às capacidades do cliente',
        startLocalityId: 'loc-1',
        startLocalityName: 'Saint-Jean-Pied-de-Port',
        endLocalityId: 'loc-2',
        endLocalityName: 'Roncesvalles',
        distance: 25.3,
        estimatedDuration: 6.3,
        difficulty: 'difficult',
        schedules: [
          {
            id: 'sched-1',
            stageId: 'stage-1',
            type: 'accommodation',
            title: 'Albergue Casa Sabina',
            serviceId: 'service-1',
            serviceName: 'Albergue Casa Sabina',
            status: 'confirmed',
            bookingReference: 'REF-12345',
            cost: 45,
          },
        ],
      },
    ],
    trainingPlanId: 'training-1',
    sharedWithClient: false,
    percursoUpdated: true,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-20T14:30:00Z',
  });

  const handleShareWithClient = () => {
    toast.success('Roteiro partilhado com o cliente via app mobile!');
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/itineraries')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar
        </Button>
      </div>

      {itinerary.percursoUpdated && (
        <Alert variant="default" className="border-yellow-500/20 bg-yellow-500/10">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="text-yellow-700 dark:text-yellow-500">
            Percurso Base Atualizado
          </AlertTitle>
          <AlertDescription className="text-yellow-600 dark:text-yellow-400">
            O percurso base "{itinerary.basePercursoName}" foi atualizado para uma nova
            versão. Este roteiro foi criado com a versão {itinerary.basePercursoVersion}.
            Considere revisar as alterações.
          </AlertDescription>
        </Alert>
      )}

      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-bold">{itinerary.title}</h1>
            <Badge>{ITINERARY_STATUS_LABELS[itinerary.status]}</Badge>
          </div>
          <p className="text-muted-foreground">{itinerary.code}</p>
        </div>
        <Button onClick={handleShareWithClient} disabled={itinerary.sharedWithClient}>
          <Share2 className="w-4 h-4 mr-2" />
          {itinerary.sharedWithClient ? 'Partilhado com Cliente' : 'Partilhar com Cliente'}
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              Cliente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{itinerary.clientName}</div>
            <p className="text-xs text-muted-foreground mt-1">
              ID: {itinerary.clientId}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Percurso Base
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{itinerary.basePercursoName}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Versão {itinerary.basePercursoVersion}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Período
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {new Date(itinerary.startDate).toLocaleDateString('pt-PT', {
                day: '2-digit',
                month: 'short',
              })}
              {' - '}
              {new Date(itinerary.endDate).toLocaleDateString('pt-PT', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {Math.ceil(
                (new Date(itinerary.endDate).getTime() -
                  new Date(itinerary.startDate).getTime()) /
                  (1000 * 60 * 60 * 24)
              )}{' '}
              dias
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="stages" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="stages">Etapas</TabsTrigger>
          <TabsTrigger value="schedules">Programações</TabsTrigger>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
        </TabsList>

        <TabsContent value="stages" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Etapas do Roteiro</CardTitle>
                  <CardDescription>
                    Gerir etapas personalizadas baseadas nas capacidades do cliente
                  </CardDescription>
                </div>
                <Button onClick={() => setIsAddStageModalOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Etapa
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <StagesList stages={itinerary.stages} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedules" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Programações e Reservas</CardTitle>
              <CardDescription>
                Visão geral de todas as programações vinculadas às etapas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SchedulesOverview stages={itinerary.stages} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="details" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Informações Gerais</CardTitle>
              <CardDescription>
                Detalhes e configurações do roteiro premium
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Plano de Treino</label>
                  <p className="text-sm text-muted-foreground">
                    {itinerary.trainingPlanId ? `ID: ${itinerary.trainingPlanId}` : 'Não vinculado'}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Total de Etapas</label>
                  <p className="text-sm text-muted-foreground">{itinerary.stages.length}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Criado em</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(itinerary.createdAt).toLocaleString('pt-PT')}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Última atualização</label>
                  <p className="text-sm text-muted-foreground">
                    {new Date(itinerary.updatedAt).toLocaleString('pt-PT')}
                  </p>
                </div>
              </div>
              {itinerary.notes && (
                <div>
                  <label className="text-sm font-medium">Notas</label>
                  <p className="text-sm text-muted-foreground mt-1">{itinerary.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AddEditStageModal
        open={isAddStageModalOpen}
        onOpenChange={setIsAddStageModalOpen}
        order={itinerary.stages.length + 1}
      />
    </div>
  );
};

export default ManageItinerary;
