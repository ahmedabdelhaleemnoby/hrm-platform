import { apiClient } from './client';

export interface EmployeeDocument {
  id: number;
  employee_id: number;
  name: string;
  file_path: string;
  file_type: string;
  file_size: number;
  created_at: string;
}

export interface Employee {
  id: number;
  employee_code: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone?: string;
  department?: string;
  position?: string;
  employment_status: 'active' | 'on_leave' | 'terminated';
  employment_type: 'full_time' | 'part_time' | 'contract';
  hire_date?: string;
  salary?: number;
  address?: string;
  contract_end_date?: string;
  probation_end_date?: string;
  avatar_url?: string;
  documents?: EmployeeDocument[];
  created_at?: string;
  updated_at?: string;
}

export interface EmployeesResponse {
  success: boolean;
  data: Employee[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export const employeeApi = {
  getAll: (params?: { page?: number; per_page?: number; search?: string }) =>
    apiClient.get<EmployeesResponse>('/v1/employees', params),

  getById: (id: number) =>
    apiClient.get<{ success: boolean; data: Employee }>(`/v1/employees/${id}`),

  create: (data: Partial<Employee>) =>
    apiClient.post<any>('/v1/employees', data),

  update: (id: number, data: Partial<Employee>) =>
    apiClient.put<any>(`/v1/employees/${id}`, data),

  delete: (id: number) =>
    apiClient.delete<any>(`/v1/employees/${id}`),

  uploadAvatar: (id: number, file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.post<{ success: boolean; avatar_url: string; message: string }>(
      `/v1/employees/${id}/avatar`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },

  uploadDocument: (id: number, file: File, name: string) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('name', name);
    return apiClient.post<{ success: boolean; data: EmployeeDocument; message: string }>(
      `/v1/employees/${id}/documents`,
      formData,
      { headers: { 'Content-Type': 'multipart/form-data' } }
    );
  },

  deleteDocument: (id: number) =>
    apiClient.delete<{ success: boolean; message: string }>(`/v1/documents/${id}`),
};
