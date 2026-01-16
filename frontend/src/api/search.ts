import { apiClient as client } from './client';

export interface SearchResult {
  employees: Array<{
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    position: string;
    department: string;
    employee_code: string;
  }>;
  departments: Array<{
    name: string;
    type: string;
  }>;
}

export interface SearchResponse {
  success: boolean;
  data: SearchResult;
}

export const searchApi = {
  search: async (query: string) => {
    return await client.get<SearchResponse>(`/v1/search?q=${encodeURIComponent(query)}`);
  }
};
