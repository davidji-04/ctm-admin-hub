import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import {
  Users,
  Crown,
  Route,
  Star,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  MessageSquare,
  CloudRain,
  UserPlus,
  FileText,
  Package,
  Download,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Funnel,
  FunnelChart,
  LabelList,
  Cell,
} from "recharts";
import { toast } from "sonner";

// Importa os teus ficheiros de mock data
import { SHARED_MOCK_ROUTES } from "@/data/mockData";
import { MOCK_USERS } from "@/data/mockUsers"; // Ajusta o caminho se tiveres os users noutro ficheiro
import { MOCK_ITINERARIES } from "@/data/mockItineraries";

export const DashboardTab = () => {
  const navigate = useNavigate();

  const handleExport = () => {
    toast.success("Relatório CSV descarregado com sucesso!");
    console.log("Relatório CSV descarregado");
  };

  // 1. Cálculos de KPIs Dinâmicos
  const kpis = useMemo(() => {
    const totalUsers = MOCK_USERS.length;
    const premiumUsers = MOCK_USERS.filter(u => u.type === "PREMIUM").length;
    const activeRoutes = SHARED_MOCK_ROUTES.filter(r => r.status === "active").length;

    // Calcula a média de rating de todos os percursos (com segurança para evitar divisão por 0)
    const validRatings = SHARED_MOCK_ROUTES.filter(r => r.rating);
    const averageRating = validRatings.length > 0
      ? validRatings.reduce((acc, r) => acc + (r.rating || 0), 0) / validRatings.length
      : 0;

    return { totalUsers, premiumUsers, activeRoutes, averageRating };
  }, []);

  const kpiCards = [
    {
      title: "Utilizadores Totais",
      value: kpis.totalUsers.toLocaleString("pt-PT"),
      trend: 12, // Mantive um valor estático de tendência (já que não temos histórico)
      icon: Users,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Utilizadores Premium",
      value: kpis.premiumUsers.toLocaleString("pt-PT"),
      trend: 8,
      icon: Crown,
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
    {
      title: "Percursos Ativos",
      value: kpis.activeRoutes.toString(),
      trend: 4,
      icon: Route,
      color: "text-emerald-500",
      bgColor: "bg-emerald-500/10",
    },
    {
      title: "Avaliação Média",
      value: kpis.averageRating.toFixed(1),
      trend: 2,
      icon: Star,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
  ];

  // 2. Top Percursos Dinâmico (ordenar por acessos)
  const topRoutesData = useMemo(() => {
    return [...SHARED_MOCK_ROUTES]
      .sort((a, b) => (b.totalAccesses || 0) - (a.totalAccesses || 0))
      .slice(0, 5)
      .map(route => ({
        name: route.title,
        accesses: route.totalAccesses || 0,
      }));
  }, []);

  // 3. Funil de Conversão Dinâmico
  const conversionFunnelData = useMemo(() => {
    const activeUsers = MOCK_USERS.filter(u => u.status === "active").length;
    return [
      { stage: "Inscrições", value: kpis.totalUsers, fill: "hsl(var(--chart-1))" },
      { stage: "Ativos", value: activeUsers, fill: "hsl(var(--chart-2))" },
      { stage: "Premium", value: kpis.premiumUsers, fill: "hsl(var(--chart-3))" },
    ];
  }, [kpis.totalUsers, kpis.premiumUsers]);

  // 4. Sistema de Alertas Inteligente
  const dynamicAlerts = useMemo(() => {
    const alerts = [];

    // Alerta para percursos em rascunho
    const draftRoutes = SHARED_MOCK_ROUTES.filter(r => r.status === "draft");
    draftRoutes.forEach(r => {
      alerts.push({
        id: `route-${r.id}`,
        type: "route",
        priority: "medium",
        message: `Rascunho pendente: ${r.title}`,
        link: "/percursos",
      });
    });

    // Alerta para utilizadores suspensos
    const suspendedUsers = MOCK_USERS.filter(u => u.status === "suspended");
    suspendedUsers.forEach(u => {
      alerts.push({
        id: `user-${u.id}`,
        type: "user",
        priority: "high",
        message: `Utilizador suspenso: ${u.name}`,
        link: "/utilizadores",
      });
    });

    // Adicionamos um alerta de sistema para não ficar vazio caso tudo esteja normal
    if (alerts.length === 0) {
      alerts.push({
        id: "sys-1",
        type: "review",
        priority: "low",
        message: "Nenhuma ação pendente no momento.",
        link: "#",
      });
    }

    return alerts.slice(0, 4); // Mostra no máximo os 4 alertas mais relevantes
  }, []);

  // Dados estáticos para o gráfico de linha (precisaria de histórico temporal)
  const activeUsersData = [
    { day: "01/03", users: 120 }, { day: "05/03", users: 135 },
    { day: "10/03", users: 125 }, { day: "15/03", users: 145 },
    { day: "20/03", users: 160 }, { day: "25/03", users: 175 },
    { day: "30/03", users: 190 },
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "review": return <MessageSquare className="h-4 w-4" />;
      case "weather": return <CloudRain className="h-4 w-4" />;
      case "user": return <UserPlus className="h-4 w-4" />;
      case "route": return <FileText className="h-4 w-4" />;
      case "equipment": return <Package className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-destructive/10 text-destructive border-destructive/20";
      case "medium": return "bg-amber-500/10 text-amber-600 border-amber-500/20";
      case "low": return "bg-muted text-muted-foreground border-border";
      default: return "bg-muted text-muted-foreground border-border";
    }
  };

  return (
    <div className="space-y-6">
      {/* Export Button */}
      <div className="flex justify-end">
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Exportar CSV
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <Card key={kpi.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-lg ${kpi.bgColor}`}>
                  <kpi.icon className={`h-6 w-6 ${kpi.color}`} />
                </div>
                <Badge
                  variant="outline"
                  className={`gap-1 ${kpi.trend >= 0
                      ? "text-emerald-600 border-emerald-200 bg-emerald-50"
                      : "text-destructive border-destructive/20 bg-destructive/10"
                    }`}
                >
                  {kpi.trend >= 0 ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {kpi.trend >= 0 ? "+" : ""}
                  {kpi.trend}%
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-sm text-muted-foreground mt-1">{kpi.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Users Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Utilizadores Ativos - Últimos 30 dias
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activeUsersData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="day"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={false}
                  activeDot={{ r: 6, fill: "hsl(var(--primary))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Routes Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Top 5 Percursos Mais Acedidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topRoutesData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis type="number" tick={{ fontSize: 11 }} tickLine={false} axisLine={false} />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={130}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="accesses" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Second Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Conversion Funnel */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">
              Conversão FREE → PREMIUM
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <FunnelChart>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Funnel
                  dataKey="value"
                  data={conversionFunnelData}
                  isAnimationActive
                >
                  {conversionFunnelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                  <LabelList
                    position="right"
                    fill="hsl(var(--foreground))"
                    stroke="none"
                    dataKey="stage"
                    fontSize={12}
                  />
                  <LabelList
                    position="center"
                    fill="hsl(var(--primary-foreground))"
                    stroke="none"
                    dataKey="value"
                    fontSize={14}
                    fontWeight="bold"
                  />
                </Funnel>
              </FunnelChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Alerts Panel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Alertas Pendentes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {dynamicAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => navigate(alert.link)}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors hover:bg-accent/50 ${getPriorityColor(
                  alert.priority
                )}`}
              >
                <div className="shrink-0">{getAlertIcon(alert.type)}</div>
                <p className="text-sm font-medium">{alert.message}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};