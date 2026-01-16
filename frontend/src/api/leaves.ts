import { apiClient } from './client';

export interface LeaveType {
  id: number;
  name: string;
  code: string;
  description?: string;
  is_paid: boolean;
  max_days_per_year?: number;
  color?: string;
}

export interface LeaveRequest {
  id: number;
  employee_id: number;
  leave_type_id: number;
  start_date: string;
  end_date: string;
  total_days: number;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected' | 'cancelled';
  approved_by?: number;
  approved_at?: string;
  rejection_reason?: string;
  leave_type?: LeaveType;
  employee?: {
    id: number;
    full_name: string;
  };
}

export interface LeaveRequestsResponse {
  success: boolean;
  data: LeaveRequest[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
  };
}

export interface LeaveTypesResponse {
  success: boolean;
  data: LeaveType[];
}

export const leaveApi = {
  getTypes: () =>
    apiClient.get<LeaveTypesResponse>('/v1/leaves/types'),

  getAll: (params?: { employee_id?: number, view_team?: boolean }) =>
    apiClient.get<LeaveRequestsResponse>('/v1/leaves', params),

  create: (data: { leave_type_id: number; start_date: string; end_date: string; reason?: string }) =>
    apiClient.post<{ success: boolean; data: LeaveRequest; message: string }>('/v1/leaves', data),

  update: (id: number, data: Partial<LeaveRequest>) =>
    apiClient.put<{ success: boolean; data: LeaveRequest; message: string }>(`/v1/leaves/${id}`, data),
};
