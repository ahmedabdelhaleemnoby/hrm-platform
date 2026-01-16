import { apiClient } from './client';

export interface DashboardStats {
  total_employees: number;
  period_employees: number;
  active_employees: number;
  on_leave_employees: number;
  department_stats: {
    department: string;
    count: number;
  }[];
  recent_activities: {
    id: number;
    name: string;
    action: string;
    time: string;
    avatar: string;
  }[];
  labels?: {
    total_employees: string;
    period_employees: string;
    present_today: string;
    on_leave: string;
    departments: string;
    recent_hires: string;
    department_distribution: string;
  };
  locale?: string;
  period?: string;
}

export interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
}

export const dashboardApi = {
  getStats: (period: string = 'all') =>
    apiClient.get<DashboardStatsResponse>(`/v1/dashboard/stats?period=${period}`),
};
