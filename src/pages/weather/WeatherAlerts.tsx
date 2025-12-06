import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Settings, History, MapPin } from 'lucide-react';
import { AlertRulesList } from '@/components/weather/AlertRulesList';
import { AlertsHistory } from '@/components/weather/AlertsHistory';
import { WeatherMap } from '@/components/weather/WeatherMap';
import { AlertRuleModal } from '@/components/weather/AlertRuleModal';
import { mockAlertRules, mockWeatherAlerts } from '@/data/weatherMocks';
import { AlertRule, WeatherAlert } from '@/types/weather';

export default function WeatherAlerts() {
  const [activeTab, setActiveTab] = useState('rules');
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<AlertRule | null>(null);
  const [rules, setRules] = useState<AlertRule[]>(mockAlertRules);
  const [alerts, setAlerts] = useState<WeatherAlert[]>(mockWeatherAlerts);

  const handleCreateRule = () => {
    setSelectedRule(null);
    setIsRuleModalOpen(true);
  };

  const handleEditRule = (rule: AlertRule) => {
    setSelectedRule(rule);
    setIsRuleModalOpen(true);
  };

  const handleSaveRule = (ruleData: Omit<AlertRule, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedRule) {
      // Update existing rule
      setRules(prev => prev.map(r => 
        r.id === selectedRule.id 
          ? { ...r, ...ruleData, updatedAt: new Date() }
          : r
      ));
    } else {
      // Create new rule
      const newRule: AlertRule = {
        ...ruleData,
        id: `rule-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setRules(prev => [...prev, newRule]);
    }
    setIsRuleModalOpen(false);
  };

  const handleDeleteRule = (ruleId: string) => {
    setRules(prev => prev.filter(r => r.id !== ruleId));
  };

  const handleToggleRule = (ruleId: string) => {
    setRules(prev => prev.map(r => 
      r.id === ruleId ? { ...r, isActive: !r.isActive, updatedAt: new Date() } : r
    ));
  };

  const handleDismissAlert = (alertId: string) => {
    setAlerts(prev => prev.map(a => 
      a.id === alertId 
        ? { ...a, status: 'dismissed', dismissedBy: 'admin@ctm.pt', dismissedAt: new Date() }
        : a
    ));
  };

  const activeAlerts = alerts.filter(a => a.status === 'active');
  const activeRules = rules.filter(r => r.isActive);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Alertas Meteorológicos</h1>
          <p className="text-muted-foreground mt-1">
            Configure regras de alerta e monitore condições meteorológicas nos percursos
          </p>
        </div>
        <Button onClick={handleCreateRule} className="gap-2">
          <Plus className="h-4 w-4" />
          Nova Regra de Alerta
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Alertas Ativos</CardDescription>
            <CardTitle className="text-2xl text-destructive">{activeAlerts.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Regras Ativas</CardDescription>
            <CardTitle className="text-2xl text-primary">{activeRules.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total de Regras</CardDescription>
            <CardTitle className="text-2xl">{rules.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Alertas (24h)</CardDescription>
            <CardTitle className="text-2xl">
              {alerts.filter(a => 
                new Date().getTime() - a.triggeredAt.getTime() < 24 * 60 * 60 * 1000
              ).length}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
          <TabsTrigger value="rules" className="gap-2">
            <Settings className="h-4 w-4" />
            Regras de Alerta
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <History className="h-4 w-4" />
            Histórico
          </TabsTrigger>
          <TabsTrigger value="map" className="gap-2">
            <MapPin className="h-4 w-4" />
            Mapa
          </TabsTrigger>
        </TabsList>

        <TabsContent value="rules" className="space-y-4">
          <AlertRulesList
            rules={rules}
            onEdit={handleEditRule}
            onDelete={handleDeleteRule}
            onToggle={handleToggleRule}
          />
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <AlertsHistory
            alerts={alerts}
            rules={rules}
            onDismiss={handleDismissAlert}
          />
        </TabsContent>

        <TabsContent value="map" className="space-y-4">
          <WeatherMap
            alerts={activeAlerts}
            rules={rules}
          />
        </TabsContent>
      </Tabs>

      {/* Rule Modal */}
      <AlertRuleModal
        open={isRuleModalOpen}
        onOpenChange={setIsRuleModalOpen}
        rule={selectedRule}
        onSave={handleSaveRule}
      />
    </div>
  );
}
