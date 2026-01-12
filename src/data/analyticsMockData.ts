// Mock data for Analytics Dashboard

// KPI Data
export const kpiData = {
  totalUsers: 12450,
  totalUsersTrend: 8.5,
  premiumUsers: 850,
  premiumUsersTrend: 12.3,
  activeRoutes: 42,
  activeRoutesTrend: 5.2,
  averageRating: 4.8,
  averageRatingTrend: 2.1,
};

// Active Users - Last 30 days
export const activeUsersData = [
  { day: "01 Dez", users: 1200 },
  { day: "02 Dez", users: 1350 },
  { day: "03 Dez", users: 1180 },
  { day: "04 Dez", users: 1420 },
  { day: "05 Dez", users: 1580 },
  { day: "06 Dez", users: 1750 },
  { day: "07 Dez", users: 1620 },
  { day: "08 Dez", users: 1480 },
  { day: "09 Dez", users: 1320 },
  { day: "10 Dez", users: 1550 },
  { day: "11 Dez", users: 1680 },
  { day: "12 Dez", users: 1820 },
  { day: "13 Dez", users: 1950 },
  { day: "14 Dez", users: 2100 },
  { day: "15 Dez", users: 1890 },
  { day: "16 Dez", users: 1760 },
  { day: "17 Dez", users: 1640 },
  { day: "18 Dez", users: 1580 },
  { day: "19 Dez", users: 1720 },
  { day: "20 Dez", users: 1850 },
  { day: "21 Dez", users: 2050 },
  { day: "22 Dez", users: 2200 },
  { day: "23 Dez", users: 2380 },
  { day: "24 Dez", users: 2150 },
  { day: "25 Dez", users: 1980 },
  { day: "26 Dez", users: 2100 },
  { day: "27 Dez", users: 2250 },
  { day: "28 Dez", users: 2400 },
  { day: "29 Dez", users: 2580 },
  { day: "30 Dez", users: 2720 },
];

// Top 5 Routes
export const topRoutesData = [
  { name: "Caminho Português", accesses: 4520 },
  { name: "Caminho Francês", accesses: 3890 },
  { name: "Via de la Plata", accesses: 2340 },
  { name: "Caminho do Norte", accesses: 1980 },
  { name: "Caminho Primitivo", accesses: 1650 },
];

// Conversion Funnel Data
export const conversionFunnelData = [
  { stage: "Visitantes", value: 12450, fill: "hsl(var(--primary))" },
  { stage: "Registos", value: 8200, fill: "hsl(var(--primary) / 0.8)" },
  { stage: "Ativos", value: 5800, fill: "hsl(var(--primary) / 0.6)" },
  { stage: "Trial Premium", value: 1200, fill: "hsl(var(--primary) / 0.4)" },
  { stage: "Premium", value: 850, fill: "hsl(var(--accent))" },
];

// Alerts Panel Data
export const alertsData = [
  { id: 1, type: "review", message: "3 Reviews por aprovar", priority: "medium", link: "/reviews" },
  { id: 2, type: "weather", message: "Alerta Meteorológico: Caminho Francês", priority: "high", link: "/weather" },
  { id: 3, type: "user", message: "5 Novos registos hoje", priority: "low", link: "/users" },
  { id: 4, type: "route", message: "Percurso pendente de publicação", priority: "medium", link: "/routes" },
  { id: 5, type: "equipment", message: "2 Equipamentos sem imagem", priority: "low", link: "/equipment" },
];

// Routes Performance Data
export interface RoutePerformance {
  id: string;
  name: string;
  category: "free" | "premium";
  difficulty: "easy" | "medium" | "hard";
  region: string;
  totalAccesses: number;
  itinerariesCreated: number;
  completionRate: number;
  rating: number;
}

export const routesPerformanceData: RoutePerformance[] = [
  { id: "1", name: "Caminho Português", category: "free", difficulty: "medium", region: "Portugal", totalAccesses: 4520, itinerariesCreated: 1250, completionRate: 78, rating: 4.8 },
  { id: "2", name: "Caminho Francês", category: "premium", difficulty: "medium", region: "Espanha", totalAccesses: 3890, itinerariesCreated: 980, completionRate: 82, rating: 4.9 },
  { id: "3", name: "Via de la Plata", category: "premium", difficulty: "hard", region: "Espanha", totalAccesses: 2340, itinerariesCreated: 540, completionRate: 65, rating: 4.6 },
  { id: "4", name: "Caminho do Norte", category: "free", difficulty: "hard", region: "Espanha", totalAccesses: 1980, itinerariesCreated: 420, completionRate: 58, rating: 4.5 },
  { id: "5", name: "Caminho Primitivo", category: "premium", difficulty: "hard", region: "Espanha", totalAccesses: 1650, itinerariesCreated: 380, completionRate: 62, rating: 4.7 },
  { id: "6", name: "Caminho Inglês", category: "free", difficulty: "easy", region: "Espanha", totalAccesses: 1420, itinerariesCreated: 650, completionRate: 92, rating: 4.4 },
  { id: "7", name: "Caminho de Fisterra", category: "free", difficulty: "easy", region: "Espanha", totalAccesses: 1280, itinerariesCreated: 580, completionRate: 88, rating: 4.3 },
  { id: "8", name: "Caminho de Inverno", category: "premium", difficulty: "medium", region: "Espanha", totalAccesses: 980, itinerariesCreated: 220, completionRate: 71, rating: 4.5 },
  { id: "9", name: "Caminho Sanabrês", category: "free", difficulty: "medium", region: "Espanha", totalAccesses: 850, itinerariesCreated: 180, completionRate: 69, rating: 4.2 },
  { id: "10", name: "Rota Vicentina", category: "premium", difficulty: "medium", region: "Portugal", totalAccesses: 2150, itinerariesCreated: 620, completionRate: 75, rating: 4.8 },
  { id: "11", name: "Trilho dos Pescadores", category: "free", difficulty: "hard", region: "Portugal", totalAccesses: 1890, itinerariesCreated: 410, completionRate: 55, rating: 4.6 },
  { id: "12", name: "GR11 - Pirenéus", category: "premium", difficulty: "hard", region: "França", totalAccesses: 1120, itinerariesCreated: 180, completionRate: 42, rating: 4.7 },
];

