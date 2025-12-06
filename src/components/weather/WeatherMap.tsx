import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { AlertCircle, AlertTriangle, Info, Zap, Layers, MapPin } from 'lucide-react';
import { AlertRule, WeatherAlert, AlertPriority } from '@/types/weather';
import { mockLocalities, mockRoutes } from '@/data/weatherMocks';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface WeatherMapProps {
  alerts: WeatherAlert[];
  rules: AlertRule[];
}

const priorityConfig: Record<AlertPriority, { label: string; color: string; icon: React.ReactNode }> = {
  critical: { label: 'Crítica', color: '#ef4444', icon: <AlertCircle className="h-4 w-4" /> },
  important: { label: 'Importante', color: '#f97316', icon: <Zap className="h-4 w-4" /> },
  attention: { label: 'Atenção', color: '#eab308', icon: <AlertTriangle className="h-4 w-4" /> },
  informative: { label: 'Informativa', color: '#3b82f6', icon: <Info className="h-4 w-4" /> },
};

// Create custom marker icons
const createMarkerIcon = (color: string, isAlert: boolean) => {
  const size = isAlert ? 32 : 24;
  const svgIcon = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" width="${size}" height="${size}">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `;
  return L.divIcon({
    html: svgIcon,
    className: 'custom-marker',
    iconSize: [size, size],
    iconAnchor: [size / 2, size],
    popupAnchor: [0, -size],
  });
};

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 7);
  }, [center, map]);
  return null;
}

export function WeatherMap({ alerts, rules }: WeatherMapProps) {
  const [showAlerts, setShowAlerts] = useState(true);
  const [showRuleLocalities, setShowRuleLocalities] = useState(true);
  const [selectedRuleId, setSelectedRuleId] = useState<string | null>(null);

  // Get localities covered by active rules
  const ruleLocalities = rules
    .filter(r => r.isActive && (selectedRuleId === null || r.id === selectedRuleId))
    .flatMap(rule => {
      if (rule.localityIds.length > 0) {
        return mockLocalities.filter(loc => rule.localityIds.includes(loc.id));
      }
      return mockLocalities.filter(loc => rule.routeIds.includes(loc.routeId));
    });

  // Deduplicate localities
  const uniqueRuleLocalities = Array.from(
    new Map(ruleLocalities.map(loc => [loc.id, loc])).values()
  );

  // Center of Portugal
  const mapCenter: [number, number] = [39.5, -8.0];

  return (
    <div className="grid gap-4 lg:grid-cols-4">
      {/* Map */}
      <Card className="lg:col-span-3">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Mapa de Alertas
          </CardTitle>
          <CardDescription>
            Visualização geográfica dos alertas ativos e localidades monitorizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[500px] rounded-lg overflow-hidden border">
            <MapContainer
              center={mapCenter}
              zoom={7}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapUpdater center={mapCenter} />

              {/* Alert Markers */}
              {showAlerts && alerts.map((alert) => (
                <Marker
                  key={alert.id}
                  position={[alert.latitude, alert.longitude]}
                  icon={createMarkerIcon(priorityConfig[alert.priority].color, true)}
                >
                  <Popup>
                    <div className="min-w-[200px]">
                      <div className="flex items-center gap-2 mb-2">
                        <span style={{ color: priorityConfig[alert.priority].color }}>
                          {priorityConfig[alert.priority].icon}
                        </span>
                        <strong>{alert.localityName}</strong>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{alert.routeName}</p>
                      <p className="text-sm mb-2">{alert.message}</p>
                      <Badge 
                        style={{ 
                          backgroundColor: priorityConfig[alert.priority].color,
                          color: 'white'
                        }}
                      >
                        {alert.conditionValue}
                      </Badge>
                    </div>
                  </Popup>
                </Marker>
              ))}

              {/* Rule Locality Markers */}
              {showRuleLocalities && uniqueRuleLocalities.map((locality) => {
                // Check if this locality has an active alert
                const hasAlert = alerts.some(a => a.localityId === locality.id);
                if (hasAlert && showAlerts) return null; // Don't show duplicate markers

                return (
                  <Marker
                    key={locality.id}
                    position={[locality.latitude, locality.longitude]}
                    icon={createMarkerIcon('hsl(150, 60%, 25%)', false)}
                  >
                    <Popup>
                      <div className="min-w-[150px]">
                        <strong>{locality.name}</strong>
                        <p className="text-sm text-gray-600">
                          {mockRoutes.find(r => r.id === locality.routeId)?.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          Monitorizado por regra ativa
                        </p>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </MapContainer>
          </div>
        </CardContent>
      </Card>

      {/* Legend & Controls */}
      <div className="space-y-4">
        {/* Layer Controls */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Camadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="show-alerts" className="text-sm">Alertas Ativos</Label>
              <Switch
                id="show-alerts"
                checked={showAlerts}
                onCheckedChange={setShowAlerts}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="show-localities" className="text-sm">Localidades Monitorizadas</Label>
              <Switch
                id="show-localities"
                checked={showRuleLocalities}
                onCheckedChange={setShowRuleLocalities}
              />
            </div>
          </CardContent>
        </Card>

        {/* Active Alerts Legend */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Alertas Ativos ({alerts.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {alerts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Sem alertas ativos</p>
            ) : (
              alerts.map((alert) => (
                <div 
                  key={alert.id}
                  className="flex items-start gap-2 p-2 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
                >
                  <span style={{ color: priorityConfig[alert.priority].color }} className="mt-0.5">
                    {priorityConfig[alert.priority].icon}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{alert.localityName}</p>
                    <p className="text-xs text-muted-foreground truncate">{alert.routeName}</p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Priority Legend */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Legenda de Prioridades</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {Object.entries(priorityConfig).map(([key, config]) => (
              <div key={key} className="flex items-center gap-2">
                <span style={{ color: config.color }}>
                  {config.icon}
                </span>
                <span className="text-sm">{config.label}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
