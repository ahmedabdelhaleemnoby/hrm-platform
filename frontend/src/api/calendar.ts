import { apiClient } from './client';

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end?: string;
  allDay?: boolean;
  color?: string;
  type: 'leave' | 'birthday' | 'interview';
  extendedProps?: any;
}

export const calendarApi = {
  getEvents: (start?: string, end?: string) =>
    apiClient.get<{ success: boolean; data: CalendarEvent[] }>('/v1/calendar/events', {
      params: { start, end }
    }),
};
