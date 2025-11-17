import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { toast } from "@/hooks/use-toast";
import { Shield, ShieldAlert, User, Mail, Lock, Loader2 } from "lucide-react";

// Schema de validação para mudança de senha
export const passwordChangeSchema = z.object({
  currentPassword: z.string().min(1, "A senha atual é obrigatória."),
  newPassword: z.string()
    .min(8, "A nova senha deve ter no mínimo 8 caracteres.")
    .regex(/[A-Za-z]/, "Deve conter pelo menos uma letra.")
    .regex(/[0-9]/, "Deve conter pelo menos um número."),
  confirmPassword: z.string()
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "As senhas não coincidem.",
  path: ["confirmPassword"],
});

export type PasswordChangeValues = z.infer<typeof passwordChangeSchema>;

// Mock do usuário logado
const mockCurrentUser = {
  name: "João Silva",
  email: "joao.silva@ctm.pt",
  role: "admin" as "admin" | "editor",
};

export default function MyProfile() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const form = useForm<PasswordChangeValues>({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onSubmitPassword = async (data: PasswordChangeValues) => {
    setIsSubmitting(true);
    
    // Simula chamada à API
    await new Promise((resolve) => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    form.reset();
    
    toast({
      title: "Sucesso",
      description: "Senha atualizada com sucesso.",
    });
  };

  const handleToggle2FA = async (enabled: boolean) => {
    // Simula chamada à API
    await new Promise((resolve) => setTimeout(resolve, 500));
    
    setTwoFactorEnabled(enabled);
    
    toast({
      title: enabled ? "2FA Ativado" : "2FA Desativado",
      description: enabled 
        ? "Autenticação de dois fatores foi ativada com sucesso."
        : "Autenticação de dois fatores foi desativada.",
    });
  };

  const getRoleBadge = (role: "admin" | "editor") => {
    if (role === "admin") {
      return (
        <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
          Admin
        </Badge>
      );
    }
    return (
      <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
        Editor
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">O Meu Perfil</h1>
          <p className="text-muted-foreground mt-1">
            Gerencie as suas informações pessoais e configurações de segurança
          </p>
        </div>

        {/* Informações do Utilizador */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
            <CardDescription>
              As suas informações de conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <Label className="text-sm text-muted-foreground">Nome</Label>
                <p className="text-base font-medium text-foreground">{mockCurrentUser.name}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <Label className="text-sm text-muted-foreground">Email</Label>
                <p className="text-base font-medium text-foreground">{mockCurrentUser.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <Label className="text-sm text-muted-foreground">Função</Label>
                <div className="mt-1">
                  {getRoleBadge(mockCurrentUser.role)}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alteração de Senha */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5" />
              Alteração de Senha
            </CardTitle>
            <CardDescription>
              Mantenha a sua conta segura com uma senha forte
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmitPassword)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="currentPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Senha Atual</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Digite a sua senha atual"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nova Senha</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Digite a nova senha"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirmar Nova Senha</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="Digite novamente a nova senha"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Atualizando...
                    </>
                  ) : (
                    "Atualizar Senha"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Autenticação de 2 Fatores */}
        <Card className="rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {twoFactorEnabled ? (
                <Shield className="h-5 w-5 text-green-600" />
              ) : (
                <ShieldAlert className="h-5 w-5 text-muted-foreground" />
              )}
              Autenticação de Dois Fatores (2FA)
            </CardTitle>
            <CardDescription>
              Adicione uma camada extra de segurança à sua conta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-foreground">
                  {twoFactorEnabled ? "2FA Ativo" : "2FA Inativo"}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  {twoFactorEnabled 
                    ? "Sua conta está protegida com autenticação de dois fatores"
                    : "Recomendamos ativar a autenticação de dois fatores para maior segurança"
                  }
                </p>
              </div>
              <Switch
                checked={twoFactorEnabled}
                onCheckedChange={handleToggle2FA}
              />
            </div>

            {twoFactorEnabled && (
              <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                <Shield className="h-5 w-5 text-green-600 flex-shrink-0" />
                <p className="text-sm text-green-800">
                  Sua conta está protegida. Você receberá um código por email/SMS ao fazer login.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