// Users Data
export interface UserAnalytics {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  status: "active" | "premium" | "free" | "inactive";
  registrationDate: string;
  lastAccess: string;
  totalKm: number;
}

export const usersAnalyticsData: UserAnalytics[] = [
  { id: "1", name: "João Silva", email: "joao.silva@email.com", status: "premium", registrationDate: "2024-01-15", lastAccess: "2025-01-11", totalKm: 1250 },
  { id: "2", name: "Maria Santos", email: "maria.santos@email.com", status: "premium", registrationDate: "2023-08-22", lastAccess: "2025-01-12", totalKm: 2340 },
  { id: "3", name: "Pedro Costa", email: "pedro.costa@email.com", status: "free", registrationDate: "2024-06-10", lastAccess: "2025-01-10", totalKm: 420 },
  { id: "4", name: "Ana Ferreira", email: "ana.ferreira@email.com", status: "active", registrationDate: "2024-09-05", lastAccess: "2025-01-12", totalKm: 680 },
  { id: "5", name: "Carlos Oliveira", email: "carlos.oliveira@email.com", status: "inactive", registrationDate: "2023-05-18", lastAccess: "2024-08-15", totalKm: 890 },
  { id: "6", name: "Sofia Rodrigues", email: "sofia.rodrigues@email.com", status: "premium", registrationDate: "2023-11-30", lastAccess: "2025-01-11", totalKm: 3120 },
  { id: "7", name: "Miguel Almeida", email: "miguel.almeida@email.com", status: "free", registrationDate: "2024-03-25", lastAccess: "2025-01-08", totalKm: 180 },
  { id: "8", name: "Inês Martins", email: "ines.martins@email.com", status: "active", registrationDate: "2024-07-12", lastAccess: "2025-01-12", totalKm: 520 },
  { id: "9", name: "Ricardo Pereira", email: "ricardo.pereira@email.com", status: "inactive", registrationDate: "2023-02-08", lastAccess: "2024-06-20", totalKm: 1450 },
  { id: "10", name: "Beatriz Lopes", email: "beatriz.lopes@email.com", status: "premium", registrationDate: "2024-04-18", lastAccess: "2025-01-12", totalKm: 980 },
  { id: "11", name: "André Fernandes", email: "andre.fernandes@email.com", status: "free", registrationDate: "2024-10-02", lastAccess: "2025-01-09", totalKm: 120 },
  { id: "12", name: "Catarina Sousa", email: "catarina.sousa@email.com", status: "active", registrationDate: "2024-08-28", lastAccess: "2025-01-11", totalKm: 340 },
  { id: "13", name: "Tiago Gonçalves", email: "tiago.goncalves@email.com", status: "premium", registrationDate: "2023-06-14", lastAccess: "2025-01-12", totalKm: 4560 },
  { id: "14", name: "Mariana Carvalho", email: "mariana.carvalho@email.com", status: "inactive", registrationDate: "2023-09-22", lastAccess: "2024-11-05", totalKm: 760 },
  { id: "15", name: "Hugo Ribeiro", email: "hugo.ribeiro@email.com", status: "free", registrationDate: "2024-11-15", lastAccess: "2025-01-07", totalKm: 85 },
  { id: "16", name: "Francisca Neves", email: "francisca.neves@email.com", status: "active", registrationDate: "2024-05-20", lastAccess: "2025-01-12", totalKm: 890 },
  { id: "17", name: "Diogo Mendes", email: "diogo.mendes@email.com", status: "premium", registrationDate: "2023-12-10", lastAccess: "2025-01-10", totalKm: 2180 },
  { id: "18", name: "Laura Pinto", email: "laura.pinto@email.com", status: "free", registrationDate: "2024-02-28", lastAccess: "2025-01-06", totalKm: 290 },
];

// Difficulty and Region options for filters
export const difficultyOptions = [
  { value: "all", label: "Todas" },
  { value: "easy", label: "Fácil" },
  { value: "medium", label: "Média" },
  { value: "hard", label: "Difícil" },
];

export const regionOptions = [
  { value: "all", label: "Todas" },
  { value: "Portugal", label: "Portugal" },
  { value: "Espanha", label: "Espanha" },
  { value: "França", label: "França" },
];

export const userStatusOptions = [
  { value: "all", label: "Todos" },
  { value: "premium", label: "Premium" },
  { value: "free", label: "Free" },
  { value: "active", label: "Ativos" },
  { value: "inactive", label: "Inativos" },
];
