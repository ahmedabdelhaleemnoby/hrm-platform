import { Attendance, attendanceApi } from '@/api/attendance';
import StatCard from '@/components/common/StatCard';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import {
    AccessTime as AccessTimeIcon,
    LocationOn as LocationOnIcon,
} from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Grid,
    Snackbar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import { useThemeContext } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const AttendancePage: React.FC = () => {
  const { t } = useTranslation();
  const themeContext = useThemeContext();
  const language = themeContext?.language || 'en';
  useAuth(); // Removed empty pattern destructuring
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [clockLoading, setClockLoading] = useState(false);
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchAttendance = async () => {
    try {
      const response = await attendanceApi.getAll();
      setAttendances(response.data);
    } catch (error) {
      console.error('Failed to fetch attendance:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const todayRecord = attendances.find(
    (r) => new Date(r.record_date).toDateString() === new Date().toDateString()
  );

  const isClockedIn = !!todayRecord?.clock_in_time && !todayRecord?.clock_out_time;
  const isClockedOut = !!todayRecord?.clock_out_time;

  const handleClockAction = async () => {
    setClockLoading(true);
    try {
      if (!isClockedIn && !isClockedOut) {
        await attendanceApi.clockIn();
        setSnackbar({ open: true, message: t('attendance.clockedInSuccess', 'Clocked in successfully!'), severity: 'success' });
      } else if (isClockedIn) {
        await attendanceApi.clockOut();
        setSnackbar({ open: true, message: t('attendance.clockedOutSuccess', 'Clocked out successfully!'), severity: 'success' });
      }
      fetchAttendance();
    } catch (error: any) {
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || 'Action failed', 
        severity: 'error' 
      });
    } finally {
      setClockLoading(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
  };

  const getStatusChipColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'present': return 'success';
      case 'late': return 'warning';
      case 'absent': return 'error';
      case 'on_leave': return 'info';
      default: return 'default';
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box>
      </MainLayout>
    );
  }

  // Calculate stats from real data (last 30 days)
  const totalHours = attendances.reduce((acc, curr) => acc + (parseFloat(curr.total_hours?.toString() || '0')), 0);
  const overtimeHours = attendances.reduce((acc, curr) => acc + (parseFloat(curr.overtime_hours?.toString() || '0')), 0);

  return (
    <MainLayout>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">{t('attendance.pageTitle')}</Typography>
        <Typography variant="body2" color="text.secondary">
          {new Date().toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </Typography>
      </Box>

      {/* Clock In/Out Card */}
      <Card sx={{ mb: 4, bgcolor: 'primary.main', color: 'white' }}>
        <CardContent sx={{ p: 4 }}>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" fontWeight="bold" sx={{ mb: 1 }}>{formatTime(currentTime)}</Typography>
              <Box display="flex" alignItems="center" gap={1} sx={{ mb: 2 }}>
                <LocationOnIcon fontSize="small" />
                <Typography variant="body2">{t('attendance.currentOffice')}: Head Office</Typography>
              </Box>
              <Typography variant="body2" sx={{ opacity: 0.8 }}>
                {isClockedIn ? `${t('attendance.workingSince')} ${new Date(todayRecord!.clock_in_time!).toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US')}` : 
                 isClockedOut ? `${t('attendance.shiftEndedAt')} ${new Date(todayRecord!.clock_out_time!).toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US')}` : 
                 t('attendance.notClockedIn')}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6} sx={{ textAlign: { md: 'right' } }}>
              <Button
                variant="contained"
                size="large"
                disabled={isClockedOut || clockLoading}
                onClick={handleClockAction}
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  px: 6,
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  '&:hover': { bgcolor: 'grey.100' },
                  '&.Mui-disabled': { bgcolor: 'rgba(255,255,255,0.3)', color: 'white' }
                }}
              >
                {clockLoading ? <CircularProgress size={24} color="inherit" /> : 
                 isClockedOut ? t('attendance.shiftCompleted') : 
                 isClockedIn ? t('attendance.clockOut') : t('attendance.clockIn')}
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Stats Row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title={t('attendance.totalHours')} value={`${totalHours.toFixed(1)}h`} icon={<AccessTimeIcon fontSize="large" />} color="primary" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title={t('attendance.overtime')} value={`${overtimeHours.toFixed(1)}h`} icon={<AccessTimeIcon fontSize="large" />} color="warning" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <StatCard title={t('attendance.daysPresent')} value={attendances.length.toString()} icon={<AccessTimeIcon fontSize="large" />} color="success" />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Card>
            <CardContent>
              <Typography color="text.secondary" gutterBottom>{t('attendance.statusLabel')}</Typography>
              <Chip 
                label={isClockedIn ? t('attendance.statusActive') : isClockedOut ? t('attendance.statusOffDuty') : t('attendance.statusInactive')} 
                color={isClockedIn ? 'success' : 'default'} 
                sx={{ mt: 1, fontWeight: 600 }} 
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Attendance Records Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>{t('attendance.recentRecords')}</Typography>
          <TableContainer sx={{ mt: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('attendance.date')}</TableCell>
                  <TableCell>{t('attendance.clockIn')}</TableCell>
                  <TableCell>{t('attendance.clockOut')}</TableCell>
                  <TableCell>{t('attendance.totalHours')}</TableCell>
                  <TableCell>{t('attendance.statusLabel')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {attendances.map((record) => (
                  <TableRow key={record.id} hover>
                    <TableCell>{new Date(record.record_date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}</TableCell>
                    <TableCell>{record.clock_in_time ? new Date(record.clock_in_time).toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US') : '-'}</TableCell>
                    <TableCell>{record.clock_out_time ? new Date(record.clock_out_time).toLocaleTimeString(language === 'ar' ? 'ar-EG' : 'en-US') : '-'}</TableCell>
                    <TableCell>{record.total_hours ? `${record.total_hours}h` : '-'}</TableCell>
                    <TableCell>
                      <Chip label={record.status} color={getStatusChipColor(record.status)} size="small" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </MainLayout>
  );
};

export default AttendancePage;
