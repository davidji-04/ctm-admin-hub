export type NotificationPriority = 'critical' | 'important' | 'attention' | 'informative';

export type NotificationType = 
  | 'route_pending_approval'
  | 'route_published'
  | 'route_rejected'
  | 'review_pending'
  | 'weather_alert'
  | 'user_signup'
  | 'training_request'
  | 'locality_updated';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
  metadata?: {
    routeId?: string;
    userId?: string;
    reviewId?: string;
    [key: string]: any;
  };
}
