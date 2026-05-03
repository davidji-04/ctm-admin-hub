import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Route,
  MapPin,
  Briefcase,
  CalendarDays,
  Package,
  GraduationCap,
  CloudRain,
  Users,
  Star,
  Image,
  FileText,
  Leaf,
  BookOpen,
  Layers
} from "lucide-react";

const navigationItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Percursos", href: "/routes", icon: Route },
  { name: "Localidades", href: "/localities", icon: MapPin },
  { name: "Serviços", href: "/services", icon: Briefcase },
  { name: "Roteiros", href: "/itineraries", icon: CalendarDays },
  { name: "Equipamentos", href: "/equipment", icon: Package },
  { name: "Planos de Treino", href: "/training", icon: GraduationCap },
  { name: "Alertas Meteo", href: "/weather", icon: CloudRain },
  { name: "Utilizadores", href: "/users", icon: Users },
  { name: "Avaliações", href: "/reviews", icon: Star },
  { name: "Imagens", href: "/images", icon: Image },
  { name: "Relatórios", href: "/reports", icon: FileText },
  { name: "Blog", href: "/blog", icon: BookOpen },
  { name: "Páginas Modulares", href: "/modular-pages", icon: Layers },

];

const Sidebar = () => {  
  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-6 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sidebar-primary flex items-center justify-center">
            <Leaf className="w-6 h-6 text-sidebar-primary-foreground" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-sidebar-foreground">CTM Admin</h1>
            <p className="text-xs text-sidebar-foreground/70">Painel de Gestão</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navigationItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-sidebar-accent text-sidebar-accent-foreground"
                  : "text-sidebar-foreground/80 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.name}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-sidebar-foreground/60">
          <p>© 2024 CTM</p>
          <p>Versão 1.0.0</p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
