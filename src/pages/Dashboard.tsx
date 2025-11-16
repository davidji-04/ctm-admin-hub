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
  Cell,
} from "recharts";

const Dashboard = () => {
  const stats = [
    {
      title: "Total de Percursos",
      value: "47",
      change: "+3 este mês",
      icon: Route,
      color: "text-primary",
    },
    {
      title: "Total de Utilizadores",
      value: "2,847",
      change: "+156 este mês",
      icon: UserCheck,
      color: "text-info",
    },
    {
      title: "Utilizadores Premium",
      value: "384",
      change: "+42 este mês",
      icon: Crown,
      color: "text-warning",
    },
    {
      title: "Avaliação Média",
      value: "4.8",
      change: "+0.2 melhoria",
      icon: Star,
      color: "text-success",
    },
    {
      title: "Roteiros Premium",
      value: "23",
      change: "+5 este mês",
      icon: TrendingUp,
      color: "text-accent",
    },
  ];

  // Mock data for Active Users line chart
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

  // Mock data for Most Accessed Routes bar chart
  const mostAccessedRoutes = [
    { name: "Caminho Português", accesses: 4567 },
    { name: "Rota Vicentina", accesses: 3892 },
    { name: "Via Algarviana", accesses: 3245 },
    { name: "Serra da Estrela", accesses: 2876 },
    { name: "Gerês Trail", accesses: 2543 },
  ];

  // Mock data for Conversion Rate funnel
  const conversionData = [
    { stage: "Inscrições Grátis", value: 2463, percentage: 100 },
    { stage: "Utilizadores Ativos", value: 1847, percentage: 75 },
    { stage: "Período Experimental", value: 923, percentage: 37 },
    { stage: "Conversão Premium", value: 384, percentage: 16 },
  ];

  const pendingActions = [
    { id: 1, type: "Avaliação", message: "Nova avaliação pendente de aprovação", route: "Caminho Português" },
    { id: 2, type: "Percurso", message: "Rascunho de percurso precisa de publicação", route: "Via Algarviana" },
    { id: 3, type: "Alerta", message: "Alerta meteorológico acionado", route: "Rota Vicentina" },
  ];

  const recentRoutes = [
    { id: 1, name: "Caminho Português", status: "ativo", localities: 12, distance: "245 km" },
    { id: 2, name: "Via Algarviana", status: "rascunho", localities: 8, distance: "187 km" },
    { id: 3, name: "Rota Vicentina", status: "ativo", localities: 15, distance: "320 km" },
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
              <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Visualizações de Dados - Gráficos */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Active Users Line Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Utilizadores Ativos</CardTitle>
            <CardDescription>Tendência mensal de utilizadores ativos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={activeUsersData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="month" 
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="users" 
                  stroke="hsl(var(--chart-1))" 
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--chart-1))", r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Gráfico de Barras dos Percursos Mais Acedidos */}
        <Card>
          <CardHeader>
            <CardTitle>Percursos Mais Acedidos</CardTitle>
            <CardDescription>Top 5 percursos por número de acessos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mostAccessedRoutes} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  type="number"
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={120}
                  className="text-xs"
                  tick={{ fill: "hsl(var(--muted-foreground))" }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "var(--radius)",
                  }}
                />
                <Bar dataKey="accesses" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Conversion Rate Funnel */}
      <Card>
        <CardHeader>
          <CardTitle>Taxa de Conversão (GRÁTIS → PREMIUM)</CardTitle>
          <CardDescription>Funil de conversão de utilizadores de inscrição a premium</CardDescription>
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
                    {stage.percentage >= 20 && `${stage.percentage}%`}
                  </div>
                </div>
              </div>
            ))}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Taxa de Conversão Global</span>
                <Badge variant="default" className="text-base">
                  {((conversionData[3].value / conversionData[0].value) * 100).toFixed(1)}%
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-warning" />
              Ações Pendentes
            </CardTitle>
            <CardDescription>Itens que requerem sua atenção</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingActions.map((action) => (
                <div key={action.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary">{action.type}</Badge>
                      <span className="text-sm font-medium">{action.route}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{action.message}</p>
                  </div>
                </div>
              ))}
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
