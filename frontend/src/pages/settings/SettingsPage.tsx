import { authApi } from '@/api/auth';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeContext } from '@/contexts/ThemeContext';
import {
    Edit as EditIcon,
    Notifications as NotificationsIcon,
    Palette as PaletteIcon,
    Person as PersonIcon,
    Save as SaveIcon,
    Security as SecurityIcon,
} from '@mui/icons-material';
import {
    Alert,
    Avatar,
    Box,
    Button,
    Divider,
    FormControl,
    FormControlLabel,
    Grid,
    IconButton,
    InputLabel,
    MenuItem,
    Paper,
    Select,
    Snackbar,
    Stack,
    Switch,
    Tab,
    Tabs,
    TextField,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const { themeMode, setThemeMode, language, setLanguage, resolvedMode } = useThemeContext();
  const { user, refreshUser } = useAuth();
  const [tabValue, setTabValue] = useState(0);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [notificationSettings, setNotificationSettings] = useState<Record<string, boolean>>({
    attendance: true,
    leave: true,
    performance: true,
    system: true,
  });
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  useEffect(() => {
    if (user) {
      setName(user.name || user.employee?.full_name || '');
      setEmail(user.email || '');
      if (user.notification_settings) {
        setNotificationSettings(user.notification_settings);
      }
    }
  }, [user]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      await authApi.updateProfile({ name, email });
      await refreshUser();
      setSnackbar({
        open: true,
        message: t('settings.profileUpdated', 'Profile updated successfully!'),
        severity: 'success',
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || t('settings.failedToUpdateProfile', 'Failed to update profile'),
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const hasChanges = name !== (user?.name || user?.employee?.full_name || '') || 
                     email !== (user?.email || '');

  return (
    <MainLayout>
      <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          {t('settings.title')}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
          {t('settings.description')}
        </Typography>

        <Paper sx={{ width: '100%', borderRadius: 3, overflow: 'hidden' }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 2,
              borderBottom: 1,
              borderColor: 'divider',
              bgcolor: resolvedMode === 'dark' ? 'background.paper' : '#f8f9fa',
            }}
          >
            <Tab icon={<PaletteIcon />} iconPosition="start" label={t('settings.general')} />
            <Tab icon={<PersonIcon />} iconPosition="start" label={t('settings.profile')} />
            <Tab icon={<SecurityIcon />} iconPosition="start" label={t('settings.security')} />
            <Tab icon={<NotificationsIcon />} iconPosition="start" label={t('notifications.title', 'Notifications')} />
          </Tabs>

          <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* General Settings */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={4}>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    {t('settings.languageRegional')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {t('settings.languageDescription')}
                  </Typography>
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel id="language-select-label">{t('settings.language')}</InputLabel>
                    <Select
                      labelId="language-select-label"
                      value={language}
                      label={t('settings.language')}
                      onChange={(e) => setLanguage(e.target.value as string)}
                    >
                      <MenuItem value="en">🇺🇸 English</MenuItem>
                      <MenuItem value="ar">🇸🇦 العربية</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Typography variant="h6" fontWeight="600" gutterBottom>
                    {t('settings.themePreferences')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {t('settings.themeDescription')}
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel id="theme-select-label">{t('settings.theme')}</InputLabel>
                    <Select
                      labelId="theme-select-label"
                      value={themeMode}
                      label={t('settings.theme')}
                      onChange={(e) => setThemeMode(e.target.value as any)}
                    >
                      <MenuItem value="light">{t('settings.lightMode')}</MenuItem>
                      <MenuItem value="dark">{t('settings.darkMode')}</MenuItem>
                      <MenuItem value="auto">{t('settings.autoMode')}</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </TabPanel>

            {/* Profile Settings */}
            <TabPanel value={tabValue} index={1}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                <Box sx={{ position: 'relative' }}>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      mb: 2,
                      bgcolor: 'primary.main',
                      fontSize: '2rem',
                    }}
                  >
                    {user?.name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                  </Avatar>
                  <IconButton
                    sx={{
                      position: 'absolute',
                      bottom: 15,
                      right: 0,
                      bgcolor: 'background.paper',
                      boxShadow: 2,
                      '&:hover': { bgcolor: 'grey.100' },
                    }}
                    size="small"
                  >
                    <EditIcon fontSize="small" />
                  </IconButton>
                </Box>
                <Typography variant="h5" fontWeight="bold">
                  {user?.name || t('settings.user')}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user?.email}
                </Typography>
              </Box>

              <Divider sx={{ mb: 4 }} />

              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('employees.firstName') + ' ' + t('employees.lastName')}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('employees.email')}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('employees.department')}
                    defaultValue={user?.employee?.department || ''}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label={t('employees.position')}
                    defaultValue={user?.employee?.position || ''}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>
              </Grid>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  startIcon={<SaveIcon />} 
                  onClick={handleSaveProfile}
                  disabled={loading || !hasChanges}
                >
                  {loading ? t('common.loading') : t('settings.saveChanges')}
                </Button>
              </Box>
            </TabPanel>

            {/* Security Settings */}
            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                {t('settings.changePassword')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                {t('settings.passwordDescription')}
              </Typography>

              <Stack spacing={3} sx={{ maxWidth: 400 }}>
                <TextField fullWidth type="password" label={t('settings.currentPassword')} />
                <TextField fullWidth type="password" label={t('settings.newPassword')} />
                <TextField fullWidth type="password" label={t('settings.confirmPassword')} />
                
                <Box>
                  <Button variant="contained" color="primary">
                    {t('settings.updatePassword')}
                  </Button>
                </Box>
              </Stack>
            </TabPanel>

            {/* Notification Settings */}
            <TabPanel value={tabValue} index={3}>
              <Typography variant="h6" fontWeight="600" gutterBottom>
                {t('settings.notificationsTitle', 'Notification Preferences')}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                {t('settings.notificationsDescription', 'Control which alerts you want to receive. These settings will apply to your account.')}
              </Typography>

              <Stack spacing={2} divider={<Divider />}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.attendance}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, attendance: e.target.checked })}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight="500">{t('settings.attendanceAlerts', 'Attendance Alerts')}</Typography>
                      <Typography variant="body2" color="text.secondary">{t('settings.attendanceAlertsDescription', 'Receive notifications about employee clock-ins, late arrivals, and missing logs.')}</Typography>
                    </Box>
                  }
                  sx={{ py: 1, m: 0, width: '100%', justifyContent: 'space-between', flexDirection: 'row-reverse' }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.leave}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, leave: e.target.checked })}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight="500">{t('settings.leaveRequests', 'Leave Requests')}</Typography>
                      <Typography variant="body2" color="text.secondary">{t('settings.leaveRequestsDescription', 'Get notified when employees submit new leave requests or when their status changes.')}</Typography>
                    </Box>
                  }
                  sx={{ py: 1, m: 0, width: '100%', justifyContent: 'space-between', flexDirection: 'row-reverse' }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.performance}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, performance: e.target.checked })}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight="500">{t('settings.performanceReviews', 'Performance Reviews')}</Typography>
                      <Typography variant="body2" color="text.secondary">{t('settings.performanceReviewsDescription', 'Alerts for scheduled reviews, OKR progress, and goal completions.')}</Typography>
                    </Box>
                  }
                  sx={{ py: 1, m: 0, width: '100%', justifyContent: 'space-between', flexDirection: 'row-reverse' }}
                />

                <FormControlLabel
                  control={
                    <Switch
                      checked={notificationSettings.system}
                      onChange={(e) => setNotificationSettings({ ...notificationSettings, system: e.target.checked })}
                    />
                  }
                  label={
                    <Box>
                      <Typography variant="body1" fontWeight="500">{t('settings.systemNotifications', 'System Notifications')}</Typography>
                      <Typography variant="body2" color="text.secondary">{t('settings.systemNotificationsDescription', 'Important updates about platform features, security alerts, and maintenance.')}</Typography>
                    </Box>
                  }
                  sx={{ py: 1, m: 0, width: '100%', justifyContent: 'space-between', flexDirection: 'row-reverse' }}
                />
              </Stack>

              <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                <Button 
                  variant="contained" 
                  startIcon={<SaveIcon />} 
                  onClick={async () => {
                    setLoading(true);
                    try {
                      await authApi.updateNotificationSettings(notificationSettings);
                      await refreshUser();
                      setSnackbar({ open: true, message: t('settings.notificationSettingsUpdated', 'Notification settings updated!'), severity: 'success' });
                    } catch (error) {
                      setSnackbar({ open: true, message: t('settings.failedToUpdateNotificationSettings', 'Failed to update settings'), severity: 'error' });
                    } finally {
                      setLoading(false);
                    }
                  }}
                  disabled={loading}
                >
                  {loading ? t('common.loading') : t('settings.saveChanges')}
                </Button>
              </Box>
            </TabPanel>
          </Box>
        </Paper>
      </Box>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </MainLayout>
  );
};

export default SettingsPage;
