import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { LayoutDashboard, Route, Users } from "lucide-react";
import { DashboardTab } from "@/components/analytics/DashboardTab";
import { RoutesPerformanceTab } from "@/components/analytics/RoutesPerformanceTab";
import { UsersAnalysisTab } from "@/components/analytics/UsersAnalysisTab";

const AnalyticsDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, [activeTab]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Relatórios e Métricas</h1>
        <p className="text-muted-foreground mt-1">
          Análise completa do desempenho da plataforma
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <LayoutDashboard className="h-4 w-4" />
            <span className="hidden sm:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="routes" className="flex items-center gap-2">
            <Route className="h-4 w-4" />
            <span className="hidden sm:inline">Percursos</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Utilizadores</span>
          </TabsTrigger>
        </TabsList>

        {loading ? (
          <LoadingSkeleton />
        ) : (
          <>
            <TabsContent value="dashboard" className="space-y-6">
              <DashboardTab />
            </TabsContent>
            <TabsContent value="routes" className="space-y-6">
              <RoutesPerformanceTab />
            </TabsContent>
            <TabsContent value="users" className="space-y-6">
              <UsersAnalysisTab />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="space-y-6">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-32 rounded-xl" />
      ))}
    </div>
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Skeleton className="h-80 rounded-xl" />
      <Skeleton className="h-80 rounded-xl" />
    </div>
    <Skeleton className="h-64 rounded-xl" />
  </div>
);

export default AnalyticsDashboard;
