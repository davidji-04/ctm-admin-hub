import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { Notification, NotificationPriority, NotificationType } from '@/types/notification';

interface NotificationContextType {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Initial mock notifications
const initialNotifications: Notification[] = [
  {
    id: 'notif-1',
    type: 'training_request',
    priority: 'critical',
    title: 'Pedido de Treino Pago',
    message: 'Novo cliente premium a solicitar tour guiado para o Caminho Português',
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    read: false,
    actionUrl: '/coming-soon',
    metadata: { clientId: 'client-123' },
  },
  {
    id: 'notif-2',
    type: 'route_pending_approval',
    priority: 'important',
    title: 'Percurso Pendente de Aprovação',
    message: 'Editor submeteu "Via Algarviana" para sua revisão',
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
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
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    read: false,
    actionUrl: '/coming-soon',
    metadata: { reviewId: 'review-789', routeId: 'route-123' },
  },
  {
    id: 'notif-4',
    type: 'route_published',
    priority: 'informative',
    title: 'Seu Percurso Foi Publicado',
    message: 'Administrador aprovou e publicou "Rota Vicentina"',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
    read: true,
    actionUrl: '/routes/route-published-456',
    metadata: { routeId: 'route-published-456' },
  },
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

  const addNotification = useCallback((
    notification: Omit<Notification, 'id' | 'timestamp' | 'read'>
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      read: false,
    };
    setNotifications(prev => [newNotification, ...prev]);
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        markAllAsRead,
        removeNotification,
        unreadCount,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
