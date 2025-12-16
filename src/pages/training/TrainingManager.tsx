import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { 
  Users, Plus, Calendar, MapPin, Search, 
  ArrowRight, ChevronLeft, ChevronRight, Loader2, Clock, 
  Trash2, Pencil, CheckCircle2, ArrowLeft 
} from "lucide-react";

// Custom Components
import { ExerciseLibrary } from "@/components/training/ExerciseLibrary";
import { ExercisePicker } from "@/components/training/ExercisePicker";
import { DeletePlanModal } from "@/components/training/DeletePlanModal";
import { TrainingPlan, TrainingSession, Exercise } from "@/types/training";

// --- MOCK DATA START ---
const MOCK_ROUTES = [
  { id: '1', name: 'Caminho Português', distance: '245 km', est_time: '12 dias' }, 
  { id: '2', name: 'Rota Vicentina', distance: '320 km', est_time: '15 dias' }, 
  { id: '3', name: 'Via Algarviana', distance: '300 km', est_time: '14 dias' }
];

const MOCK_USERS = [
  { id: 'u1', name: 'João Silva' }, 
  { id: 'u2', name: 'Maria Santos' }, 
  { id: 'u3', name: 'Pedro Costa' }
];

const INITIAL_EXERCISES: Exercise[] = [
  { id: '1', title: 'Alongamento de Panturrilha', description: 'Essencial para caminhadas.', difficulty: 'facil', duration_minutes: 5 },
  { id: '2', title: 'Agachamento Livre', description: 'Fortalecimento de pernas.', difficulty: 'media', duration_minutes: 15 },
  { id: '3', title: 'Corrida Estacionária', description: 'Cardio leve.', difficulty: 'facil', duration_minutes: 10 },
  { id: '4', title: 'Prancha Abdominal', description: 'Core.', difficulty: 'dificil', duration_minutes: 3 },
];

const generateMockPlans = (count: number): (TrainingPlan & { duration: string })[] => {
  return Array.from({ length: count }).map((_, i) => ({
    id: `plan-${i}`,
    name: `Plano de Treino #${i + 1}`,
    description: i % 2 === 0 ? 'Foco em resistência cardiovascular.' : 'Foco em força muscular.',
    route_id: (i % 3 + 1).toString(),
    user_id: `u${(i % 3) + 1}`,
    status: 'active',
    duration: `${(i % 10 + 2) * 4} horas`,
    createdAt: new Date().toISOString(),
    sessions: [
        { id: `s-${i}-1`, title: 'Sessão 1: Introdução', description: 'Adaptação inicial', exercises: [INITIAL_EXERCISES[0], INITIAL_EXERCISES[1]] }
    ] 
  }));
};

const DATABASE_PLANS = generateMockPlans(25); // Simulating 25 existing plans
const ITEMS_PER_PAGE = 9;
// --- MOCK DATA END ---

