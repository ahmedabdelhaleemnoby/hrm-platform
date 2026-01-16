import { apiClient } from './client';

export interface LoginRequest {
  email: string;
  password: string;
  tenant_id: string;
}

export interface LoginResponse {
  success: boolean;
  data: {
    access_token: string;
    token_type: string;
    expires_in: number;
    user: {
      id: string;
      email: string;
      name: string;
      roles: string[];
      permissions: string[];
    };
  };
}

export interface User {
  id: string;
  name: string;
  email: string;
  employee: any;
  roles: string[];
  permissions: string[];
  last_login_at: string;
  notification_settings: Record<string, boolean>;
}

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>('/v1/auth/login', data),

  logout: () =>
    apiClient.post('/v1/auth/logout'),

  me: () =>
    apiClient.get<{ success: boolean; data: User }>('/v1/auth/me'),

  refresh: () =>
    apiClient.post<LoginResponse>('/v1/auth/refresh'),

  forgotPassword: (email: string) =>
    apiClient.post('/v1/auth/forgot-password', { email }),

  resetPassword: (data: { email: string; token: string; password: string; password_confirmation: string }) =>
    apiClient.post('/v1/auth/reset-password', data),

  updateProfile: (data: { name?: string; email?: string }) =>
    apiClient.put<{ status: string; data: User }>('/v1/auth/profile', data),

  updateNotificationSettings: (settings: Record<string, boolean>) =>
    apiClient.put<{ status: string; data: Record<string, boolean> }>('/v1/auth/notification-settings', { settings }),
};
