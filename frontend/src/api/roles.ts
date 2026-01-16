import { apiClient } from './client';

export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
  created_at?: string;
  updated_at?: string;
}

export interface Permission {
  id: number;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export interface UserWithRoles {
  id: number;
  name: string;
  email: string;
  roles: Role[];
  employee?: any;
  created_at?: string;
  updated_at?: string;
}

export interface RolesResponse {
  success: boolean;
  data: Role[];
}

export interface UserRolesResponse {
  success: boolean;
  data: UserWithRoles[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const rolesApi = {
  // Role Management
  getRoles: () => apiClient.get<RolesResponse>('/v1/roles'),

  getRole: (id: number) =>
    apiClient.get<{ success: boolean; data: Role }>(`/v1/roles/${id}`),

  createRole: (data: { name: string; permissions?: string[] }) =>
    apiClient.post<{ success: boolean; data: Role }>('/v1/roles', data),

  updateRole: (id: number, data: { name?: string; permissions?: string[] }) =>
    apiClient.put<{ success: boolean; data: Role }>(`/v1/roles/${id}`, data),

  deleteRole: (id: number) =>
    apiClient.delete<{ success: boolean; message: string }>(`/v1/roles/${id}`),

  getPermissions: () =>
    apiClient.get<{ success: boolean; data: Permission[] }>('/v1/roles/permissions'),

  // User Role Management
  getUserRoles: (params?: { page?: number; per_page?: number; search?: string }) =>
    apiClient.get<UserRolesResponse>('/v1/user-roles', { params }),

  getUserRole: (userId: number) =>
    apiClient.get<{ success: boolean; data: UserWithRoles }>(`/v1/user-roles/${userId}`),

  updateUserRoles: (userId: number, roles: string[]) =>
    apiClient.put<{ success: boolean; data: UserWithRoles; message: string }>(
      `/v1/user-roles/${userId}`,
      { roles }
    ),
};
