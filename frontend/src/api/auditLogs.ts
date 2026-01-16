import { apiClient } from './client';

export interface AuditLog {
  id: number;
  log_name: string;
  description: string;
  subject_type: string;
  event: string;
  subject_id: number;
  causer_type: string;
  causer_id: number;
  properties: {
    attributes: Record<string, any>;
    old?: Record<string, any>;
  };
  batch_uuid: string | null;
  created_at: string;
  updated_at: string;
  causer?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface AuditLogResponse {
  success: boolean;
  data: {
    data: AuditLog[];
    current_page: number;
    last_page: number;
    total: number;
    per_page: number;
  };
}

export const auditLogsApi = {
  getLogs: (params?: {
    page?: number;
    limit?: number;
    subject_type?: string;
    event?: string;
    user_id?: number | string;
  }) => apiClient.get<AuditLogResponse>('/v1/audit-logs', { params }),

  getLog: (id: number | string) =>
    apiClient.get<{ success: boolean; data: AuditLog }>(`/v1/audit-logs/${id}`),
};
