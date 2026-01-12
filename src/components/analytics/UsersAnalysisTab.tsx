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
import { usersAnalyticsData, UserAnalytics } from "@/data/analyticsMockData";
import { format } from "date-fns";
import { pt } from "date-fns/locale";

export const UsersAnalysisTab = () => {
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredUsers = useMemo(() => {
    if (statusFilter === "all") return usersAnalyticsData;
    if (statusFilter === "active") {
      return usersAnalyticsData.filter(
        (user) => user.status === "active" || user.status === "premium" || user.status === "free"
      );
    }
    return usersAnalyticsData.filter((user) => user.status === statusFilter);
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

  const getStatusBadge = (status: string) => {
    const config: Record<string, { label: string; className: string }> = {
      premium: {
        label: "Premium",
        className: "bg-amber-500 hover:bg-amber-600 text-white",
      },
      active: {
        label: "Ativo",
        className: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
      },
      free: {
        label: "Free",
        className: "bg-blue-500/10 text-blue-600 border-blue-200",
      },
      inactive: {
        label: "Inativo",
        className: "bg-muted text-muted-foreground border-border",
      },
    };
    const { label, className } = config[status] || config.free;
    return (
      <Badge variant={status === "premium" ? "default" : "outline"} className={className}>
        {label}
      </Badge>
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
    return format(new Date(dateString), "dd MMM yyyy", { locale: pt });
  };

  const segmentCounts = useMemo(() => {
    return {
      all: usersAnalyticsData.length,
      premium: usersAnalyticsData.filter((u) => u.status === "premium").length,
      free: usersAnalyticsData.filter((u) => u.status === "free").length,
      inactive: usersAnalyticsData.filter((u) => u.status === "inactive").length,
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
                  <TableHead>Status</TableHead>
                  <TableHead>Data Registo</TableHead>
                  <TableHead>Último Acesso</TableHead>
                  <TableHead className="text-right">Total Km</TableHead>
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
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{formatDate(user.registrationDate)}</TableCell>
                      <TableCell>{formatDate(user.lastAccess)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {user.totalKm.toLocaleString("pt-PT")} km
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
