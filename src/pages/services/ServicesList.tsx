import { useState, useMemo } from "react";
import { 
  Plus, Search, MapPin, MoreVertical, 
  Edit, Eye, Trash2, Filter, Save, CheckCircle2, 
  Clock, AlertCircle, XCircle, Calendar
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";


type ServiceType = "hospedagem" | "refeicao" | "transporte" | "bilhete" | "outro";
type StatusType = "confirmada" | "pendente" | "cancelada";

interface Locality {
  id: string;
  name: string;
}

interface Itinerary {
  id: string;
  title: string;
  clientName: string;
  routeId: string;
}

interface RegisteredService {
  id: string;
  name: string;
  type: ServiceType;
  localityId: string;
  contactInfo?: string;
}

interface ServiceSchedule {
  id: string;
  itineraryId: string;
  itineraryTitle: string;
  clientName: string;
  serviceType: ServiceType;
  date: string;
  time: string;
  status: StatusType;
  localityId?: string;
  localityName?: string;
  registeredServiceId?: string;
  establishmentName: string;
  contactInfo?: string;
  notes?: string;
}


const MOCK_REGISTERED_SERVICES: RegisteredService[] = [
  { id: "srv-1", name: "Hotel Paço de Vitorino", type: "hospedagem", localityId: "loc-3", contactInfo: "258 742 000" },
  { id: "srv-2", name: "Pensão Riverside", type: "hospedagem", localityId: "loc-3", contactInfo: "258 900 000" },
  { id: "srv-3", name: "Restaurante A Ilha", type: "refeicao", localityId: "loc-6", contactInfo: "269 905 000" },
  { id: "srv-4", name: "Taxi Transfer Porto", type: "transporte", localityId: "loc-1", contactInfo: "912 345 678" },
  { id: "srv-5", name: "Quinta do Vallado", type: "bilhete", localityId: "loc-9", contactInfo: "254 318 000" },
  { id: "srv-6", name: "Hotel Vila Galé", type: "hospedagem", localityId: "loc-6", contactInfo: "269 860 000" },
  { id: "srv-7", name: "Restaurante Douro In", type: "refeicao", localityId: "loc-9", contactInfo: "254 732 000" },
  { id: "srv-8", name: "Transfer Valença", type: "transporte", localityId: "loc-4", contactInfo: "913 456 789" },
];

const MOCK_ITINERARIES: Itinerary[] = [
  { id: "it-1", title: "Caminho Português (Completo)", clientName: "João Silva", routeId: "rt-1" },
  { id: "it-2", title: "Rota Vicentina - Premium", clientName: "Maria Santos", routeId: "rt-2" },
  { id: "it-3", title: "Douro Vinhateiro", clientName: "Pedro Costa", routeId: "rt-3" },
];

const MOCK_LOCALITIES_BY_ROUTE: Record<string, Locality[]> = {
  "rt-1": [
    { id: "loc-1", name: "Porto" }, 
    { id: "loc-2", name: "Barcelos" }, 
    { id: "loc-3", name: "Ponte de Lima" }, 
    { id: "loc-4", name: "Valença" }
  ],
  "rt-2": [
    { id: "loc-5", name: "Sines" }, 
    { id: "loc-6", name: "Porto Covo" }, 
    { id: "loc-7", name: "Vila Nova de Milfontes" }
  ],
  "rt-3": [
    { id: "loc-8", name: "Peso da Régua" }, 
    { id: "loc-9", name: "Pinhão" }
  ]
};

const INITIAL_SCHEDULES: ServiceSchedule[] = [
  {
    id: "sch-1", 
    itineraryId: "it-1", 
    itineraryTitle: "Caminho Português (Completo)",
    clientName: "João Silva", 
    serviceType: "hospedagem", 
    date: "2024-05-10", 
    time: "14:00",
    status: "confirmada", 
    localityId: "loc-3",
    localityName: "Ponte de Lima", 
    registeredServiceId: "srv-1",
    establishmentName: "Hotel Paço de Vitorino", 
    contactInfo: "258 742 000",
    notes: "Late check-in solicitado"
  },
  {
    id: "sch-2", 
    itineraryId: "it-2", 
    itineraryTitle: "Rota Vicentina - Premium",
    clientName: "Maria Santos", 
    serviceType: "refeicao", 
    date: "2024-05-12", 
    time: "20:00",
    status: "pendente", 
    localityId: "loc-6",
    localityName: "Porto Covo", 
    registeredServiceId: "srv-3",
    establishmentName: "Restaurante A Ilha", 
    contactInfo: "269 905 000",
    notes: "Cliente vegetariana"
  },
  {
    id: "sch-3", 
    itineraryId: "it-1", 
    itineraryTitle: "Caminho Português (Completo)",
    clientName: "João Silva", 
    serviceType: "transporte", 
    date: "2024-05-15", 
    time: "09:00",
    status: "cancelada", 
    localityId: "loc-4",
    localityName: "Valença", 
    establishmentName: "Taxi Transfer Privado", 
    contactInfo: "965 123 456",
    notes: "Cancelado via WhatsApp"
  },
];

export default function ServiceSchedules() {
  const [schedules, setSchedules] = useState<ServiceSchedule[]>(INITIAL_SCHEDULES);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [currentSchedule, setCurrentSchedule] = useState<Partial<ServiceSchedule>>({});
  const [availableLocalities, setAvailableLocalities] = useState<Locality[]>([]);
  const [useRegisteredService, setUseRegisteredService] = useState(true);
  const [availableServices, setAvailableServices] = useState<RegisteredService[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredSchedules = useMemo(() => {
    return schedules.filter(item => {
      const matchesSearch = 
        item.clientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.itineraryTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.establishmentName.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === "all" || item.status === statusFilter;
      const matchesType = typeFilter === "all" || item.serviceType === typeFilter;
      const matchesDateFrom = !dateFrom || item.date >= dateFrom;
      const matchesDateTo = !dateTo || item.date <= dateTo;

      return matchesSearch && matchesStatus && matchesType && matchesDateFrom && matchesDateTo;
    });
  }, [schedules, searchQuery, statusFilter, typeFilter, dateFrom, dateTo]);

  const totalPages = Math.ceil(filteredSchedules.length / itemsPerPage);
  const paginatedSchedules = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredSchedules.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredSchedules, currentPage]);

  useMemo(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter, dateFrom, dateTo]);

  const handleOpenCreate = () => {
    setIsEditing(false);
    setCurrentSchedule({ 
      status: "pendente", 
      serviceType: "hospedagem",
      date: new Date().toISOString().split('T')[0] 
    });
    setAvailableLocalities([]);
    setAvailableServices([]);
    setUseRegisteredService(true);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (schedule: ServiceSchedule) => {
    setIsEditing(true);
    setCurrentSchedule({ ...schedule });
    
    const itinerary = MOCK_ITINERARIES.find(i => i.id === schedule.itineraryId);
    if (itinerary) {
      const localities = MOCK_LOCALITIES_BY_ROUTE[itinerary.routeId] || [];
      setAvailableLocalities(localities);
      
      if (schedule.localityId) {
        const services = MOCK_REGISTERED_SERVICES.filter(s => s.localityId === schedule.localityId);
        setAvailableServices(services);
      }
    }
    
    setUseRegisteredService(!!schedule.registeredServiceId);
    setIsFormOpen(true);
  };

  const handleItinerarySelect = (itineraryId: string) => {
    const itinerary = MOCK_ITINERARIES.find(i => i.id === itineraryId);
    if (itinerary) {
      setCurrentSchedule(prev => ({
        ...prev,
        itineraryId: itinerary.id,
        itineraryTitle: itinerary.title,
        clientName: itinerary.clientName, 
        localityId: "",
        registeredServiceId: "",
        establishmentName: "",
        contactInfo: ""
      }));
      setAvailableLocalities(MOCK_LOCALITIES_BY_ROUTE[itinerary.routeId] || []);
      setAvailableServices([]);
    }
  };

  const handleLocalitySelect = (localityId: string) => {
    const locality = availableLocalities.find(l => l.id === localityId);
    
    setCurrentSchedule(prev => ({
      ...prev,
      localityId,
      localityName: locality?.name,
      registeredServiceId: "",
      establishmentName: "",
      contactInfo: ""
    }));
    
    const filteredServices = MOCK_REGISTERED_SERVICES.filter(
      s => s.localityId === localityId && 
      (!currentSchedule.serviceType || s.type === currentSchedule.serviceType)
    );
    setAvailableServices(filteredServices);
  };

  const handleServiceSelect = (serviceId: string) => {
    const service = MOCK_REGISTERED_SERVICES.find(s => s.id === serviceId);
    if (service) {
      setCurrentSchedule(prev => ({
        ...prev,
        registeredServiceId: service.id,
        establishmentName: service.name,
        contactInfo: service.contactInfo,
        serviceType: service.type
      }));
    }
  };

  const handleSave = () => {
    if (!currentSchedule.itineraryId) {
      alert("Selecione um roteiro");
      return;
    }
    if (!currentSchedule.localityId) {
      alert("Selecione uma localidade");
      return;
    }
    if (!currentSchedule.establishmentName) {
      alert("Preencha o estabelecimento");
      return;
    }

    const locName = availableLocalities.find(l => l.id === currentSchedule.localityId)?.name || currentSchedule.localityName;

    const scheduleToSave = {
      ...currentSchedule,
      localityName: locName,
      id: currentSchedule.id || `sch-${Date.now()}`
    } as ServiceSchedule;

    if (isEditing) {
      setSchedules(schedules.map(s => s.id === scheduleToSave.id ? scheduleToSave : s));
    } else {
      setSchedules([scheduleToSave, ...schedules]);
    }
    setIsFormOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem a certeza que deseja eliminar esta programação?")) {
      setSchedules(schedules.filter(s => s.id !== id));
    }
  };

  const clearFilters = () => {
    setStatusFilter("all");
    setTypeFilter("all");
    setDateFrom("");
    setDateTo("");
    setSearchQuery("");
  };

  const getStatusBadge = (status: StatusType) => {
    switch (status) {
      case "confirmada": 
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">
          <CheckCircle2 className="w-3 h-3 mr-1"/> Confirmada
        </Badge>;
      case "pendente": 
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
          <Clock className="w-3 h-3 mr-1"/> Pendente
        </Badge>;
      case "cancelada": 
        return <Badge variant="destructive" className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">
          <XCircle className="w-3 h-3 mr-1"/> Cancelada
        </Badge>;
      default: 
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Service Scheduling</h1>
          <p className="text-muted-foreground">Create and Manage Service Schedules</p>
        </div>
        <Button onClick={handleOpenCreate} className="gap-2">
          <Plus className="w-4 h-4" />
          New Schedule
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters & Search</CardTitle>
          <CardDescription>Refine your service schedule search</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search by client, itinerary or service..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmada">Confirmada</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Service Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="hospedagem">Accommodation</SelectItem>
                <SelectItem value="refeicao">Meal</SelectItem>
                <SelectItem value="transporte">Transport</SelectItem>
                <SelectItem value="bilhete">Ticket</SelectItem>
              </SelectContent>
            </Select>

            <Input
              type="date"
              placeholder="From"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />

            <Input
              type="date"
              placeholder="To"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          {(searchQuery || statusFilter !== "all" || typeFilter !== "all" || dateFrom || dateTo) && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary">Search: {searchQuery}</Badge>
              )}
              {statusFilter !== "all" && (
                <Badge variant="secondary">Status: {statusFilter}</Badge>
              )}
              {typeFilter !== "all" && (
                <Badge variant="secondary">Type: {typeFilter}</Badge>
              )}
              {(dateFrom || dateTo) && (
                <Badge variant="secondary">
                  Period: {dateFrom || "..."} to {dateTo || "..."}
                </Badge>
              )}
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Service Schedules</CardTitle>
              <CardDescription>
                {filteredSchedules.length} schedule{filteredSchedules.length !== 1 ? 's' : ''} found
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-muted/50">
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Client</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Itinerary</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Service Type</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Date</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Status</th>
                  <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground">Locality</th>
                  <th className="h-12 px-4 text-right align-middle font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSchedules.length === 0 ? (
                  <tr className="border-b">
                    <td colSpan={7} className="h-24 text-center text-muted-foreground">
                      No schedules found matching your criteria
                    </td>
                  </tr>
                ) : (
                  paginatedSchedules.map((schedule) => (
                    <tr key={schedule.id} className="border-b hover:bg-muted/5">
                      <td className="p-4 font-medium">{schedule.clientName}</td>
                      <td className="p-4 text-sm max-w-[200px] truncate" title={schedule.itineraryTitle}>
                        {schedule.itineraryTitle}
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">{schedule.establishmentName}</span>
                          <span className="text-xs text-muted-foreground capitalize">{schedule.serviceType}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex flex-col text-sm">
                          <span>{new Date(schedule.date).toLocaleDateString('pt-PT')}</span>
                          <span className="text-xs text-muted-foreground">{schedule.time}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        {getStatusBadge(schedule.status)}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center text-sm text-muted-foreground">
                          <MapPin className="mr-1 h-3 w-3" /> {schedule.localityName || "—"}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setCurrentSchedule(schedule); setIsDetailsOpen(true); }}>
                              <Eye className="mr-2 h-4 w-4" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleOpenEdit(schedule)}>
                              <Edit className="mr-2 h-4 w-4" /> Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => handleDelete(schedule.id)}>
                              <Trash2 className="mr-2 h-4 w-4" /> Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between py-4">
            <div className="text-sm text-muted-foreground">
              Showing {paginatedSchedules.length === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredSchedules.length)} of{" "}
              {filteredSchedules.length} results
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1)
                  .filter(page => page === 1 || page === totalPages || Math.abs(page - currentPage) <= 1)
                  .map((page, idx, arr) => {
                    const prevPage = arr[idx - 1];
                    const showEllipsis = prevPage && page - prevPage > 1;
                    
                    return (
                      <div key={page} className="flex items-center">
                        {showEllipsis && <span className="px-2 text-muted-foreground">...</span>}
                        <Button
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          className="w-9"
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </Button>
                      </div>
                    );
                  })}
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages || totalPages === 0}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Edit Schedule" : "New Service Schedule"}</DialogTitle>
            <DialogDescription>
              Fill in the service details. Client will be automatically associated with the itinerary.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-6 py-4">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="roteiro">Itinerary Selection *</Label>
                <Select 
                  value={currentSchedule.itineraryId} 
                  onValueChange={handleItinerarySelect}
                  disabled={isEditing} 
                >
                  <SelectTrigger id="roteiro">
                    <SelectValue placeholder="Select Itinerary" />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCK_ITINERARIES.map(it => (
                      <SelectItem key={it.id} value={it.id}>{it.title}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="cliente">Client (Automatic)</Label>
                <Input 
                  id="cliente" 
                  value={currentSchedule.clientName || ""} 
                  readOnly 
                  className="bg-muted"
                  placeholder="Select an itinerary first..."
                />
              </div>
            </div>

            <div className="h-px bg-border" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Service Type</Label>
                <Select 
                  value={currentSchedule.serviceType} 
                  onValueChange={(v) => setCurrentSchedule({...currentSchedule, serviceType: v as ServiceType})}
                >
                  <SelectTrigger><SelectValue placeholder="Type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hospedagem">Accommodation</SelectItem>
                    <SelectItem value="refeicao">Meal</SelectItem>
                    <SelectItem value="transporte">Transport</SelectItem>
                    <SelectItem value="bilhete">Ticket</SelectItem>
                    <SelectItem value="outro">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Date</Label>
                <Input 
                  type="date" 
                  value={currentSchedule.date} 
                  onChange={(e) => setCurrentSchedule({...currentSchedule, date: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <Label>Time</Label>
                <Input 
                  type="time" 
                  value={currentSchedule.time} 
                  onChange={(e) => setCurrentSchedule({...currentSchedule, time: e.target.value})}
                />
              </div>
            </div>

            <div className="h-px bg-border" />

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                <MapPin className="w-4 h-4" />
                <span>Operational Link (Locality + Establishment)</span>
              </div>

              <div className="space-y-2 bg-muted/20 p-4 rounded-md">
                <Label className="flex items-center gap-2">
                  <span className="text-red-500">*</span> Locality/Stage
                </Label>
                <Select 
                  value={currentSchedule.localityId} 
                  onValueChange={handleLocalitySelect}
                  disabled={availableLocalities.length === 0}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={availableLocalities.length === 0 ? "Select itinerary first" : "Choose locality"} />
                  </SelectTrigger>
                  <SelectContent>
                    {availableLocalities.map(loc => (
                      <SelectItem key={loc.id} value={loc.id}>{loc.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {currentSchedule.localityId && (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-blue-50 rounded-md border border-blue-200">
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="use-registered" 
                        name="establishment-type" 
                        checked={useRegisteredService}
                        onChange={() => {
                          setUseRegisteredService(true);
                          setCurrentSchedule(prev => ({...prev, registeredServiceId: "", establishmentName: "", contactInfo: ""}));
                        }}
                        className="accent-blue-600 h-4 w-4"
                      />
                      <Label htmlFor="use-registered" className="cursor-pointer font-medium">
                        Link to Registered Service
                      </Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input 
                        type="radio" 
                        id="use-manual" 
                        name="establishment-type" 
                        checked={!useRegisteredService}
                        onChange={() => {
                          setUseRegisteredService(false);
                          setCurrentSchedule(prev => ({...prev, registeredServiceId: "", establishmentName: "", contactInfo: ""}));
                        }}
                        className="accent-blue-600 h-4 w-4"
                      />
                      <Label htmlFor="use-manual" className="cursor-pointer font-medium">
                        Fill Manually
                      </Label>
                    </div>
                  </div>

                  {useRegisteredService ? (
                    <div className="space-y-4 p-4 border rounded-md">
                      <div className="space-y-2">
                        <Label><span className="text-red-500">*</span> Select Establishment</Label>
                        <Select value={currentSchedule.registeredServiceId} onValueChange={handleServiceSelect}>
                          <SelectTrigger>
                            <SelectValue placeholder={availableServices.length === 0 ? "No services in this locality" : "Choose establishment"} />
                          </SelectTrigger>
                          <SelectContent>
                            {availableServices.map(srv => (
                              <SelectItem key={srv.id} value={srv.id}>{srv.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      {currentSchedule.registeredServiceId && (
                        <div className="bg-green-50 p-3 rounded border border-green-200">
                          <p className="text-sm font-semibold text-green-900">✓ Service Linked</p>
                          <div className="text-sm text-green-800 mt-2">
                            <p><strong>Name:</strong> {currentSchedule.establishmentName}</p>
                            {currentSchedule.contactInfo && <p><strong>Contact:</strong> {currentSchedule.contactInfo}</p>}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4 p-4 border rounded-md">
                      <div className="space-y-2">
                        <Label><span className="text-red-500">*</span> Establishment Name</Label>
                        <Input 
                          placeholder="e.g., Hotel ABC, Restaurant XYZ" 
                          value={currentSchedule.establishmentName || ""}
                          onChange={(e) => setCurrentSchedule({...currentSchedule, establishmentName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Contact Info (Optional)</Label>
                        <Input 
                          placeholder="Phone, email or booking number" 
                          value={currentSchedule.contactInfo || ""}
                          onChange={(e) => setCurrentSchedule({...currentSchedule, contactInfo: e.target.value})}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="h-px bg-border" />

            <div className="space-y-4 border rounded-md p-4 bg-muted/20">
              <Label className="font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4" /> Confirmation Status
              </Label>
              <div className="flex gap-4">
                {(["pendente", "confirmada", "cancelada"] as StatusType[]).map((st) => (
                  <div key={st} className="flex items-center space-x-2">
                    <input 
                      type="radio" 
                      id={st} 
                      name="status" 
                      checked={currentSchedule.status === st}
                      onChange={() => setCurrentSchedule({...currentSchedule, status: st})}
                      className="accent-primary h-4 w-4"
                    />
                    <Label htmlFor={st} className="capitalize cursor-pointer">{st}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Internal Notes</Label>
              <Textarea 
                placeholder="Specific reservation details..." 
                value={currentSchedule.notes || ""}
                onChange={(e) => setCurrentSchedule({...currentSchedule, notes: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFormOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}><Save className="w-4 h-4 mr-2"/> Save Schedule</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <span className="font-semibold text-muted-foreground">Client:</span>
              <span>{currentSchedule.clientName}</span>
              
              <span className="font-semibold text-muted-foreground">Itinerary:</span>
              <span>{currentSchedule.itineraryTitle}</span>
              
              <span className="font-semibold text-muted-foreground">Locality:</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" /> {currentSchedule.localityName || "—"}
              </span>
              
              <span className="font-semibold text-muted-foreground">Establishment:</span>
              <span>{currentSchedule.establishmentName}</span>
              
              {currentSchedule.contactInfo && (
                <>
                  <span className="font-semibold text-muted-foreground">Contact:</span>
                  <span className="text-blue-600">{currentSchedule.contactInfo}</span>
                </>
              )}
              
              <span className="font-semibold text-muted-foreground">Service Type:</span>
              <span className="capitalize">{currentSchedule.serviceType}</span>
              
              <span className="font-semibold text-muted-foreground">Status:</span>
              <span>
                {currentSchedule.status && getStatusBadge(currentSchedule.status as StatusType)}
              </span>

              <span className="font-semibold text-muted-foreground">Date/Time:</span>
              <span>{currentSchedule.date} at {currentSchedule.time}</span>
            </div>
            {currentSchedule.notes && (
              <div className="bg-muted p-3 rounded text-sm mt-4">
                <p className="font-semibold mb-1">Notes:</p>
                <p className="text-muted-foreground">{currentSchedule.notes}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsDetailsOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}