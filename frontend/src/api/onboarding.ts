import { apiClient } from './client';

export interface OnboardingTemplate {
  id: number;
  name: string;
  description?: string;
  department?: string;
  position?: string;
  duration_days: number;
  active: boolean;
}

export interface OnboardingChecklist {
  id: number;
  employee_id: number;
  template_id?: number;
  title: string;
  start_date: string;
  target_completion_date: string;
  actual_completion_date?: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  progress: number;
  assigned_to?: number;
  notes?: string;
  employee?: { id: number; full_name: string };
  template?: OnboardingTemplate;
  tasks?: OnboardingTask[];
}

export interface OnboardingTask {
  id: number;
  checklist_id: number;
  title: string;
  description?: string;
  category: 'documentation' | 'training' | 'it_setup' | 'orientation' | 'compliance' | 'other';
  order: number;
  day_due: number;
  is_required: boolean;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  assigned_to?: number;
  completed_at?: string;
  completed_by?: number;
  notes?: string;
}

export interface OnboardingSummary {
  active_checklists: number;
  completed_this_month: number;
  overdue_checklists: number;
  templates_count: number;
  status_breakdown: Record<string, number>;
}

export const onboardingApi = {
  // Templates
  getTemplates: () =>
    apiClient.get<{ success: boolean; data: OnboardingTemplate[] }>('/v1/onboarding/templates'),

  createTemplate: (data: Partial<OnboardingTemplate>) =>
    apiClient.post<{ success: boolean; data: OnboardingTemplate; message: string }>('/v1/onboarding/templates', data),

  // Checklists
  getChecklists: (params?: { employee_id?: number; status?: string }) =>
    apiClient.get<{ success: boolean; data: OnboardingChecklist[]; meta: any }>('/v1/onboarding/checklists', params),

  createChecklist: (data: { employee_id: number; template_id?: number; title: string; start_date: string; target_completion_date: string }) =>
    apiClient.post<{ success: boolean; data: OnboardingChecklist; message: string }>('/v1/onboarding/checklists', data),

  // Tasks
  getTasks: (params?: { checklist_id?: number }) =>
    apiClient.get<{ success: boolean; data: OnboardingTask[] }>('/v1/onboarding/tasks', params),

  createTask: (data: Partial<OnboardingTask>) =>
    apiClient.post<{ success: boolean; data: OnboardingTask; message: string }>('/v1/onboarding/tasks', data),

  updateTask: (id: number, data: Partial<OnboardingTask>) =>
    apiClient.put<{ success: boolean; data: OnboardingTask; message: string }>(`/v1/onboarding/tasks/${id}`, data),

  // Summary
  getSummary: () =>
    apiClient.get<{ success: boolean; data: OnboardingSummary }>('/v1/onboarding/summary'),
};
