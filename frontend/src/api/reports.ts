import { apiClient } from './client';

export interface EmployeeReports {
  total_employees: number;
  department_distribution: { department: string; count: number }[];
  employment_status: { employment_status: string; count: number }[];
  employment_type: { employment_type: string; count: number }[];
}

export interface AttendanceReports {
  trends: { date: string; count: number }[];
  status_summary: { status: string; count: number }[];
}

export interface PayrollReports {
  monthly_expenses: { month: string; total_net_pay: number; total_gross_pay: number }[];
  department_expenses: { department: string; total_expense: number }[];
}

export interface RecruitmentReports {
  applications_by_stage: { stage: string; count: number }[];
  source_effectiveness: { source: string; count: number }[];
  job_posting_status: { status: string; count: number }[];
}

export const reportsApi = {
  getEmployeeReports: () =>
    apiClient.get<{ success: boolean; data: EmployeeReports }>('/v1/reports/employees'),

  getAttendanceReports: (params?: { days?: number }) =>
    apiClient.get<{ success: boolean; data: AttendanceReports }>('/v1/reports/attendance', params),

  getPayrollReports: () =>
    apiClient.get<{ success: boolean; data: PayrollReports }>('/v1/reports/payroll'),

  getRecruitmentReports: () =>
    apiClient.get<{ success: boolean; data: RecruitmentReports }>('/v1/reports/recruitment'),
};
