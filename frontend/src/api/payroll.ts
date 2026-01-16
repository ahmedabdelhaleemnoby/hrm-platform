import { apiClient } from './client';

export interface PayrollPeriod {
  id: number;
  name: string;
  start_date: string;
  end_date: string;
  status: 'draft' | 'processing' | 'approved' | 'paid' | 'cancelled';
  working_days: number;
  total_gross: number;
  total_deductions: number;
  total_net: number;
  approved_by?: number;
  approved_at?: string;
}

export interface PayrollRecord {
  id: number;
  employee_id: number;
  payroll_period_id: number;
  basic_salary: number;
  allowances: number;
  bonuses: number;
  overtime_pay: number;
  gross_salary: number;
  tax_deduction: number;
  insurance_deduction: number;
  other_deductions: number;
  total_deductions: number;
  net_salary: number;
  days_worked: number;
  days_absent: number;
  overtime_hours: number;
  status: 'draft' | 'approved' | 'paid';
  notes?: string;
  employee?: {
    id: number;
    full_name: string;
  };
  payroll_period?: PayrollPeriod;
}

export interface PayrollPeriodsResponse {
  success: boolean;
  data: PayrollPeriod[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
  };
}

export interface PayrollRecordsResponse {
  success: boolean;
  data: PayrollRecord[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
  };
}

export const payrollApi = {
  getPeriods: () =>
    apiClient.get<PayrollPeriodsResponse>('/v1/payroll/periods'),

  createPeriod: (data: { name: string; start_date: string; end_date: string; working_days: number }) =>
    apiClient.post<{ success: boolean; data: PayrollPeriod; message: string }>('/v1/payroll/periods', data),

  approvePeriod: (id: number) =>
    apiClient.put<{ success: boolean; data: PayrollPeriod; message: string }>(`/v1/payroll/periods/${id}/approve`),

  getRecords: (params?: { period_id?: number; employee_id?: number }) =>
    apiClient.get<PayrollRecordsResponse>('/v1/payroll/records', params),

  calculate: (periodId: number) =>
    apiClient.post<{ success: boolean; data: any; message: string }>('/v1/payroll/calculate', { period_id: periodId }),

  getMyPayslips: () =>
    apiClient.get<{ success: boolean; data: PayrollRecord[] }>('/v1/payroll/my-payslips'),
};
