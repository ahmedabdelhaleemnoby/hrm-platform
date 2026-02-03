import { Goal, Okr, performanceApi, PerformanceSummary } from '@/api/performance';
import MainLayout from '@/components/layout/MainLayout';
import { useThemeContext } from '@/contexts/ThemeContext';
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
    LinearProgress,
    MenuItem,
    Select,
    Snackbar,
    Tab,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const PerformancePage: React.FC = () => {
  const { t } = useTranslation();
  const themeContext = useThemeContext();
  const language = themeContext?.language || 'en';
  const [selectedTab, setSelectedTab] = useState(0);
  const [okrs, setOkrs] = useState<Okr[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [summary, setSummary] = useState<PerformanceSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'objective' as 'objective' | 'key_result',
    period: 'Q1 2026',
    start_date: '',
    end_date: '',
    target_value: 100,
    priority: 'medium' as 'low' | 'medium' | 'high' | 'critical',
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchData = async () => {
    try {
      const [okrsRes, goalsRes, summaryRes] = await Promise.all([
        performanceApi.getOkrs(),
        performanceApi.getGoals(),
        performanceApi.getSummary(),
      ]);
      setOkrs(okrsRes.data);
      setGoals(goalsRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error(t('performance.failedToFetch', 'Failed to fetch performance data:'), error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateOkr = async () => {
    try {
      await performanceApi.createOkr(formData);
      setSnackbar({ open: true, message: t('performance.okrCreatedSuccess', 'OKR created successfully!'), severity: 'success' });
      setOpenDialog(false);
      fetchData();
    } catch (error: any) {
      setSnackbar({ open: true, message: error.response?.data?.message || t('common.error', 'Creation failed'), severity: 'error' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on_track': return 'success';
      case 'at_risk': return 'warning';
      case 'completed': return 'info';
      case 'not_started': return 'default';
      default: return 'error';
    }
  };

  const getStatusLabel = (status: string) => {
    return t(`performance.${status}`, status.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
  };

  const getProgressColor = (progress: number): 'success' | 'warning' | 'error' => {
    if (progress >= 70) return 'success';
    if (progress >= 40) return 'warning';
    return 'error';
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
        <Typography variant="h4" fontWeight="bold">{t('performance.title', 'Performance Management')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} size="large" onClick={() => setOpenDialog(true)}>
          {t('performance.addNewOkr', 'Add New OKR')}
        </Button>
      </Box>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={(_, val) => setSelectedTab(val)}>
          <Tab label={t('performance.okrs', 'OKRs')} />
          <Tab label={t('performance.goals', 'Goals')} />
          <Tab label={t('performance.summary', 'Summary')} />
        </Tabs>
      </Box>

      {selectedTab === 0 && (
        <>
          {/* Summary Stats */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>{t('performance.okrsTotal', 'OKRs Total')}</Typography>
                  <Typography variant="h3" fontWeight="bold">{summary?.okrs.total || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>{t('performance.onTrack', 'On Track')}</Typography>
                  <Typography variant="h3" fontWeight="bold" color="success.main">{summary?.okrs.on_track || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>{t('performance.atRisk', 'At Risk')}</Typography>
                  <Typography variant="h3" fontWeight="bold" color="warning.main">{summary?.okrs.at_risk || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>{t('performance.completed', 'Completed')}</Typography>
                  <Typography variant="h3" fontWeight="bold" color="info.main">{summary?.okrs.completed || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* OKRs Grid */}
          {okrs.length === 0 ? (
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">{t('performance.noOkrsFound', 'No OKRs found. Click "Add New OKR" to create one.')}</Typography>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {okrs.map((okr) => (
                <Grid item xs={12} md={6} lg={4} key={okr.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold" sx={{ flex: 1 }}>{okr.title}</Typography>
                        <Chip label={getStatusLabel(okr.status)} color={getStatusColor(okr.status)} size="small" />
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography variant="caption" color="text.secondary">{t('performance.progress', 'Progress')}</Typography>
                          <Typography variant="caption" fontWeight="bold">{okr.progress}%</Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={okr.progress} color={getProgressColor(okr.progress)} sx={{ height: 8, borderRadius: 1 }} />
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{okr.description || t('performance.noDescription', 'No description')}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2, borderTop: 1, borderColor: 'divider' }}>
                        <Chip label={t(`performance.priority${okr.priority.charAt(0).toUpperCase() + okr.priority.slice(1)}`, okr.priority)} size="small" variant="outlined" />
                        <Typography variant="caption" color="text.secondary">{t('performance.due', 'Due')}: {new Date(okr.end_date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {selectedTab === 1 && (
        <>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>{t('performance.totalGoals', 'Total Goals')}</Typography>
                  <Typography variant="h3" fontWeight="bold">{summary?.goals.total || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>{t('performance.inProgress', 'In Progress')}</Typography>
                  <Typography variant="h3" fontWeight="bold" color="warning.main">{summary?.goals.in_progress || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="body2" color="text.secondary" gutterBottom>{t('performance.completed', 'Completed')}</Typography>
                  <Typography variant="h3" fontWeight="bold" color="success.main">{summary?.goals.completed || 0}</Typography>
                </CardContent>
              </Card>
            </Grid>

          {goals.length === 0 ? (
            <Card sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">{t('performance.noGoalsFound', 'No goals found.')}</Typography>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {goals.map((goal) => (
                <Grid item xs={12} md={6} key={goal.id}>
                  <Card>
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" fontWeight="bold">{goal.title}</Typography>
                        <Chip label={goal.category} size="small" color="primary" variant="outlined" />
                      </Box>
                      <Box sx={{ mb: 2 }}>
                        <LinearProgress variant="determinate" value={goal.progress} color={getProgressColor(goal.progress)} sx={{ height: 8, borderRadius: 1 }} />
                        <Typography variant="caption" color="text.secondary">{goal.progress}{t('performance.completePercent', '% complete')}</Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">{goal.description || t('performance.noDescription', 'No description')}</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                        <Chip label={t(`performance.${goal.status}`, goal.status.replace('_', ' '))} size="small" color={goal.status === 'completed' ? 'success' : 'default'} />
                        <Typography variant="caption" color="text.secondary">{t('performance.target', 'Target')}: {new Date(goal.target_date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}</Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {selectedTab === 2 && (
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>{t('performance.performanceSummary', 'Performance Summary')}</Typography>
            <Grid container spacing={3} sx={{ mt: 2 }}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">{t('performance.latestReviewRating', 'Latest Review Rating')}</Typography>
                <Typography variant="h2" fontWeight="bold" color="primary.main">
                  {summary?.reviews.latest_rating?.toFixed(1) || 'N/A'}
                </Typography>
                <Typography variant="caption" color="text.secondary">{t('performance.outOfFive', 'out of 5.0')}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">{t('performance.totalReviews', 'Total Reviews')}</Typography>
                <Typography variant="h2" fontWeight="bold">{summary?.reviews.total || 0}</Typography>
              </Grid>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" color="text.secondary">{t('performance.okrCompletionRate', 'OKR Completion Rate')}</Typography>
                <Typography variant="h2" fontWeight="bold" color="success.main">
                  {summary?.okrs.total ? Math.round((summary.okrs.completed / summary.okrs.total) * 100) : 0}%
                </Typography>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Create OKR Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>{t('performance.createNewOkr', 'Create New OKR')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField fullWidth label={t('performance.titleLabel', 'Title')} value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            <TextField fullWidth label={t('performance.descriptionLabel', 'Description')} multiline rows={3} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth label={t('performance.period', 'Period')} value={formData.period} onChange={(e) => setFormData({ ...formData, period: e.target.value })} />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('performance.priority', 'Priority')}</InputLabel>
                  <Select value={formData.priority} label={t('performance.priority', 'Priority')} onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}>
                    <MenuItem value="low">{t('performance.priorityLow', 'Low')}</MenuItem>
                    <MenuItem value="medium">{t('performance.priorityMedium', 'Medium')}</MenuItem>
                    <MenuItem value="high">{t('performance.priorityHigh', 'High')}</MenuItem>
                    <MenuItem value="critical">{t('performance.priorityCritical', 'Critical')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth label={t('performance.startDate', 'Start Date')} type="date" InputLabelProps={{ shrink: true }} value={formData.start_date} onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label={t('performance.endDate', 'End Date')} type="date" InputLabelProps={{ shrink: true }} value={formData.end_date} onChange={(e) => setFormData({ ...formData, end_date: e.target.value })} />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)}>{t('common.cancel', 'Cancel')}</Button>
          <Button variant="contained" onClick={handleCreateOkr} disabled={!formData.title || !formData.start_date || !formData.end_date}>
            {t('performance.createOkrButton', 'Create OKR')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </MainLayout>
  );
};

export default PerformancePage;

