import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Route, Users, Star, TrendingUp, MapPin, AlertCircle, Crown, UserCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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
} from "recharts";

// 1. Importa os teus ficheiros de mock data
import { SHARED_MOCK_ROUTES } from "@/data/mockData";
import { MOCK_USERS } from "@/data/mockUsers";
import { MOCK_ITINERARIES } from "@/data/mockItineraries";

const Dashboard = () => {
  // 2. Cálculos Dinâmicos baseados na Mock Data
  const totalRoutes = SHARED_MOCK_ROUTES.length;
  const totalUsers = MOCK_USERS.length;
  const activeUsers = MOCK_USERS.filter((user) => user.status === "active").length;
  const premiumUsers = MOCK_USERS.filter((user) => user.type === "PREMIUM").length;
  const premiumRoutes = SHARED_MOCK_ROUTES.filter((route) => route.category === "premium").length;

  // Estatísticas Principais
  const stats = [
    {
      title: "Total de Percursos",
      value: totalRoutes.toString(),
      icon: Route,
      color: "text-primary",
    },
    {
      title: "Total de Utilizadores",
      value: totalUsers.toString(),
      icon: UserCheck,
      color: "text-info",
    },
    {
      title: "Utilizadores Premium",
      value: premiumUsers.toString(),
      icon: Crown,
      color: "text-warning",
    },
    {
      title: "Avaliação Média",
      value: "4.8",
      icon: Star,
      color: "text-success",
    },
    {
      title: "Roteiros Premium",
      value: premiumRoutes.toString(),
      icon: TrendingUp,
      color: "text-accent",
    },
  ];

  // 3. Funil de Conversão Dinâmico
  const conversionData = [
    {
      stage: "Total de Inscrições",
      value: totalUsers,
      percentage: totalUsers > 0 ? 100 : 0
    },
    {
      stage: "Utilizadores Ativos",
      value: activeUsers,
      percentage: totalUsers > 0 ? Math.round((activeUsers / totalUsers) * 100) : 0
    },
    {
      stage: "Conversão Premium",
      value: premiumUsers,
      percentage: totalUsers > 0 ? Math.round((premiumUsers / totalUsers) * 100) : 0
    },
  ];

  // Taxa de conversão global calculada de forma segura
  const globalConversionRate = totalUsers > 0
    ? ((premiumUsers / totalUsers) * 100).toFixed(1)
    : "0.0";

  // Mapear os percursos recentes
  const recentRoutes = SHARED_MOCK_ROUTES.slice(0, 3).map((route) => ({
    id: route.id,
    name: route.title,
    status: route.status === "active" ? "ativo" : route.status === "draft" ? "rascunho" : "inativo",
    localities: route.localities,
    distance: route.distance,
  }));

  // Mapear rascunhos para ações pendentes automaticamente
  const pendingActions = SHARED_MOCK_ROUTES
    .filter(route => route.status === "draft" || route.status === "inactive")
    .map((route, index) => ({
      id: index + 1,
      type: "Percurso",
      message: route.status === "draft" ? "Rascunho de percurso precisa de publicação" : "Percurso inativo precisa de revisão",
      route: route.title,
    }));

  // Dados para os gráficos estáticos (Podes mantê-los assim enquanto não tens histórico de datas)
  const activeUsersData = [
    { month: "Jan", users: 1420 },
    { month: "Feb", users: 1680 },
    { month: "Mar", users: 1950 },
    { month: "Apr", users: 2100 },
    { month: "May", users: 2340 },
    { month: "Jun", users: 2520 },
    { month: "Jul", users: 2680 },
    { month: "Aug", users: 2847 },
  ];

  const mostAccessedRoutes = [
    { name: "Caminho Português", accesses: 4567 },
    { name: "Rota Vicentina", accesses: 3892 },
    { name: "Via Algarviana", accesses: 3245 },
    { name: "Serra da Estrela", accesses: 2876 },
    { name: "Gerês Trail", accesses: 2543 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Bem-vindo! Aqui está o que está a acontecer com o CTM.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Utilizadores Ativos</CardTitle>
            <CardDescription>Tendência mensal de utilizadores ativos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activeUsersData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }} />
                <Line type="monotone" dataKey="users" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ fill: "hsl(var(--chart-1))", r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Percursos Mais Acedidos</CardTitle>
            <CardDescription>Top 5 percursos por número de acessos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mostAccessedRoutes} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis type="number" className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <YAxis type="category" dataKey="name" width={120} className="text-xs" tick={{ fill: "hsl(var(--muted-foreground))" }} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "var(--radius)" }} />
                <Bar dataKey="accesses" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Taxa de Conversão (GRÁTIS → PREMIUM)</CardTitle>
          <CardDescription>Funil dinâmico de conversão baseado no total de utilizadores</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {conversionData.map((stage, index) => (
              <div key={stage.stage} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">{stage.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{stage.value.toLocaleString()} utilizadores</span>
                    <Badge variant="secondary">{stage.percentage}%</Badge>
                  </div>
                </div>
                <div className="relative h-12 bg-muted rounded-lg overflow-hidden">
                  <div
                    className="absolute inset-y-0 left-0 flex items-center justify-center font-semibold text-sm transition-all"
                    style={{
                      width: `${stage.percentage}%`,
                      backgroundColor: `hsl(var(--chart-${(index % 4) + 1}))`,
                      color: "hsl(var(--primary-foreground))",
                    }}
                  >
                    {stage.percentage >= 15 && `${stage.percentage}%`}
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Taxa de Conversão Global</span>
                <Badge variant="default" className="text-base">
                  {globalConversionRate}%
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 mt-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-warning" />
              Ações Pendentes
            </CardTitle>
            <CardDescription>Itens que requerem a tua atenção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingActions.length > 0 ? pendingActions.map((action) => (
                <div key={action.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary">{action.type}</Badge>
                      <span className="text-sm font-medium">{action.route}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{action.message}</p>
                  </div>
                </div>
              )) : (
                <p className="text-sm text-muted-foreground">Não há ações pendentes.</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Route className="w-5 h-5 text-primary" />
              Percursos Recentes
            </CardTitle>
            <CardDescription>Atividade recente dos percursos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentRoutes.map((route) => (
                <div key={route.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{route.name}</span>
                      <Badge variant={route.status === "ativo" ? "default" : "secondary"}>
                        {route.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {route.localities} localidades • {route.distance}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 