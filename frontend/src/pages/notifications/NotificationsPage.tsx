import { Notification, notificationsApi } from '@/api/notifications';
import MainLayout from '@/components/layout/MainLayout';
import { useThemeContext } from '@/contexts/ThemeContext';
import {
    CheckCircleOutline as CheckCircleIcon,
    DoneAll as DoneAllIcon,
    Notifications as NotificationsIcon,
    FiberManualRecord as UnreadIcon,
} from '@mui/icons-material';
import {
    Box,
    Button,
    Chip,
    CircularProgress,
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const NotificationsPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { language } = useThemeContext();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const response = await notificationsApi.getNotifications();
      if (response.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unread_count);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (noti: Notification) => {
    try {
      if (!noti.read_at) {
        await notificationsApi.markAsRead(noti.id);
        fetchNotifications();
      }

      // Navigation logic based on notification type
      const data = noti.data;
      switch (data.type) {
        case 'leave':
          navigate('/leave');
          break;
        case 'attendance':
          navigate('/attendance');
          break;
        case 'payroll':
          navigate('/payroll');
          break;
        case 'candidate':
          navigate('/recruitment');
          break;
        default:
          break;
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getTimeAgo = (date: string) => {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true,
      locale: language === 'ar' ? ar : enUS
    });
  };

  const getNotificationText = (noti: Notification) => {
    const data = noti.data;
    switch (data.type) {
      case 'leave':
        return t('notifications.newLeaveRequest', { name: data.name });
      case 'attendance':
        return t('notifications.attendanceAlert', { name: data.name });
      case 'payroll':
        return t('notifications.payrollProcessed', { month: data.month });
      case 'candidate':
        return t('notifications.newCandidate', { job: data.job });
      default:
        return data.message || '';
    }
  };

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 900, mx: 'auto', py: 4 }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <NotificationsIcon color="primary" sx={{ fontSize: 32 }} />
            <Box>
              <Typography variant="h4" fontWeight="bold">
                {t('notifications.title')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {unreadCount > 0 
                  ? `${unreadCount} unread notifications` 
                  : t('notifications.noNotifications')}
              </Typography>
            </Box>
          </Box>
          {unreadCount > 0 && (
            <Button
              variant="outlined"
              startIcon={<DoneAllIcon />}
              onClick={handleMarkAllAsRead}
            >
              {t('notifications.markAllAsRead')}
            </Button>
          )}
        </Stack>

        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : notifications.length > 0 ? (
            <List sx={{ p: 0 }}>
              {notifications.map((noti, index) => (
                <React.Fragment key={noti.id}>
                  <ListItem
                    onClick={() => handleMarkAsRead(noti)}
                    sx={{
                      py: 3,
                      px: { xs: 2, md: 4 },
                      bgcolor: noti.read_at ? 'transparent' : 'action.hover',
                      borderLeft: noti.read_at ? 'none' : '4px solid',
                      borderColor: 'primary.main',
                      cursor: 'pointer',
                      '&:hover': {
                        bgcolor: 'action.selected',
                      },
                    }}
                    secondaryAction={
                      !noti.read_at && (
                        <Tooltip title={t('notifications.markAsRead')}>
                          <IconButton edge="end" onClick={() => handleMarkAsRead(noti)}>
                            <CheckCircleIcon color="primary" />
                          </IconButton>
                        </Tooltip>
                      )
                    }
                  >
                    <Box sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
                      {!noti.read_at && <UnreadIcon color="primary" sx={{ fontSize: 12 }} />}
                    </Box>
                    <ListItemText
                      primary={
                        <Typography variant="body1" fontWeight={noti.read_at ? 400 : 700}>
                          {getNotificationText(noti)}
                        </Typography>
                      }
                      secondary={
                        <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">
                            {getTimeAgo(noti.created_at)}
                          </Typography>
                          <Chip 
                            label={noti.data.type} 
                            size="small" 
                            variant="outlined" 
                            sx={{ height: 20, fontSize: '0.65rem', textTransform: 'capitalize' }} 
                          />
                        </Stack>
                      }
                    />
                  </ListItem>
                  {index < notifications.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          ) : (
            <Box sx={{ p: 8, textAlign: 'center' }}>
              <NotificationsIcon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />
              <Typography variant="h6" color="text.secondary">
                {t('notifications.noNotifications')}
              </Typography>
            </Box>
          )}
        </Paper>
      </Box>
    </MainLayout>
  );
};

export default NotificationsPage;
