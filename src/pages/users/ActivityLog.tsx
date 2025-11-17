import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Activity, 
  LogIn, 
  LogOut, 
  Lock, 
  Shield, 
  FileEdit, 
  FileText,
  MapPin,
  Users,
  Image as ImageIcon,
  Settings,
  Search,
  Calendar
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ActivityLogEntry {
  id: string;
  type: "login" | "logout" | "password_change" | "2fa_toggle" | "route_edit" | "route_create" | "locality_edit" | "user_edit" | "image_upload" | "settings_change";
  description: string;
  timestamp: Date;
  ipAddress: string;
  device: string;
  status: "success" | "failed" | "warning";
}

// Mock data
const mockActivities: ActivityLogEntry[] = [
  {
    id: "1",
    type: "login",
    description: "Login realizado com sucesso",
    timestamp: new Date(2025, 0, 17, 14, 30),
    ipAddress: "192.168.1.100",
    device: "Chrome on Windows",
    status: "success"
  },
  {
    id: "2",
    type: "route_edit",
    description: "Editou o percurso 'Caminho Francês'",
    timestamp: new Date(2025, 0, 17, 13, 45),
    ipAddress: "192.168.1.100",
    device: "Chrome on Windows",
    status: "success"
  },
  {
    id: "3",
    type: "locality_edit",
    description: "Adicionou localidade 'Roncesvalles' ao percurso",
    timestamp: new Date(2025, 0, 17, 13, 20),
    ipAddress: "192.168.1.100",
    device: "Chrome on Windows",
    status: "success"
  },
  {
    id: "4",
    type: "password_change",
    description: "Alterou a senha da conta",
    timestamp: new Date(2025, 0, 17, 11, 15),
    ipAddress: "192.168.1.100",
    device: "Chrome on Windows",
    status: "success"
  },
  {
    id: "5",
    type: "2fa_toggle",
    description: "Ativou autenticação de dois fatores",
    timestamp: new Date(2025, 0, 17, 11, 10),
    ipAddress: "192.168.1.100",
    device: "Chrome on Windows",
    status: "success"
  },
  {
    id: "6",
    type: "image_upload",
    description: "Fez upload de 5 imagens para a galeria",
    timestamp: new Date(2025, 0, 16, 16, 30),
    ipAddress: "192.168.1.100",
    device: "Chrome on Windows",
    status: "success"
  },
  {
    id: "7",
    type: "route_create",
    description: "Criou novo percurso 'Via Algarviana'",
    timestamp: new Date(2025, 0, 16, 15, 20),
    ipAddress: "192.168.1.100",
    device: "Chrome on Windows",
    status: "success"
  },
  {
    id: "8",
    type: "login",
    description: "Tentativa de login falhada",
    timestamp: new Date(2025, 0, 16, 9, 45),
    ipAddress: "192.168.1.50",
    device: "Chrome on Windows",
    status: "failed"
  },
  {
    id: "9",
    type: "settings_change",
    description: "Atualizou configurações de perfil",
    timestamp: new Date(2025, 0, 15, 14, 30),
    ipAddress: "192.168.1.100",
    device: "Chrome on Windows",
    status: "success"
  },
  {
    id: "10",
    type: "logout",
    description: "Terminou sessão",
    timestamp: new Date(2025, 0, 15, 18, 0),
    ipAddress: "192.168.1.100",
    device: "Chrome on Windows",
    status: "success"
  }
];

