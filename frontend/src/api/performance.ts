import { apiClient } from './client';

export interface PerformanceReview {
  id: number;
  employee_id: number;
  reviewer_id: number;
  review_period: string;
  type: 'quarterly' | 'annual' | 'probation' | 'project';
  status: 'draft' | 'submitted' | 'in_review' | 'completed' | 'acknowledged';
  overall_rating?: number;
  quality_rating?: number;
  productivity_rating?: number;
  communication_rating?: number;
  teamwork_rating?: number;
  initiative_rating?: number;
  strengths?: string;
  areas_for_improvement?: string;
  reviewer_comments?: string;
  employee_comments?: string;
  review_date?: string;
  employee?: { id: number; full_name: string };
  reviewer?: { id: number; name: string };
}

export interface Okr {
  id: number;
  employee_id: number;
  title: string;
  description?: string;
  type: 'objective' | 'key_result';
  parent_id?: number;
  period: string;
  start_date: string;
  end_date: string;
  target_value?: number;
  current_value: number;
  progress: number;
  status: 'not_started' | 'on_track' | 'at_risk' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'critical';
  key_results?: Okr[];
  employee?: { id: number; full_name: string };
}

export interface Goal {
  id: number;
  employee_id: number;
  title: string;
  description?: string;
  category: 'career' | 'skill' | 'project' | 'personal' | 'team';
  target_date: string;
  progress: number;
  status: 'pending' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  milestones?: string[];
  notes?: string;
  employee?: { id: number; full_name: string };
}

export interface PerformanceSummary {
  okrs: { total: number; on_track: number; at_risk: number; completed: number };
  goals: { total: number; in_progress: number; completed: number };
  reviews: { total: number; latest_rating: number | null };
}

export const performanceApi = {
  // Reviews
  getReviews: (params?: { employee_id?: number }) =>
    apiClient.get<{ success: boolean; data: PerformanceReview[]; meta: any }>('/v1/performance/reviews', params),

  createReview: (data: Partial<PerformanceReview>) =>
    apiClient.post<{ success: boolean; data: PerformanceReview; message: string }>('/v1/performance/reviews', data),

  updateReview: (id: number, data: Partial<PerformanceReview>) =>
    apiClient.put<{ success: boolean; data: PerformanceReview; message: string }>(`/v1/performance/reviews/${id}`, data),

  // OKRs
  getOkrs: (params?: { employee_id?: number; period?: string }) =>
    apiClient.get<{ success: boolean; data: Okr[]; meta: any }>('/v1/performance/okrs', params),

  createOkr: (data: Partial<Okr>) =>
    apiClient.post<{ success: boolean; data: Okr; message: string }>('/v1/performance/okrs', data),

  updateOkr: (id: number, data: Partial<Okr>) =>
    apiClient.put<{ success: boolean; data: Okr; message: string }>(`/v1/performance/okrs/${id}`, data),

  // Goals
  getGoals: (params?: { employee_id?: number; category?: string }) =>
    apiClient.get<{ success: boolean; data: Goal[]; meta: any }>('/v1/performance/goals', params),

  createGoal: (data: Partial<Goal>) =>
    apiClient.post<{ success: boolean; data: Goal; message: string }>('/v1/performance/goals', data),

  updateGoal: (id: number, data: Partial<Goal>) =>
    apiClient.put<{ success: boolean; data: Goal; message: string }>(`/v1/performance/goals/${id}`, data),

  // Summary
  getSummary: () =>
    apiClient.get<{ success: boolean; data: PerformanceSummary }>('/v1/performance/summary'),
};
