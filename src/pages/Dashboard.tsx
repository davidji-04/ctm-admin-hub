import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Route, Users, Star, TrendingUp, MapPin, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const Dashboard = () => {
  const stats = [
    {
      title: "Total Routes",
      value: "47",
      change: "+3 this month",
      icon: Route,
      color: "text-primary",
    },
    {
      title: "Active Users",
      value: "1,234",
      change: "+12% vs last month",
      icon: Users,
      color: "text-info",
    },
    {
      title: "Average Rating",
      value: "4.8",
      change: "+0.2 improvement",
      icon: Star,
      color: "text-warning",
    },
    {
      title: "Premium Itineraries",
      value: "23",
      change: "+5 this month",
      icon: TrendingUp,
      color: "text-success",
    },
  ];

  const pendingActions = [
    { id: 1, type: "Review", message: "New review pending approval", route: "Caminho Português" },
    { id: 2, type: "Route", message: "Draft route needs publishing", route: "Via Algarviana" },
    { id: 3, type: "Alert", message: "Weather alert triggered", route: "Rota Vicentina" },
  ];

  const recentRoutes = [
    { id: 1, name: "Caminho Português", status: "active", localities: 12, distance: "245 km" },
    { id: 2, name: "Via Algarviana", status: "draft", localities: 8, distance: "187 km" },
    { id: 3, name: "Rota Vicentina", status: "active", localities: 15, distance: "320 km" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening with CTM.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
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

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-warning" />
              Pending Actions
            </CardTitle>
            <CardDescription>Items requiring your attention</CardDescription>
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
              Recent Routes
            </CardTitle>
            <CardDescription>Latest route activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentRoutes.map((route) => (
                <div key={route.id} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm font-medium">{route.name}</span>
                      <Badge variant={route.status === "active" ? "default" : "secondary"}>
                        {route.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {route.localities} localities • {route.distance}
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
