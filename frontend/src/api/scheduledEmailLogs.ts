import { apiClient } from './client';

export interface ScheduledEmailLog {
  id: number;
  type: string;
  recipients_count: number;
  absent_count: number;
  expiring_contracts_count: number;
  birthdays_count: number;
  probation_endings_count: number;
  status: 'success' | 'failed' | 'skipped';
  error_message: string | null;
  executed_at: string;
  created_at: string;
  updated_at: string;
}

interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

const scheduledEmailLogsApi = {
  getLogs: (params?: { page?: number; per_page?: number }) =>
    apiClient.get<PaginatedResponse<ScheduledEmailLog>>('/v1/scheduled-email-logs', { params }),
};

export default scheduledEmailLogsApi;
