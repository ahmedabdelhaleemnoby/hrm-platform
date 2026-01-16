import { apiClient as client } from './client';

export interface Notification {
  id: string;
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: {
    type: string;
    name?: string;
    message?: string;
    month?: string;
    job?: string;
  };
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface NotificationResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    unread_count: number;
  };
}

export const notificationsApi = {
  getNotifications: async () => {
    return await client.get<NotificationResponse>('/v1/notifications');
  },

  markAsRead: async (id: string) => {
    return await client.put<any>(`/v1/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    return await client.put<any>('/v1/notifications/read-all');
  },
};
