import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, Users, Crown, UserX, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

// Importa os dados diretamente do teu ficheiro de mock (ajusta o caminho se necessário)
import { MOCK_USERS } from "@/data/mockUsers";

export const UsersAnalysisTab = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Lógica de filtragem adaptada à nova estrutura (type e status)
  const filteredUsers = useMemo(() => {
    if (statusFilter === "all") return MOCK_USERS;
    if (statusFilter === "premium") return MOCK_USERS.filter((user) => user.type === "PREMIUM");
    if (statusFilter === "free") return MOCK_USERS.filter((user) => user.type === "FREE");
    if (statusFilter === "inactive") return MOCK_USERS.filter((user) => user.status === "inactive" || user.status === "suspended");

    return MOCK_USERS;
  }, [statusFilter]);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredUsers.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredUsers, currentPage]);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const handleExport = () => {
    toast.success("Relatório de Utilizadores CSV descarregado com sucesso!");
    console.log("Relatório de Utilizadores CSV descarregado");
  };

  // Atualizado para gerar dois Badges: Um para o Tipo (Free/Premium) e outro para o Estado (Ativo/Inativo)
  const getUserBadges = (type: string, status: string) => {
    const isPremium = type === "PREMIUM";
    const isActive = status === "active";
    const isSuspended = status === "suspended";

    return (
      <div className="flex flex-col gap-1 items-start">
        <Badge
          variant={isPremium ? "default" : "outline"}
          className={isPremium ? "bg-amber-500 hover:bg-amber-600 text-white" : "bg-blue-500/10 text-blue-600 border-blue-200"}
        >
          {isPremium ? "Premium" : "Free"}
        </Badge>

        <Badge
          variant="outline"
          className={isActive ? "bg-emerald-500/10 text-emerald-600 border-emerald-200 text-[10px] px-1.5 py-0" :
            isSuspended ? "bg-red-500/10 text-red-600 border-red-200 text-[10px] px-1.5 py-0" :
              "bg-muted text-muted-foreground border-border text-[10px] px-1.5 py-0"}
        >
          {isActive ? "Ativo" : isSuspended ? "Suspenso" : "Inativo"}
        </Badge>
      </div>
    );
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return format(new Date(dateString), "dd MMM yyyy", { locale: pt });
  };

  // Contagens dinâmicas
  const segmentCounts = useMemo(() => {
    return {
      all: MOCK_USERS.length,
      premium: MOCK_USERS.filter((u) => u.type === "PREMIUM").length,
      free: MOCK_USERS.filter((u) => u.type === "FREE").length,
      inactive: MOCK_USERS.filter((u) => u.status === "inactive" || u.status === "suspended").length,
    };
  }, []);

  return (
    <div className="space-y-6">
      {/* Segment Tabs */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Users className="h-5 w-5" />
              Segmentação de Utilizadores
            </CardTitle>
            <Button onClick={handleExport} variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              Exportar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs value={statusFilter} onValueChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}>
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:w-auto lg:inline-grid">
              <TabsTrigger value="all" className="gap-2">
                <Users className="h-4 w-4" />
                Todos
                <Badge variant="secondary" className="ml-1">{segmentCounts.all}</Badge>
              </TabsTrigger>
              <TabsTrigger value="premium" className="gap-2">
                <Crown className="h-4 w-4" />
                Premium
                <Badge variant="secondary" className="ml-1">{segmentCounts.premium}</Badge>
              </TabsTrigger>
              <TabsTrigger value="free" className="gap-2">
                <UserCheck className="h-4 w-4" />
                Free
                <Badge variant="secondary" className="ml-1">{segmentCounts.free}</Badge>
              </TabsTrigger>
              <TabsTrigger value="inactive" className="gap-2">
                <UserX className="h-4 w-4" />
                Inativos
                <Badge variant="secondary" className="ml-1">{segmentCounts.inactive}</Badge>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Lista de Utilizadores
            <span className="ml-2 text-sm font-normal text-muted-foreground">
              ({filteredUsers.length} resultados)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilizador</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Conta / Estado</TableHead>
                  <TableHead>Data Registo</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead className="text-right">Percursos Acedidos</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Nenhum utilizador encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-9 w-9">
                            <AvatarFallback className="bg-primary/10 text-primary text-sm">
                              {getInitials(user.name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {user.email}
                      </TableCell>
                      <TableCell>
                        {/* Agora renderiza tipo de conta e estado */}
                        {getUserBadges(user.type, user.status)}
                      </TableCell>
                      <TableCell>{formatDate(user.signupDate)}</TableCell>
                      <TableCell>{formatDate(user.lastAccess)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {/* Substitui Km por métricas reais da tua Mock Data */}
                        {user.routesAccessed}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                Página {currentPage} de {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Próxima
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};