import { useState } from "react";
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
  Globe,
  Menu,
  Layers,
  Box,
  ChevronDown, 
  ChevronRight
} from "lucide-react";

const navigationItems = [
  { name: "Backoffice", href: "#", icon: FileText, isExpanded: true,
    subItems: [
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
      { name: "Images", href: "/images", icon: Image },
      { name: "Relatórios", href: "/reports", icon: FileText },
    ],
   },
  { name: "Cms", href: "#", icon: FileText, isExpanded: true,
     subItems: [
      { name: "Dashboard", href: "/cms/dashboard", icon: LayoutDashboard },
      { name: "Universos", href: "/cms/universes", icon: Globe },
      { name: "Pages", href: "/cms/pages", icon: FileText },
      { name: "Mídia", href: "/cms/images", icon: Image },
      { name: "Menus", href: "/cms/menus", icon: Menu },
      { name: "Templates", href: "/cms/templates", icon: Layers },
      { name: "Componentes", href: "/cms/components", icon: Box },
      { name: "Auditoria", href: "/cms/auditoria", icon: FileText },
     ],
   },
];

const Sidebar = () => {
  const [openMenus, setOpenMenus] = useState(new Set());
  const toggleMenu = (menuName) => {
    setOpenMenus((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(menuName)) {
        newSet.delete(menuName);
      } else {
        newSet.add(menuName);   
      }
      return newSet;
    });
  };
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
        {navigationItems.map((item) => {
          if (item.subItems) {
            const isOpen = openMenus.has(item.name);
            return (
              <div key={item.name} className="flex flex-col">
                <button
                  onClick={() => toggleMenu(item.name)}
                  className="flex items-center justify-between w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-sidebar-foreground/80 hover:bg-sidebar-accent/50"
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-5 h-5" />
                    {item.name}
                  </div>
                  {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>

                {isOpen && (
                  <div className="mt-1 ml-6 space-y-1 border-l border-sidebar-border pl-2">
                    {item.subItems.map((sub) => (
                      <NavLink
                        key={sub.name}
                        to={sub.href}
                        className={({ isActive }) =>
                          cn(
                            "flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                            isActive
                              ? "bg-sidebar-accent text-sidebar-accent-foreground font-bold"
                              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/30 hover:text-sidebar-foreground"
                          )
                        }
                      >
                        <sub.icon className="w-4 h-4" />
                        {sub.name}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }
          return(
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
          );
        })}
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
