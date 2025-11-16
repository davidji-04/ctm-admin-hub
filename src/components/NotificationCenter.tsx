import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import { Bell, AlertCircle, Info, AlertTriangle, Zap, Check } from 'lucide-react';
import { Notification, NotificationPriority } from '@/types/notification';
import { cn } from '@/lib/utils';

// Mock notifications data - in production, this would come from an API
const mockNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'training_request',
    priority: 'critical',
    title: 'Pedido de Treino Pago',
    message: 'Novo cliente premium a solicitar tour guiado para o Caminho Português',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 min ago
    read: false,
    actionUrl: '/coming-soon', // Would be /premium-clients/:id
    metadata: { clientId: 'client-123' },
  },
  {
    id: 'notif-2',
    type: 'route_pending_approval',
    priority: 'important',
    title: 'Percurso Pendente de Aprovação',
    message: 'Editor submeteu "Via Algarviana" para sua revisão',
    timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 min ago
    read: false,
    actionUrl: '/routes/route-pending-123',
    metadata: { routeId: 'route-pending-123', editorId: 'user-456' },
  },
  {
    id: 'notif-3',
    type: 'review_pending',
    priority: 'important',
    title: 'Nova Avaliação Pendente de Aprovação',
    message: 'Utilizador submeteu uma avaliação de 5 estrelas para "Caminho Francês"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    actionUrl: '/coming-soon', // Would be /reviews/:id
    metadata: { reviewId: 'review-789', routeId: 'route-123' },
  },
  {
    id: 'notif-4',
    type: 'weather_alert',
    priority: 'attention',
    title: 'Alerta Meteorológico Acionado',
    message: 'Previsão de chuva forte para a região da Serra da Estrela',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hours ago
    read: true,
    actionUrl: '/coming-soon', // Would be /weather-alerts
    metadata: { region: 'serra-estrela' },
  },
  {
    id: 'notif-5',
    type: 'route_published',
    priority: 'informative',
    title: 'Seu Percurso Foi Publicado',
    message: 'Administrador aprovou e publicou "Rota Vicentina"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    read: true,
    actionUrl: '/routes/route-published-456',
    metadata: { routeId: 'route-published-456' },
  },
  {
    id: 'notif-6',
    type: 'user_signup',
    priority: 'informative',
    title: 'Novo Utilizador Registado',
    message: 'João Silva registou-se como utilizador premium',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48), // 2 days ago
    read: true,
    actionUrl: '/users',
    metadata: { userId: 'user-new-123' },
  },
];

const priorityOrder: Record<NotificationPriority, number> = {
  critical: 1,
  important: 2,
  attention: 3,
  informative: 4,
};

const getPriorityIcon = (priority: NotificationPriority) => {
  switch (priority) {
    case 'critical':
      return <AlertCircle className="h-4 w-4 text-destructive" />;
    case 'important':
      return <Zap className="h-4 w-4 text-orange-500" />;
    case 'attention':
      return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
    case 'informative':
      return <Info className="h-4 w-4 text-blue-500" />;
  }
};

const getPriorityColor = (priority: NotificationPriority) => {
  switch (priority) {
    case 'critical':
      return 'border-l-destructive';
    case 'important':
      return 'border-l-orange-500';
    case 'attention':
      return 'border-l-yellow-500';
    case 'informative':
      return 'border-l-blue-500';
  }
};

const formatTimestamp = (date: Date) => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Agora mesmo';
  if (diffMins < 60) return `há ${diffMins}min`;
  if (diffHours < 24) return `há ${diffHours}h`;
  if (diffDays === 1) return 'Ontem';
  if (diffDays < 7) return `há ${diffDays}d`;
  return date.toLocaleDateString('pt-PT');
};

export const NotificationCenter = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [open, setOpen] = useState(false);

  // Sort notifications by priority and timestamp
  const sortedNotifications = [...notifications].sort((a, b) => {
    const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (priorityDiff !== 0) return priorityDiff;
    return b.timestamp.getTime() - a.timestamp.getTime();
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    setNotifications((prev) =>
      prev.map((n) => (n.id === notification.id ? { ...n, read: true } : n))
    );

    // Navigate to action URL
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
      setOpen(false);
    }
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-96 bg-card p-0 z-50">
        <div className="flex items-center justify-between p-4 pb-3">
          <div>
            <h3 className="font-semibold text-foreground">Notificações</h3>
            <p className="text-xs text-muted-foreground">
              {unreadCount > 0 ? `${unreadCount} não lidas` : 'Tudo em dia!'}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button variant="ghost" size="sm" onClick={markAllAsRead} className="text-xs">
              <Check className="h-3 w-3 mr-1" />
              Marcar todas como lidas
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="h-[400px]">
          {sortedNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <Bell className="h-12 w-12 mb-2 opacity-20" />
              <p className="text-sm">Sem notificações</p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {sortedNotifications.map((notification) => (
                <button
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={cn(
                    'w-full text-left p-4 hover:bg-accent/50 transition-colors border-l-4',
                    getPriorityColor(notification.priority),
                    !notification.read && 'bg-accent/20'
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getPriorityIcon(notification.priority)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className="font-medium text-sm text-foreground">
                          {notification.title}
                        </p>
                        {!notification.read && (
                          <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      <p className="text-xs text-muted-foreground/70">
                        {formatTimestamp(notification.timestamp)}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
