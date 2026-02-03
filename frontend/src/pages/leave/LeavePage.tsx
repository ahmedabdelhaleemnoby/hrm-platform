import { leaveApi, LeaveRequest, LeaveType } from '@/api/leaves';
import MainLayout from '@/components/layout/MainLayout';
import { Add as AddIcon } from '@mui/icons-material';
import {
    Alert,
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Snackbar,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';

import { useThemeContext } from '@/contexts/ThemeContext';
import { useTranslation } from 'react-i18next';

const LeavePage: React.FC = () => {
  const { t } = useTranslation();
  const themeContext = useThemeContext();
  const language = themeContext?.language || 'en';
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [types, setTypes] = useState<LeaveType[]>([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    leave_type_id: '',
    start_date: '',
    end_date: '',
    reason: '',
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchData = async () => {
    try {
      const [requestsRes, typesRes] = await Promise.all([
        leaveApi.getAll(),
        leaveApi.getTypes(),
      ]);
      setRequests(requestsRes.data);
      setTypes(typesRes.data);
    } catch (error) {
      console.error(t('leave.failedToFetch', 'Failed to fetch leave data:'), error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      await leaveApi.create({
        leave_type_id: Number(formData.leave_type_id),
        start_date: formData.start_date,
        end_date: formData.end_date,
        reason: formData.reason,
      });
      setSnackbar({ open: true, message: t('leave.requestSubmitted', 'Leave request submitted!'), severity: 'success' });
      handleCloseDialog();
      fetchData();
    } catch (error: any) {
      setSnackbar({ 
        open: true, 
        message: error.response?.data?.message || t('leave.failedToSubmit', 'Failed to submit request'), 
        severity: 'error' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'error';
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

  return (
    <MainLayout>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">{t('leave.myLeaveRequests', 'My Leave Requests')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} size="large" onClick={handleOpenDialog}>
          {t('leave.requestLeave', 'Request Leave')}
        </Button>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={7}>
          {requests.length === 0 ? (
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">{t('leave.noHistory', 'No leave requests found.')}</Typography>
            </Card>
          ) : (
            requests.map((request) => (
              <Card key={request.id} sx={{ mb: 3 }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Chip
                      label={request.leave_type?.name}
                      sx={{
                        bgcolor: `${request.leave_type?.color || '#667eea'}20`,
                        color: request.leave_type?.color || '#667eea',
                        fontWeight: 600,
                      }}
                    />
                    <Chip label={t(`leave.${request.status}`, request.status.toUpperCase())} color={getStatusColor(request.status)} size="small" />
                  </Box>

                  <Box sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      📅 {new Date(request.start_date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')} - {new Date(request.end_date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ({request.total_days} {t('leave.days', 'days')})
                    </Typography>
                  </Box>

                  <Typography variant="body2" color="text.secondary">
                    <strong>{t('leave.reason', 'Reason')}:</strong> {request.reason || 'N/A'}
                  </Typography>

                  {request.rejection_reason && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'error.light', borderRadius: 1 }}>
                      <Typography variant="caption" color="error.contrastText">
                        <strong>{t('leave.rejectionReason', 'Rejection Reason')}:</strong> {request.rejection_reason}
                      </Typography>
                    </Box>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </Grid>

        <Grid item xs={12} lg={5}>
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>Leave Types</Typography>
              <Box sx={{ mt: 2 }}>
                {types.map((type) => (
                  <Box key={type.id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: type.color }} />
                      <Typography variant="body2">{type.name}</Typography>
                    </Box>
                    <Typography variant="caption" color="text.secondary">{t('leave.maxDaysPerYear', { count: type.max_days_per_year as any })}</Typography>
                  </Box>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Request Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
        <DialogTitle>{t('leave.newRequest', 'Request New Leave')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <FormControl fullWidth>
              <InputLabel>{t('leave.leaveType', 'Leave Type')}</InputLabel>
              <Select
                value={formData.leave_type_id}
                label={t('leave.leaveType', 'Leave Type')}
                onChange={(e) => setFormData({ ...formData, leave_type_id: e.target.value })}
              >
                {types.map((type) => (
                  <MenuItem key={type.id} value={type.id}>{type.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={t('leave.startDate', 'Start Date')}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  label={t('leave.endDate', 'End Date')}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                />
              </Grid>
            </Grid>
            <TextField
              fullWidth
              label={t('leave.reason', 'Reason')}
              multiline
              rows={4}
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog}>{t('common.cancel', 'Cancel')}</Button>
          <Button 
            variant="contained" 
            onClick={handleSubmit} 
            disabled={submitting || !formData.leave_type_id || !formData.start_date || !formData.end_date}
          >
            {submitting ? <CircularProgress size={24} /> : t('leave.submitRequest', 'Submit Request')}
          </Button>
        </DialogActions>
      </Dialog>

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

export default LeavePage;
