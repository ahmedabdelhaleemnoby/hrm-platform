import { apiClient } from './client';

export interface JobPosting {
  id: number;
  title: string;
  description: string;
  requirements?: string;
  responsibilities?: string;
  department?: string;
  location: string;
  employment_type: 'full_time' | 'part_time' | 'contract' | 'internship' | 'remote';
  experience_level: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  salary_min?: number;
  salary_max?: number;
  currency: string;
  status: 'draft' | 'published' | 'closed' | 'on_hold';
  positions_available: number;
  posted_date?: string;
  closing_date?: string;
  applications_count?: number;
}

export interface Candidate {
  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  resume_path?: string;
  current_company?: string;
  current_position?: string;
  years_of_experience?: number;
  skills?: string[];
  notes?: string;
  source: 'website' | 'linkedin' | 'referral' | 'job_board' | 'agency' | 'other';
  applications_count?: number;
}

export interface JobApplication {
  id: number;
  job_posting_id: number;
  candidate_id: number;
  stage: 'applied' | 'screening' | 'phone_interview' | 'technical_interview' | 'onsite_interview' | 'offer' | 'hired' | 'rejected' | 'withdrawn';
  status: 'active' | 'on_hold' | 'closed';
  cover_letter?: string;
  expected_salary?: number;
  available_from?: string;
  rating?: number;
  evaluation_notes?: string;
  applied_date: string;
  last_activity_date?: string;
  job_posting?: JobPosting;
  candidate?: Candidate;
}

export interface RecruitmentSummary {
  open_jobs: number;
  total_candidates: number;
  active_applications: number;
  hired_this_month: number;
  pipeline: Record<string, number>;
}

export const recruitmentApi = {
  // Jobs
  getJobs: (params?: { status?: string; department?: string }) =>
    apiClient.get<{ success: boolean; data: JobPosting[]; meta: any }>('/v1/recruitment/jobs', params),

  createJob: (data: Partial<JobPosting>) =>
    apiClient.post<{ success: boolean; data: JobPosting; message: string }>('/v1/recruitment/jobs', data),

  updateJob: (id: number, data: Partial<JobPosting>) =>
    apiClient.put<{ success: boolean; data: JobPosting; message: string }>(`/v1/recruitment/jobs/${id}`, data),

  // Candidates
  getCandidates: (params?: { source?: string }) =>
    apiClient.get<{ success: boolean; data: Candidate[]; meta: any }>('/v1/recruitment/candidates', params),

  createCandidate: (data: Partial<Candidate>) =>
    apiClient.post<{ success: boolean; data: Candidate; message: string }>('/v1/recruitment/candidates', data),

  // Applications
  getApplications: (params?: { job_id?: number; stage?: string }) =>
    apiClient.get<{ success: boolean; data: JobApplication[]; meta: any }>('/v1/recruitment/applications', params),

  createApplication: (data: { job_posting_id: number; candidate_id: number; cover_letter?: string }) =>
    apiClient.post<{ success: boolean; data: JobApplication; message: string }>('/v1/recruitment/applications', data),

  updateApplication: (id: number, data: Partial<JobApplication>) =>
    apiClient.put<{ success: boolean; data: JobApplication; message: string }>(`/v1/recruitment/applications/${id}`, data),

  // Summary
  getSummary: () =>
    apiClient.get<{ success: boolean; data: RecruitmentSummary }>('/v1/recruitment/summary'),
};
