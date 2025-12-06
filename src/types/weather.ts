export type AlertPriority = 'critical' | 'important' | 'attention' | 'informative';

export type WeatherCondition = 
  | 'heavy_rain'
  | 'strong_wind'
  | 'low_temperature'
  | 'high_temperature'
  | 'snow'
  | 'fog'
  | 'thunderstorm';

export interface WeatherConditionConfig {
  id: WeatherCondition;
  label: string;
  description: string;
  unit: string;
  icon: string;
}

export const WEATHER_CONDITIONS: WeatherConditionConfig[] = [
  { id: 'heavy_rain', label: 'Chuva Forte', description: '> 10mm/h', unit: 'mm/h', icon: 'cloud-rain' },
  { id: 'strong_wind', label: 'Vento Forte', description: '> 40km/h', unit: 'km/h', icon: 'wind' },
  { id: 'low_temperature', label: 'Temperatura Baixa', description: '< 0°C', unit: '°C', icon: 'thermometer-snowflake' },
  { id: 'high_temperature', label: 'Temperatura Alta', description: '> 35°C', unit: '°C', icon: 'thermometer-sun' },
  { id: 'snow', label: 'Queda de Neve', description: 'Previsão de neve', unit: '', icon: 'snowflake' },
  { id: 'fog', label: 'Nevoeiro', description: 'Visibilidade < 200m', unit: 'm', icon: 'cloud-fog' },
  { id: 'thunderstorm', label: 'Trovoada', description: 'Atividade elétrica', unit: '', icon: 'cloud-lightning' },
];

export interface AlertRule {
  id: string;
  name: string;
  priority: AlertPriority;
  conditions: WeatherCondition[];
  routeIds: string[];
  localityIds: string[];
  timeWindowStart: string; // HH:mm format
  timeWindowEnd: string;
  messageTemplate: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeatherAlert {
  id: string;
  ruleId: string;
  ruleName: string;
  priority: AlertPriority;
  routeId: string;
  routeName: string;
  localityId: string;
  localityName: string;
  condition: WeatherCondition;
  conditionValue: string;
  message: string;
  triggeredAt: Date;
  status: 'active' | 'dismissed' | 'expired';
  dismissedBy?: string;
  dismissedAt?: Date;
  latitude: number;
  longitude: number;
}

export interface MockRoute {
  id: string;
  name: string;
  category: 'premium' | 'standard';
  region: string;
}

export interface MockLocality {
  id: string;
  routeId: string;
  name: string;
  latitude: number;
  longitude: number;
}
