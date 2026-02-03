import { calendarApi, CalendarEvent } from '@/api/calendar';
import MainLayout from '@/components/layout/MainLayout';
import { useThemeContext } from '@/contexts/ThemeContext';
import arLocale from '@fullcalendar/core/locales/ar';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import {
    Box,
    Button,
    Chip,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Paper,
    Stack,
    Typography,
    useTheme
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';

const CalendarPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const themeContext = useThemeContext();
  const resolvedMode = themeContext?.resolvedMode || 'light';
  const language = themeContext?.language || 'en';
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchEvents = async (start?: string, end?: string) => {
    try {
      const response = await calendarApi.getEvents(start, end);
      if (response.success) {
        setEvents(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch calendar events:', error);
    }
  };

  const handleEventClick = (info: any) => {
    const event = events.find(e => e.id === info.event.id);
    if (event) {
      setSelectedEvent(event);
      setDialogOpen(true);
    }
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          {t('calendar.title', 'HR Calendar')}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {t('calendar.subtitle', 'View leaves, birthdays, and interviews')}
        </Typography>
      </Box>

      <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
        <Chip label={t('calendar.legend.leaves', 'Leaves')} sx={{ bgcolor: '#10b981', color: '#fff' }} size="small" />
        <Chip label={t('calendar.legend.birthdays', 'Birthdays')} sx={{ bgcolor: '#3b82f6', color: '#fff' }} size="small" />
        <Chip label={t('calendar.legend.interviews', 'Interviews')} sx={{ bgcolor: '#f59e0b', color: '#fff' }} size="small" />
      </Stack>

      <Paper sx={{ p: 2, borderRadius: 2 }}>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events}
          eventClick={handleEventClick}
          datesSet={(dateInfo) => {
            fetchEvents(dateInfo.startStr, dateInfo.endStr);
          }}
          locales={[arLocale]}
          locale={language}
          direction={language === 'ar' ? 'rtl' : 'ltr'}
          height="auto"
          themeSystem="standard"
          eventDisplay="block"
          dayMaxEvents={true}
        />
      </Paper>

      {/* Event Details Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          {selectedEvent?.title}
        </DialogTitle>
        <DialogContent sx={{ minWidth: 300 }}>
          <Stack spacing={2}>
            <Box>
              <Typography variant="caption" color="text.secondary">{t('calendar.date', 'Date')}</Typography>
              <Typography variant="body1">
                {selectedEvent?.start ? new Date(selectedEvent.start).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US') : ''}
              </Typography>
            </Box>
            {selectedEvent?.type === 'leave' && (
              <Box>
                <Typography variant="caption" color="text.secondary">{t('calendar.leaveType', 'Leave Type')}</Typography>
                <Typography variant="body1">{selectedEvent.extendedProps?.leave_type}</Typography>
              </Box>
            )}
            {selectedEvent?.type === 'interview' && (
              <Box>
                <Typography variant="caption" color="text.secondary">{t('calendar.location', 'Location')}</Typography>
                <Typography variant="body1">{selectedEvent.extendedProps?.location || t('common.none', 'None')}</Typography>
              </Box>
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)}>{t('common.close', 'Close')}</Button>
        </DialogActions>
      </Dialog>
      
      <style>{`
        .fc {
          font-family: inherit;
        }
        .fc-theme-standard td, .fc-theme-standard th {
          border-color: ${theme.palette.divider};
        }
        .fc .fc-toolbar-title {
          font-size: 1.25rem;
          font-weight: 600;
        }
        .fc .fc-button-primary {
          background-color: ${theme.palette.primary.main};
          border-color: ${theme.palette.primary.main};
        }
        .fc .fc-button-primary:hover {
          background-color: ${theme.palette.primary.dark};
          border-color: ${theme.palette.primary.dark};
        }
        .fc .fc-button-primary:disabled {
          background-color: ${theme.palette.action.disabledBackground};
          border-color: ${theme.palette.action.disabledBackground};
        }
        .fc-daygrid-event {
          cursor: pointer;
          border-radius: 4px;
          padding: 2px 4px;
          font-size: 0.85rem;
        }
        .fc .fc-day-today {
          background-color: ${theme.palette.action.hover} !important;
        }
        ${resolvedMode === 'dark' ? `
          .fc-daygrid-day-number, .fc-col-header-cell-cushion {
            color: ${theme.palette.text.primary};
          }
        ` : ''}
      `}</style>
    </MainLayout>
  );
};

export default CalendarPage;
