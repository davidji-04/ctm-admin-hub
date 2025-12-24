import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Search, User, LogOut, Menu } from "lucide-react";
import GlobalSearch from "@/components/GlobalSearch";
import { NotificationCenter } from "@/components/NotificationCenter";

interface HeaderProps {
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("ctm_user");
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("ctm_user");
    navigate("/login");
  };

  return (
      <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between">
        {/* ESQUERDA: botão sidebar + pesquisa */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          {/* BOTÃO PARA ABRIR/FECHAR SIDEBAR */}
          <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
              aria-label="Toggle sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* BOTÃO DE PESQUISA */}
          <Button
              variant="outline"
              className="w-full justify-start text-muted-foreground"
              onClick={() => setSearchOpen(true)}
          >
            <Search className="mr-2 h-4 w-4" />
            Pesquisar percursos, localidades, utilizadores...
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>

        <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />

        {/* DIREITA: notificações + utilizador */}
        <div className="flex items-center gap-4">
          <NotificationCenter />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium">{user?.name || "User"}</p>
                  <Badge variant="secondary" className="text-xs">
                    {user?.role || "editor"}
                  </Badge>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => navigate("/profile")}>
                Perfil
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                <LogOut className="w-4 h-4 mr-2" />
                Terminar Sessão
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
  );
};

export default Header;
