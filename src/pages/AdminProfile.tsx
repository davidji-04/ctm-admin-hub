import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
    Shield, Key, Smartphone, Laptop, LogOut,
    History, CheckCircle2, AlertCircle
} from "lucide-react";

// --- MOCK DATA ---

const USER_DATA = {
    name: "Administrador CTM",
    email: "admin@ctm.com",
    role: "Admin Master", // ou "Admin Técnico"
    avatar: "https://github.com/shadcn.png", // Placeholder
    joinedAt: "Dezembro 2025"
};

const ACTIVE_SESSIONS = [
    {
        id: 1,
        device: "MacBook Pro",
        browser: "Chrome",
        location: "Lisboa, Portugal",
        lastActive: "Agora",
        current: true,
        type: "desktop"
    },
    {
        id: 2,
        device: "iPhone 13",
        browser: "Safari",
        location: "Lisboa, Portugal",
        lastActive: "Há 2 horas",
        current: false,
        type: "mobile"
    },
    {
        id: 3,
        device: "Windows PC",
        browser: "Firefox",
        location: "Porto, Portugal",
        lastActive: "Há 3 dias",
        current: false,
        type: "desktop"
    }
];

const ACTIVITY_LOG = [
    {
        id: 1,
        action: "Publicou percurso",
        target: "Rota Vicentina - Setor 1",
        date: "16 Dez 2025, 10:30",
        status: "success"
    },
    {
        id: 2,
        action: "Editou localidade",
        target: "Vila Nova de Milfontes",
        date: "15 Dez 2025, 14:20",
        status: "success"
    },
    {
        id: 3,
        action: "Alterou permissões",
        target: "Utilizador: João Silva",
        date: "14 Dez 2025, 09:15",
        status: "warning"
    },
    {
        id: 4,
        action: "Login",
        target: "Sistema",
        date: "14 Dez 2025, 09:00",
        status: "success"
    },
    {
        id: 5,
        action: "Tentativa de Login falhada",
        target: "Sistema",
        date: "13 Dez 2025, 22:45",
        status: "error"
    }
];

