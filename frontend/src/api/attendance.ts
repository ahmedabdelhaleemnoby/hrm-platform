import { apiClient } from './client';

export interface Attendance {
  id: number;
  employee_id: number;
  record_date: string;
  clock_in_time?: string;
  clock_out_time?: string;
  status: 'present' | 'late' | 'absent' | 'half_day' | 'on_leave';
  total_hours?: number;
  overtime_hours?: number;
  late_minutes?: number;
  notes?: string;
  employee?: {
    id: number;
    full_name: string;
  };
}

export interface AttendanceResponse {
  success: boolean;
  data: Attendance[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
  };
}

export const attendanceApi = {
  getAll: (params?: { date?: string; employee_id?: number }) =>
    apiClient.get<AttendanceResponse>('/v1/attendance', params),

  clockIn: () =>
    apiClient.post<{ success: boolean; data: Attendance; message: string }>('/v1/attendance/clock-in'),

  clockOut: () =>
    apiClient.post<{ success: boolean; data: Attendance; message: string }>('/v1/attendance/clock-out'),

  update: (id: number, data: Partial<Attendance>) =>
    apiClient.put<any>(`/v1/attendance/${id}`, data),
};