export const TrainingManager = () => {
  const [activeTab, setActiveTab] = useState("plans");
  const [exercises, setExercises] = useState<Exercise[]>(INITIAL_EXERCISES);
  
  // Data States
  const [plans, setPlans] = useState<(TrainingPlan & { duration: string })[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Wizard States
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [currentPlan, setCurrentPlan] = useState<Partial<TrainingPlan & { duration: string }>>({ sessions: [] });

  // Details Modal
  const [selectedPlan, setSelectedPlan] = useState<(TrainingPlan & { duration: string }) | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Delete Modal State
  const [planToDelete, setPlanToDelete] = useState<(TrainingPlan & { duration: string }) | null>(null);

  // --- DATA LOADING ---
  useEffect(() => {
    const fetchPlans = async () => {
      setIsLoading(true);
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 300)); 
    };
    
    // Initialize Mock Data Once
    if (plans.length === 0) {
        setPlans(DATABASE_PLANS);
        setTotalItems(DATABASE_PLANS.length);
        setTotalPages(Math.ceil(DATABASE_PLANS.length / ITEMS_PER_PAGE));
    }
    
    setIsLoading(false);
  }, []); 

  // Filter & Pagination Logic (Client-side for this mock)
  const filteredPlans = plans.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  const paginatedPlans = filteredPlans.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Update total pages when search changes
  useEffect(() => {
    setTotalPages(Math.ceil(filteredPlans.length / ITEMS_PER_PAGE));
  }, [searchTerm, plans]);

  // --- ACTIONS ---

  const handleDeleteClick = (e: React.MouseEvent, plan: TrainingPlan & { duration: string }) => {
    e.stopPropagation();
    setPlanToDelete(plan);
  };

  const confirmDelete = () => {
    if (planToDelete) {
        setPlans(plans.filter(p => p.id !== planToDelete.id));
        setPlanToDelete(null);
        // Adjust page if empty
        if (paginatedPlans.length === 1 && currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    }
  };

  const openCreateWizard = () => {
    setIsEditing(false);
    setCurrentPlan({ sessions: [] });
    setWizardStep(1);
    setIsWizardOpen(true);
  };

  const openEditWizard = (e: React.MouseEvent, plan: TrainingPlan & { duration: string }) => {
    e.stopPropagation();
    setIsEditing(true);
    setCurrentPlan(JSON.parse(JSON.stringify(plan))); // Deep copy
    setWizardStep(1);
    setIsWizardOpen(true);
  };

  const handleFinishWizard = () => {
    if (!currentPlan.name) return;

    if (isEditing && currentPlan.id) {
        // Update Existing
        setPlans(plans.map(p => p.id === currentPlan.id ? { ...p, ...currentPlan } as any : p));
    } else {
        // Create New
        const newEntry = { 
            ...currentPlan, 
            id: `plan-${Date.now()}`, 
            status: 'active',
            createdAt: new Date().toISOString() 
        } as TrainingPlan & { duration: string };
        setPlans([newEntry, ...plans]);
    }
    
    setIsWizardOpen(false);
    setCurrentPlan({ sessions: [] });
    setWizardStep(1);
  };

  // --- WIZARD HELPER FUNCTIONS ---
  const addSession = () => {
    const session: TrainingSession = {
      id: `sess-${Date.now()}`,
      title: `Sessão ${currentPlan.sessions ? currentPlan.sessions.length + 1 : 1}`,
      description: '',
      exercises: []
    };
    setCurrentPlan({ ...currentPlan, sessions: [...(currentPlan.sessions || []), session] });
  };

  const removeSession = (id: string) => {
    setCurrentPlan({ ...currentPlan, sessions: currentPlan.sessions?.filter(s => s.id !== id) });
  };

  const addExerciseToSession = (sessionId: string, exercise: Exercise) => {
    setCurrentPlan({
      ...currentPlan,
      sessions: currentPlan.sessions?.map(s => s.id === sessionId ? { ...s, exercises: [...s.exercises, exercise] } : s)
    });
  };

  const removeExerciseFromSession = (sessionId: string, exId: string) => {
     setCurrentPlan({
      ...currentPlan,
      sessions: currentPlan.sessions?.map(s => s.id === sessionId ? { ...s, exercises: s.exercises.filter(e => e.id !== exId) } : s)
    });
  };

  return (
    <div className="space-y-6 p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de Treinos</h1>
          <p className="text-muted-foreground">{filteredPlans.length} planos encontrados</p>
        </div>
        <Button onClick={openCreateWizard}>
          <Plus className="mr-2 h-4 w-4" /> Criar Novo Plano
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="plans">Planos Ativos</TabsTrigger>
          <TabsTrigger value="library">Biblioteca de Exercícios</TabsTrigger>
        </TabsList>

        {/* --- PLANS TAB --- */}
        <TabsContent value="plans" className="space-y-4">
          <div className="relative w-full max-w-sm">
             <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
             <Input 
                placeholder="Procurar planos..." 
                className="pl-8" 
                value={searchTerm} 
                onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1); }} 
             />
          </div>

          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {paginatedPlans.map((plan) => {
                    const route = MOCK_ROUTES.find(r => r.id === plan.route_id);
                    return (
                    <Card key={plan.id} className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-primary/60" onClick={() => { setSelectedPlan(plan); setIsDetailsOpen(true); }}>
                        <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                            <div className="space-y-1 w-[70%]">
                            <CardTitle className="text-lg truncate">{plan.name}</CardTitle>
                            <CardDescription className="line-clamp-1">{plan.description}</CardDescription>
                            </div>
                            <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => openEditWizard(e, plan)}>
                                    <Pencil className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={(e) => handleDeleteClick(e, plan)}>
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        </CardHeader>
                        <CardContent>
                        <div className="space-y-3 text-sm mt-2">
                            {/* Route Info */}
                            <div className="flex items-center gap-2 text-muted-foreground bg-muted/30 p-2 rounded-md">
                                <MapPin className="h-4 w-4 text-primary shrink-0" />
                                <div className="flex flex-col overflow-hidden">
                                    <span className="truncate font-medium text-foreground">{route?.name || "Roteiro desconhecido"}</span>
                                    <span className="text-xs">{route?.distance || "-- km"}</span>
                                </div>
                            </div>
                            
                            {/* Stats */}
                            <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 text-muted-foreground bg-muted/30 p-2 rounded-md flex-1">
                                    <Clock className="h-4 w-4 text-primary shrink-0" />
                                    <span className="text-xs font-medium text-foreground">{plan.duration}</span>
                                </div>
                                <div className="flex items-center gap-2 text-muted-foreground bg-muted/30 p-2 rounded-md flex-1">
                                    <Calendar className="h-4 w-4 text-primary shrink-0" />
                                    <span className="text-xs font-medium text-foreground">{plan.sessions.length} Sessões</span>
                                </div>
                            </div>
                        </div>
                        </CardContent>
                    </Card>
                    );
                })}
              </div>

              {/* PAGINATION CONTROLS */}
              {filteredPlans.length > 0 && (
                <div className="flex items-center justify-end space-x-2 py-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Anterior
                  </Button>
                  <div className="text-sm font-medium">
                    Página {currentPage} de {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                  >
                    Próximo <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </TabsContent>

        {/* --- LIBRARY TAB --- */}
        <TabsContent value="library">
           <Card>
             <CardHeader><CardTitle>Repositório de Exercícios</CardTitle></CardHeader>
             <CardContent>
               <ExerciseLibrary 
                 exercises={exercises} 
                 onAddExercise={(ex) => setExercises([...exercises, ex])}
                 onEditExercise={(ex) => setExercises(exercises.map(e => e.id === ex.id ? ex : e))}
                 onDeleteExercise={(id) => setExercises(exercises.filter(e => e.id !== id))}
               />
             </CardContent>
           </Card>
        </TabsContent>
      </Tabs>

      {/* --- WIZARD DIALOG --- */}
      <Dialog open={isWizardOpen} onOpenChange={setIsWizardOpen}>
        <DialogContent className="max-w-4xl min-h-[600px] flex flex-col">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Editar Plano' : 'Criar Plano de Treino'} - Passo {wizardStep}</DialogTitle>
          </DialogHeader>

          <div className="flex-1 py-4">
            {wizardStep === 1 ? (
              // STEP 1: General Info
              <div className="grid gap-4">
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Nome do Plano</Label>
                        <Input value={currentPlan.name || ''} onChange={(e) => setCurrentPlan({...currentPlan, name: e.target.value})} />
                    </div>
                    <div className="space-y-2">
                        <Label>Duração Total (Horas)</Label>
                        <Input placeholder="Ex: 48 horas" value={currentPlan.duration || ''} onChange={(e) => setCurrentPlan({...currentPlan, duration: e.target.value})} />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label>Descrição</Label>
                    <Input value={currentPlan.description || ''} onChange={(e) => setCurrentPlan({...currentPlan, description: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Roteiro</Label>
                        <Select value={currentPlan.route_id} onValueChange={(v) => setCurrentPlan({...currentPlan, route_id: v})}>
                            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                            <SelectContent>{MOCK_ROUTES.map(r => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label>Cliente</Label>
                        <Select value={currentPlan.user_id} onValueChange={(v) => setCurrentPlan({...currentPlan, user_id: v})}>
                            <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                            <SelectContent>{MOCK_USERS.map(u => <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>)}</SelectContent>
                        </Select>
                    </div>
                </div>
              </div>
            ) : (
              // STEP 2: Sessions
              <div className="flex gap-4 h-full min-h-[400px]">
                {/* Sessions List (Left) */}
                <div className="w-1/2 flex flex-col border-r pr-4">
                   <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium text-sm">Sessões</h4>
                      <Button size="sm" variant="outline" onClick={addSession}><Plus className="h-3 w-3 mr-1" /> Nova</Button>
                   </div>
                   <ScrollArea className="flex-1 pr-2">
                       <Accordion type="single" collapsible className="space-y-2">
                         {(currentPlan.sessions || []).map((session, index) => (
                           <AccordionItem key={session.id} value={session.id} className="border rounded px-3 bg-muted/20">
                             <AccordionTrigger className="hover:no-underline py-2">
                               <div className="flex flex-col items-start text-left">
                                   <span className="font-medium text-sm">{session.title || `Sessão ${index + 1}`}</span>
                                   <span className="text-xs text-muted-foreground">{session.exercises.length} exercícios</span>
                               </div>
                             </AccordionTrigger>
                             <AccordionContent className="pt-2">
                               {/* Session Inputs */}
                               <div className="space-y-3 mb-4 border-b pb-3">
                                    <div className="space-y-1">
                                        <Label className="text-xs">Título da Sessão</Label>
                                        <Input className="h-7 text-xs" value={session.title} onChange={(e) => {
                                                const newSessions = [...(currentPlan.sessions || [])];
                                                newSessions[index].title = e.target.value;
                                                setCurrentPlan({ ...currentPlan, sessions: newSessions });
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Descrição / Notas</Label>
                                        <Input className="h-7 text-xs" placeholder="Ex: Foco em cardio..." value={session.description || ''} onChange={(e) => {
                                                const newSessions = [...(currentPlan.sessions || [])];
                                                newSessions[index].description = e.target.value;
                                                setCurrentPlan({ ...currentPlan, sessions: newSessions });
                                            }}
                                        />
                                    </div>
                               </div>

                               {/* Exercises in Session */}
                               <div className="space-y-2">
                                 {session.exercises.map(ex => (
                                   <div key={ex.id} className="flex justify-between items-center bg-background p-2 rounded text-xs border shadow-sm">
                                      <span>{ex.title}</span>
                                      <Button size="icon" variant="ghost" className="h-5 w-5 text-destructive" onClick={() => removeExerciseFromSession(session.id, ex.id)}><Trash2 className="h-3 w-3" /></Button>
                                   </div>
                                 ))}
                                 <div className="p-2 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100 mt-2 flex items-center gap-2"><CheckCircle2 className="h-3 w-3" /> Selecione à direita para adicionar</div>
                               </div>
                               <div className="mt-3 pt-2 border-t"><Button size="sm" variant="destructive" className="w-full h-7 text-xs" onClick={() => removeSession(session.id)}>Remover Sessão</Button></div>
                             </AccordionContent>
                           </AccordionItem>
                         ))}
                       </Accordion>
                   </ScrollArea>
                </div>
                
                {/* Exercise Picker (Right) */}
                <div className="w-1/2 flex flex-col pl-2">
                   <h4 className="font-medium text-sm mb-4">Adicionar Exercícios</h4>
                   <ExercisePicker exercises={exercises} onSelect={(ex) => {
                       const sessions = currentPlan.sessions || [];
                       if (sessions.length === 0) { alert("Crie uma sessão primeiro!"); return; }
                       // Add to last session default
                       addExerciseToSession(sessions[sessions.length - 1].id, ex);
                   }} />
                </div>
              </div>
            )}
          </div>

          <DialogFooter>
             {wizardStep === 2 && <Button variant="ghost" onClick={() => setWizardStep(1)}><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button>}
             {wizardStep === 1 ? <Button onClick={() => setWizardStep(2)}>Próximo <ArrowRight className="ml-2 h-4 w-4" /></Button> : <Button onClick={handleFinishWizard}>{isEditing ? 'Guardar Alterações' : 'Finalizar'}</Button>}
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* --- DETAILS MODAL --- */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
            <DialogHeader>
                <div className="flex items-start justify-between mr-8">
                    <div>
                        <DialogTitle className="text-2xl">{selectedPlan?.name}</DialogTitle>
                        <p className="text-sm text-muted-foreground mt-1">{selectedPlan?.description}</p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {selectedPlan?.status.toUpperCase()}
                    </Badge>
                </div>
            </DialogHeader>

            {selectedPlan && (
                <div className="space-y-6 mt-4">
                    {/* INFO CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-muted/30 p-4 rounded-lg border">
                            <div className="flex items-center gap-2 text-primary mb-2">
                                <MapPin className="h-5 w-5" />
                                <span className="font-semibold text-sm">Roteiro</span>
                            </div>
                            <p className="font-medium">{MOCK_ROUTES.find(r => r.id === selectedPlan.route_id)?.name}</p>
                        </div>
                        <div className="bg-muted/30 p-4 rounded-lg border">
                            <div className="flex items-center gap-2 text-primary mb-2">
                                <Users className="h-5 w-5" />
                                <span className="font-semibold text-sm">Cliente</span>
                            </div>
                            <p className="font-medium">{MOCK_USERS.find(u => u.id === selectedPlan.user_id)?.name}</p>
                        </div>
                        <div className="bg-muted/30 p-4 rounded-lg border">
                            <div className="flex items-center gap-2 text-primary mb-2">
                                <Clock className="h-5 w-5" />
                                <span className="font-semibold text-sm">Duração</span>
                            </div>
                            <p className="font-medium">{selectedPlan.duration}</p>
                        </div>
                    </div>

                    {/* SESSIONS DETAILS */}
                    <div>
                        <h3 className="text-lg font-semibold mb-3">Estrutura de Sessões</h3>
                        <div className="space-y-4">
                            {selectedPlan.sessions.map((session, idx) => (
                                <div key={idx} className="border rounded-lg p-4">
                                    <h4 className="font-medium text-base">{session.title}</h4>
                                    {session.description && <p className="text-sm text-muted-foreground mb-2">{session.description}</p>}
                                    <div className="mt-2 pl-4 border-l-2">
                                        {session.exercises.map((ex, i) => (
                                            <div key={i} className="text-sm py-1 flex justify-between">
                                                <span>{i + 1}. {ex.title}</span>
                                                <Badge variant="secondary" className="text-[10px]">{ex.difficulty}</Badge>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </DialogContent>
      </Dialog>

      {/* --- DELETE MODAL --- */}
      <DeletePlanModal 
        open={!!planToDelete} 
        onOpenChange={(open) => !open && setPlanToDelete(null)}
        onConfirm={confirmDelete}
        planName={planToDelete?.name || ''}
      />
    </div>
  );
};

export default TrainingManager;