export const UserProfile = () => {
    const [sessions, setSessions] = useState(ACTIVE_SESSIONS);
    const [is2FAEnabled, setIs2FAEnabled] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Função simulada para terminar sessão remota
    const handleRevokeSession = (sessionId: number) => {
        setSessions(sessions.filter(s => s.id !== sessionId));
    };

    // Função simulada para guardar alterações
    const handleSaveProfile = () => {
        setIsLoading(true);
        setTimeout(() => setIsLoading(false), 1000);
    };

    return (
        <div className="space-y-6 p-6 pb-16">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Perfil de Utilizador</h1>
                    <p className="text-muted-foreground">
                        Faça a gestão das suas informações pessoais, segurança e histórico.
                    </p>
                </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6">

                {/* SIDEBAR / CARTÃO DE PERFIL */}
                <div className="w-full lg:w-80 space-y-6">
                    <Card>
                        <CardHeader className="text-center">
                            <div className="flex justify-center mb-4 relative">
                                <Avatar className="h-24 w-24 border-4 border-background shadow-sm">
                                    <AvatarImage src={USER_DATA.avatar} />
                                    <AvatarFallback>RM</AvatarFallback>
                                </Avatar>
                                {/* Indicador de Status Online */}
                                <span className="absolute bottom-1 right-1/3 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></span>
                            </div>
                            <CardTitle>{USER_DATA.name}</CardTitle>
                            <CardDescription>{USER_DATA.email}</CardDescription>

                            <div className="pt-4 flex justify-center">
                                {/* REQUISITO 2: IDENTIFICAÇÃO DO PERFIL */}
                                <Badge
                                    variant={USER_DATA.role === "Admin Master" ? "default" : "secondary"}
                                    className={`px-4 py-1 text-sm ${USER_DATA.role === "Admin Master"
                                            ? "bg-purple-100 text-purple-700 hover:bg-purple-100 border-purple-200"
                                            : "bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200"
                                        }`}
                                >
                                    <Shield className="w-3 h-3 mr-1.5" />
                                    {USER_DATA.role}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="text-sm text-muted-foreground text-center">
                                Membro desde {USER_DATA.joinedAt}
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* CONTEÚDO PRINCIPAL (TABS) */}
                <div className="flex-1">
                    <Tabs defaultValue="security" className="space-y-4">
                        <TabsList>
                            <TabsTrigger value="general">Geral</TabsTrigger>
                            <TabsTrigger value="security">Segurança</TabsTrigger>
                            <TabsTrigger value="history">Histórico e Auditoria</TabsTrigger>
                        </TabsList>

                        {/* TAB GERAL */}
                        <TabsContent value="general">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informação Pessoal</CardTitle>
                                    <CardDescription>Atualize os seus dados de contacto e preferências.</CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="name">Nome Completo</Label>
                                            <Input id="name" defaultValue={USER_DATA.name} />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email">Email</Label>
                                            <Input id="email" defaultValue={USER_DATA.email} disabled className="bg-muted" />
                                            <p className="text-[10px] text-muted-foreground">O email está vinculado à sua conta de administrador e não pode ser alterado aqui.</p>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="phone">Telemóvel</Label>
                                            <Input id="phone" placeholder="+351 912 345 678" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="lang">Idioma</Label>
                                            <Input id="lang" defaultValue="Português (Portugal)" disabled />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-end">
                                    <Button onClick={handleSaveProfile} disabled={isLoading}>
                                        {isLoading ? "A guardar..." : "Guardar Alterações"}
                                    </Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>

                        {/* TAB SEGURANÇA (REQUISITO 1) */}
                        <TabsContent value="security" className="space-y-6">

                            {/* Alterar Senha */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Key className="w-5 h-5 text-primary" />
                                        <CardTitle>Alterar Senha</CardTitle>
                                    </div>
                                    <CardDescription>
                                        Certifique-se de que a sua senha é forte e única.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="current-pass">Senha Atual</Label>
                                        <Input id="current-pass" type="password" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="new-pass">Nova Senha</Label>
                                            <Input id="new-pass" type="password" />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="confirm-pass">Confirmar Nova Senha</Label>
                                            <Input id="confirm-pass" type="password" />
                                        </div>
                                    </div>
                                </CardContent>
                                <CardFooter className="border-t pt-6 flex justify-end">
                                    <Button variant="secondary">Atualizar Senha</Button>
                                </CardFooter>
                            </Card>

                            {/* Autenticação de Dois Fatores (2FA) */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <Smartphone className="w-5 h-5 text-primary" />
                                                <CardTitle>Autenticação de Dois Fatores (2FA)</CardTitle>
                                            </div>
                                            <CardDescription>
                                                Adicione uma camada extra de segurança à sua conta.
                                            </CardDescription>
                                        </div>
                                        <Switch checked={is2FAEnabled} onCheckedChange={setIs2FAEnabled} />
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {is2FAEnabled ? (
                                        <div className="flex items-start gap-4 p-4 bg-green-50 text-green-700 rounded-md border border-green-200">
                                            <CheckCircle2 className="w-5 h-5 mt-0.5" />
                                            <div>
                                                <p className="font-medium">O 2FA está ativado</p>
                                                <p className="text-sm">Os códigos de segurança estão a ser enviados para o seu email principal.</p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="flex items-start gap-4 p-4 bg-muted rounded-md border">
                                            <AlertCircle className="w-5 h-5 mt-0.5 text-muted-foreground" />
                                            <div>
                                                <p className="font-medium">O 2FA está desativado</p>
                                                <p className="text-sm text-muted-foreground">Recomendamos vivamente que ative esta opção para proteger o acesso de Administrador.</p>
                                            </div>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Gestão de Sessões */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <Laptop className="w-5 h-5 text-primary" />
                                        <CardTitle>Sessões Ativas</CardTitle>
                                    </div>
                                    <CardDescription>
                                        Gerir e terminar sessão nos seus dispositivos ativos.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-6">
                                        {sessions.map((session) => (
                                            <div key={session.id} className="flex items-center justify-between pb-4 last:pb-0 last:border-0 border-b">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-muted p-2 rounded-full">
                                                        {session.type === 'mobile' ? <Smartphone className="w-5 h-5" /> : <Laptop className="w-5 h-5" />}
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-sm flex items-center gap-2">
                                                            {session.device} - {session.browser}
                                                            {session.current && (
                                                                <Badge variant="outline" className="text-[10px] bg-green-50 text-green-700 border-green-200">
                                                                    Este dispositivo
                                                                </Badge>
                                                            )}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            {session.location} • {session.lastActive}
                                                        </p>
                                                    </div>
                                                </div>
                                                {!session.current && (
                                                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleRevokeSession(session.id)}>
                                                        <LogOut className="w-4 h-4 mr-1" /> Sair
                                                    </Button>
                                                )}
                                            </div>
                                        ))}
                                        {sessions.length === 0 && (
                                            <p className="text-sm text-muted-foreground text-center py-4">Nenhuma outra sessão ativa.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* TAB HISTÓRICO (REQUISITO 3) */}
                        <TabsContent value="history">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center gap-2">
                                        <History className="w-5 h-5 text-primary" />
                                        <CardTitle>Log de Atividade Recente</CardTitle>
                                    </div>
                                    <CardDescription>
                                        Auditoria das ações realizadas por este administrador.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                                        {ACTIVITY_LOG.map((log) => (
                                            <div key={log.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                {/* Icon/Dot */}
                                                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-100 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                                                    {log.status === 'success' ? (
                                                        <CheckCircle2 className="w-5 h-5 text-green-600" />
                                                    ) : log.status === 'warning' ? (
                                                        <Shield className="w-5 h-5 text-amber-600" />
                                                    ) : (
                                                        <AlertCircle className="w-5 h-5 text-red-600" />
                                                    )}
                                                </div>

                                                {/* Content Card */}
                                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded border border-slate-200 bg-white shadow-sm">
                                                    <div className="flex items-center justify-between space-x-2 mb-1">
                                                        <div className="font-bold text-slate-900">{log.action}</div>
                                                        <time className="font-mono italic text-xs text-muted-foreground">{log.date}</time>
                                                    </div>
                                                    <div className="text-slate-500 text-sm">
                                                        {log.target}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                                <CardFooter className="flex justify-center border-t pt-6">
                                    <Button variant="ghost" size="sm">Carregar mais atividade</Button>
                                </CardFooter>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;