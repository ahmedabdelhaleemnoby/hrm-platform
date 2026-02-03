import { Employee, employeeApi } from '@/api/employees';
import { onboardingApi, OnboardingChecklist, OnboardingSummary, OnboardingTask, OnboardingTemplate } from '@/api/onboarding';
import MainLayout from '@/components/layout/MainLayout';
import { useThemeContext } from '@/contexts/ThemeContext';
import { Add as AddIcon, CheckCircle, Schedule, Warning } from '@mui/icons-material';
import {
    Alert,
    Autocomplete,
    Box,
    Button,
    Card,
    CardContent,
    Checkbox,
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
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
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

const categoryColors: Record<string, string> = {
  documentation: '#2196f3',
  training: '#9c27b0',
  it_setup: '#ff9800',
  orientation: '#4caf50',
  compliance: '#f44336',
  other: '#9e9e9e',
};

const OnboardingPage: React.FC = () => {
  const { t } = useTranslation();
  const themeContext = useThemeContext();
  const language = themeContext?.language || 'en';
  const [selectedTab, setSelectedTab] = useState(0);
  const [checklists, setChecklists] = useState<OnboardingChecklist[]>([]);
  const [templates, setTemplates] = useState<OnboardingTemplate[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [summary, setSummary] = useState<OnboardingSummary | null>(null);
  const [selectedChecklist, setSelectedChecklist] = useState<OnboardingChecklist | null>(null);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    employee_id: 0,
    template_id: undefined as number | undefined,
    title: '',
    start_date: '',
    target_completion_date: '',
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success'
  });

  const fetchData = async () => {
    try {
      const [checklistsRes, templatesRes, summaryRes, employeesRes] = await Promise.all([
        onboardingApi.getChecklists(),
        onboardingApi.getTemplates(),
        onboardingApi.getSummary(),
        employeeApi.getAll(),
      ]);
      setChecklists(checklistsRes.data);
      setTemplates(templatesRes.data);
      setSummary(summaryRes.data);
      setEmployees(employeesRes.data);
    } catch (error) {
      console.error(t('onboarding.failedToFetch', 'Failed to fetch onboarding data:'), error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateChecklist = async () => {
    try {
      await onboardingApi.createChecklist(formData);
      setSnackbar({ open: true, message: t('onboarding.checklistCreatedSuccess', 'Onboarding checklist created!'), severity: 'success' });
      setOpenDialog(false);
      fetchData();
    } catch (error: any) {
      setSnackbar({ open: true, message: error.response?.data?.message || t('common.failed', 'Failed'), severity: 'error' });
    }
  };

  const handleTaskToggle = async (task: OnboardingTask) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await onboardingApi.updateTask(task.id, { status: newStatus });
    
    // Refresh the selected checklist
    if (selectedChecklist) {
      const res = await onboardingApi.getChecklists({ employee_id: selectedChecklist.employee_id });
      const updated = res.data.find(c => c.id === selectedChecklist.id);
      if (updated) setSelectedChecklist(updated);
    }
    fetchData();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle color="success" />;
      case 'overdue': return <Warning color="error" />;
      default: return <Schedule color="warning" />;
    }
  };

  if (loading) {
    return <MainLayout><Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box></MainLayout>;
  }

  return (
    <MainLayout>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">{t('onboarding.title', 'Employee Onboarding')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenDialog(true)}>
          {t('onboarding.startOnboarding', 'Start Onboarding')}
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h3" fontWeight="bold">{summary?.active_checklists || 0}</Typography>
              <Typography variant="body2">{t('onboarding.activeOnboardings', 'Active Onboardings')}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h3" fontWeight="bold" color="success.main">{summary?.completed_this_month || 0}</Typography>
              <Typography variant="body2" color="text.secondary">{t('onboarding.completedThisMonth', 'Completed This Month')}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h3" fontWeight="bold" color="error.main">{summary?.overdue_checklists || 0}</Typography>
              <Typography variant="body2" color="text.secondary">{t('onboarding.overdue', 'Overdue')}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h3" fontWeight="bold">{summary?.templates_count || 0}</Typography>
              <Typography variant="body2" color="text.secondary">{t('onboarding.templates', 'Templates')}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={(_, val) => setSelectedTab(val)}>
          <Tab label={`${t('onboarding.checklists', 'Checklists')} (${checklists.length})`} />
          <Tab label={`${t('onboarding.templates', 'Templates')} (${templates.length})`} />
        </Tabs>
      </Box>

      {/* Checklists Tab */}
      {selectedTab === 0 && (
        <Grid container spacing={3}>
          <Grid item xs={12} md={selectedChecklist ? 5 : 12}>
            {checklists.length === 0 ? (
              <Card sx={{ p: 4, textAlign: 'center' }}>
                <Typography color="text.secondary">{t('onboarding.noChecklistsFound', 'No onboarding checklists yet. Click "Start Onboarding" to create one.')}</Typography>
              </Card>
            ) : (
              <Grid container spacing={2}>
                {checklists.map((checklist) => (
                  <Grid item xs={12} md={selectedChecklist ? 12 : 6} lg={selectedChecklist ? 12 : 4} key={checklist.id}>
                    <Card sx={{ cursor: 'pointer', border: selectedChecklist?.id === checklist.id ? 2 : 0, borderColor: 'primary.main' }} 
                          onClick={() => setSelectedChecklist(checklist)}>
                      <CardContent>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                          <Typography variant="h6" fontWeight="bold">{checklist.title}</Typography>
                          {getStatusIcon(checklist.status)}
                        </Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {checklist.employee?.full_name}
                        </Typography>
                        <Box sx={{ mb: 1 }}>
                          <LinearProgress variant="determinate" value={checklist.progress} color={checklist.progress >= 100 ? 'success' : 'primary'} sx={{ height: 8, borderRadius: 1 }} />
                          <Typography variant="caption" color="text.secondary">{checklist.progress}{t('onboarding.completePercent', '% complete')}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 1, borderTop: 1, borderColor: 'divider' }}>
                          <Chip label={t(`common.status.${checklist.status}`, checklist.status.replace('_', ' '))} size="small" color={checklist.status === 'completed' ? 'success' : 'default'} />
                          <Typography variant="caption" color="text.secondary">
                            {t('onboarding.due', 'Due')}: {new Date(checklist.target_completion_date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Grid>

          {/* Task Details Panel */}
          {selectedChecklist && (
            <Grid item xs={12} md={7}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">{t('onboarding.tasksFor', 'Tasks for:')} {selectedChecklist.employee?.full_name}</Typography>
                    <Button size="small" onClick={() => setSelectedChecklist(null)}>{t('common.close', 'Close')}</Button>
                  </Box>
                  <List>
                    {selectedChecklist.tasks?.map((task) => (
                      <ListItem key={task.id} disablePadding sx={{ mb: 1 }}>
                        <ListItemButton onClick={() => handleTaskToggle(task)} dense>
                          <ListItemIcon>
                            <Checkbox edge="start" checked={task.status === 'completed'} disableRipple />
                          </ListItemIcon>
                          <ListItemText
                            primary={task.title}
                            secondary={`${t('common.day', 'Day')} ${task.day_due} • ${t(`onboarding.${task.category}`, task.category.replace('_', ' '))}`}
                            sx={{ textDecoration: task.status === 'completed' ? 'line-through' : 'none' }}
                          />
                          <Chip label={t(`onboarding.${task.category}`, task.category)} size="small" sx={{ bgcolor: categoryColors[task.category], color: 'white' }} />
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          )}
        </Grid>
      )}

      {/* Templates Tab */}
      {selectedTab === 1 && (
        <Grid container spacing={3}>
          {templates.length === 0 ? (
            <Grid item xs={12}><Card sx={{ p: 4, textAlign: 'center' }}><Typography color="text.secondary">{t('onboarding.noTemplatesFound', 'No templates yet.')}</Typography></Card></Grid>
          ) : templates.map((template) => (
            <Grid item xs={12} md={4} key={template.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">{template.name}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>{template.description || t('onboarding.noDescription', 'No description')}</Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    {template.department && <Chip label={template.department} size="small" />}
                    <Chip label={`${template.duration_days} ${t('onboarding.days', 'days')}`} size="small" variant="outlined" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Create Checklist Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>{t('onboarding.startEmployeeOnboarding', 'Start Employee Onboarding')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <Autocomplete
              options={employees}
              getOptionLabel={(option) => option.full_name || ''}
              onChange={(_, value) => setFormData({ ...formData, employee_id: value?.id || 0 })}
              renderInput={(params) => <TextField {...params} label={t('onboarding.selectEmployee', 'Select Employee')} />}
            />
            <TextField fullWidth label={t('onboarding.onboardingTitle', 'Onboarding Title')} placeholder={t('onboarding.titlePlaceholder', 'e.g., New Hire Onboarding - John')} value={formData.title} 
                       onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
            <FormControl fullWidth>
              <InputLabel>{t('onboarding.templateOptional', 'Template (Optional)')}</InputLabel>
              <Select value={formData.template_id || ''} label={t('onboarding.templateOptional', 'Template (Optional)')} 
                      onChange={(e) => setFormData({ ...formData, template_id: e.target.value as number || undefined })}>
                <MenuItem value="">{t('onboarding.noneEmpty', 'None (Empty)')}</MenuItem>
                {templates.map((t) => <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>)}
              </Select>
            </FormControl>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField fullWidth label={t('onboarding.startDate', 'Start Date')} type="date" InputLabelProps={{ shrink: true }} value={formData.start_date} 
                           onChange={(e) => setFormData({ ...formData, start_date: e.target.value })} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label={t('onboarding.targetCompletion', 'Target Completion')} type="date" InputLabelProps={{ shrink: true }} value={formData.target_completion_date} 
                           onChange={(e) => setFormData({ ...formData, target_completion_date: e.target.value })} />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)}>{t('common.cancel', 'Cancel')}</Button>
          <Button variant="contained" onClick={handleCreateChecklist} 
                  disabled={!formData.employee_id || !formData.title || !formData.start_date || !formData.target_completion_date}>
            {t('onboarding.startOnboarding', 'Start Onboarding')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </MainLayout>
  );
};

export default OnboardingPage;
