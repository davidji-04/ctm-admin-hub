import React, { useEffect, useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

const MainLayout: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Verificação de login
  useEffect(() => {
    const user = localStorage.getItem("ctm_user");
    if (!user) {
      navigate("/login");
    }
  }, [navigate]);

  // Função para alternar o sidebar
  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  return (
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar controlável */}
        <Sidebar isOpen={sidebarOpen} />

        {/* Conteúdo principal */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header recebe função para abrir/fechar sidebar */}
          <Header toggleSidebar={toggleSidebar} />

          {/* Área de conteúdo */}
          <main className="flex-1 overflow-y-auto bg-background p-6">
            <Outlet />
          </main>
        </div>
      </div>
  );
};

export default MainLayout;
