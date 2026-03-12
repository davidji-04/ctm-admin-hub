import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Leaf } from "lucide-react";
import { authService } from "@/components/services/authService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Development shortcut: always allow login and seed a mock session.
    if (import.meta.env.DEV) {
      const devUser = {
        email: email || "dev@ctm.com",
        role: "admin",
        name: "Dev User",
        id: "dev-user"
      };

      localStorage.setItem("token", "dev-token");
      localStorage.setItem("ctm_user", JSON.stringify(devUser));

      toast({
        title: "Login de desenvolvimento",
        description: `Acesso concedido${devUser.email ? ` para ${devUser.email}` : ""}.`,
      });

      navigate("/dashboard");
      setIsLoading(false);
      return;
    }

    try {
      const loginResponse = await authService.login({ 
        identitier: email, 
        password: password 
      });

      const token = loginResponse?.token || loginResponse; 
      localStorage.setItem("token", token);

      let user = null;
      try {
        user = await authService.getCurrentUser();
        
        localStorage.setItem("ctm_user", JSON.stringify({
          email: user.email,
          role: user.role || "admin",
          name: user.userName,
          id: user.id
        }));
      } catch (userError) {
        console.warn("Could not fetch user details immediately", userError);
      }

      toast({
        title: "Login bem-sucedido",
        description: `Bem-vindo de volta${user ? ", " + user.userName : ""}!`,
      });

      navigate("/dashboard");

    } catch (error: any) {
      console.error("Login Error:", error);
      
      const errorMessage = error.response?.data?.message || "Verifique as suas credenciais e tente novamente.";
      
      toast({
        title: "Erro ao entrar",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary flex items-center justify-center">
            <Leaf className="w-8 h-8 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-bold">Painel de Administração CTM</CardTitle>
          <CardDescription>
            Cheiro de Terra Molhada - Sistema Administrativo
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@ctm.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Palavra-passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? "A entrar..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;