export default function ActivityLog() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activityFilter, setActivityFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const getActivityIcon = (type: ActivityLogEntry["type"]) => {
    const iconClass = "h-5 w-5";
    switch (type) {
      case "login":
        return <LogIn className={iconClass} />;
      case "logout":
        return <LogOut className={iconClass} />;
      case "password_change":
        return <Lock className={iconClass} />;
      case "2fa_toggle":
        return <Shield className={iconClass} />;
      case "route_edit":
        return <FileEdit className={iconClass} />;
      case "route_create":
        return <FileText className={iconClass} />;
      case "locality_edit":
        return <MapPin className={iconClass} />;
      case "user_edit":
        return <Users className={iconClass} />;
      case "image_upload":
        return <ImageIcon className={iconClass} />;
      case "settings_change":
        return <Settings className={iconClass} />;
      default:
        return <Activity className={iconClass} />;
    }
  };

  const getStatusBadge = (status: ActivityLogEntry["status"]) => {
    switch (status) {
      case "success":
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Sucesso</Badge>;
      case "failed":
        return <Badge className="bg-red-100 text-red-700 hover:bg-red-100">Falhado</Badge>;
      case "warning":
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Aviso</Badge>;
    }
  };

  const getActivityTypeLabel = (type: ActivityLogEntry["type"]) => {
    const labels: Record<ActivityLogEntry["type"], string> = {
      login: "Login",
      logout: "Logout",
      password_change: "Alteração de Senha",
      "2fa_toggle": "2FA",
      route_edit: "Edição de Percurso",
      route_create: "Criação de Percurso",
      locality_edit: "Edição de Localidade",
      user_edit: "Edição de Utilizador",
      image_upload: "Upload de Imagem",
      settings_change: "Configurações"
    };
    return labels[type];
  };

  const filteredActivities = mockActivities.filter((activity) => {
    const matchesSearch = activity.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = activityFilter === "all" || activity.type === activityFilter;
    const matchesStatus = statusFilter === "all" || activity.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Registo de Atividade</h1>
          <p className="text-muted-foreground mt-1">
            Histórico completo das suas ações no sistema
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="rounded-xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Total de Atividades</p>
                  <p className="text-2xl font-bold text-foreground">{mockActivities.length}</p>
                </div>
                <Activity className="h-8 w-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ações de Hoje</p>
                  <p className="text-2xl font-bold text-foreground">
                    {mockActivities.filter(a => 
                      format(a.timestamp, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd")
                    ).length}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Bem Sucedidas</p>
                  <p className="text-2xl font-bold text-green-600">
                    {mockActivities.filter(a => a.status === "success").length}
                  </p>
                </div>
                <Shield className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-xl">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Falhadas</p>
                  <p className="text-2xl font-bold text-red-600">
                    {mockActivities.filter(a => a.status === "failed").length}
                  </p>
                </div>
                <Activity className="h-8 w-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
            <CardDescription>
              Filtre o registo de atividades por tipo, status ou pesquise por descrição
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Pesquisar atividades..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>

              <Select value={activityFilter} onValueChange={setActivityFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Tipo de Atividade" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Tipos</SelectItem>
                  <SelectItem value="login">Login</SelectItem>
                  <SelectItem value="logout">Logout</SelectItem>
                  <SelectItem value="password_change">Alteração de Senha</SelectItem>
                  <SelectItem value="2fa_toggle">2FA</SelectItem>
                  <SelectItem value="route_edit">Edição de Percurso</SelectItem>
                  <SelectItem value="route_create">Criação de Percurso</SelectItem>
                  <SelectItem value="locality_edit">Edição de Localidade</SelectItem>
                  <SelectItem value="image_upload">Upload de Imagem</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os Status</SelectItem>
                  <SelectItem value="success">Sucesso</SelectItem>
                  <SelectItem value="failed">Falhado</SelectItem>
                  <SelectItem value="warning">Aviso</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Activities List */}
        <Card className="rounded-xl">
          <CardHeader>
            <CardTitle>Histórico de Atividades</CardTitle>
            <CardDescription>
              {filteredActivities.length} atividade(s) encontrada(s)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredActivities.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Activity className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhuma atividade encontrada</p>
                </div>
              ) : (
                filteredActivities.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-4 p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-1">
                      {getActivityIcon(activity.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge variant="outline" className="text-xs">
                            {getActivityTypeLabel(activity.type)}
                          </Badge>
                          {getStatusBadge(activity.status)}
                        </div>
                        <span className="text-sm text-muted-foreground whitespace-nowrap">
                          {format(activity.timestamp, "dd MMM yyyy, HH:mm", { locale: ptBR })}
                        </span>
                      </div>
                      
                      <p className="text-sm text-foreground font-medium mb-2">
                        {activity.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <span>IP: {activity.ipAddress}</span>
                        <span>•</span>
                        <span>{activity.device}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
