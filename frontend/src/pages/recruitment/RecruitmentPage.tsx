import { Candidate, JobApplication, JobPosting, recruitmentApi, RecruitmentSummary } from '@/api/recruitment';
import MainLayout from '@/components/layout/MainLayout';
import { Add as AddIcon, Assignment, People, Work } from '@mui/icons-material';
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
    Tab,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const getPipelineStages = (t: any) => [
  { key: 'applied', label: t('recruitment.applied', 'Applied'), color: '#9e9e9e' },
  { key: 'screening', label: t('recruitment.screening', 'Screening'), color: '#2196f3' },
  { key: 'phone_interview', label: t('recruitment.phone_interview', 'Phone Interview'), color: '#ff9800' },
  { key: 'technical_interview', label: t('recruitment.technical_interview', 'Technical'), color: '#9c27b0' },
  { key: 'onsite_interview', label: t('recruitment.onsite_interview', 'Onsite'), color: '#673ab7' },
  { key: 'offer', label: t('recruitment.offer', 'Offer'), color: '#4caf50' },
  { key: 'hired', label: t('recruitment.hired', 'Hired'), color: '#00c853' },
];

const RecruitmentPage: React.FC = () => {
  const { t } = useTranslation();
  const pipelineStages = getPipelineStages(t);
  const [selectedTab, setSelectedTab] = useState(0);
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [summary, setSummary] = useState<RecruitmentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [openJobDialog, setOpenJobDialog] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '',
    description: '',
    location: '',
    employment_type: 'full_time' as const,
    experience_level: 'mid' as const,
    department: '',
    salary_min: '',
    salary_max: '',
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success'
  });

  const fetchData = async () => {
    try {
      const [jobsRes, candidatesRes, appsRes, summaryRes] = await Promise.all([
        recruitmentApi.getJobs(),
        recruitmentApi.getCandidates(),
        recruitmentApi.getApplications(),
        recruitmentApi.getSummary(),
      ]);
      setJobs(jobsRes.data);
      setCandidates(candidatesRes.data);
      setApplications(appsRes.data);
      setSummary(summaryRes.data);
    } catch (error) {
      console.error(t('recruitment.failedToFetch', 'Failed to fetch recruitment data:'), error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateJob = async () => {
    try {
      await recruitmentApi.createJob({
        ...jobForm,
        salary_min: jobForm.salary_min ? Number(jobForm.salary_min) : undefined,
        salary_max: jobForm.salary_max ? Number(jobForm.salary_max) : undefined,
      });
      setSnackbar({ open: true, message: t('recruitment.jobCreatedSuccess', 'Job posting created!'), severity: 'success' });
      setOpenJobDialog(false);
      fetchData();
    } catch (error: any) {
      setSnackbar({ open: true, message: error.response?.data?.message || t('common.failed', 'Failed'), severity: 'error' });
    }
  };

  const handlePublishJob = async (id: number) => {
    await recruitmentApi.updateJob(id, { status: 'published' });
    fetchData();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'default';
      case 'closed': return 'error';
      default: return 'warning';
    }
  };

  if (loading) {
    return <MainLayout><Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}><CircularProgress /></Box></MainLayout>;
  }

  return (
    <MainLayout>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">{t('recruitment.title', 'Recruitment & ATS')}</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpenJobDialog(true)}>
          {t('recruitment.postJob', 'Post New Job')}
        </Button>
      </Box>

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'primary.main', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Work fontSize="large" />
                <Box>
                  <Typography variant="h3" fontWeight="bold">{summary?.open_jobs || 0}</Typography>
                  <Typography variant="body2">{t('recruitment.openPositions', 'Open Positions')}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <People fontSize="large" color="primary" />
                <Box>
                  <Typography variant="h3" fontWeight="bold">{summary?.total_candidates || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">{t('recruitment.totalCandidates', 'Total Candidates')}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Assignment fontSize="large" color="warning" />
                <Box>
                  <Typography variant="h3" fontWeight="bold">{summary?.active_applications || 0}</Typography>
                  <Typography variant="body2" color="text.secondary">{t('recruitment.activeApplications', 'Active Applications')}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'success.main', color: 'white' }}>
            <CardContent>
              <Typography variant="h3" fontWeight="bold">{summary?.hired_this_month || 0}</Typography>
              <Typography variant="body2">{t('recruitment.hiredThisMonth', 'Hired This Month')}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={selectedTab} onChange={(_, val) => setSelectedTab(val)}>
          <Tab label={`${t('recruitment.jobs', 'Jobs')} (${jobs.length})`} />
          <Tab label={`${t('recruitment.candidates', 'Candidates')} (${candidates.length})`} />
          <Tab label={`${t('recruitment.pipeline', 'Pipeline')} (${applications.length})`} />
        </Tabs>
      </Box>

      {/* Jobs Tab */}
      {selectedTab === 0 && (
        <Grid container spacing={3}>
          {jobs.length === 0 ? (
            <Grid item xs={12}><Card sx={{ p: 4, textAlign: 'center' }}><Typography color="text.secondary">{t('recruitment.noJobsFound', 'No job postings yet. Click "Post New Job" to create one.')}</Typography></Card></Grid>
          ) : jobs.map((job) => (
            <Grid item xs={12} md={6} lg={4} key={job.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">{job.title}</Typography>
                    <Chip label={t(`common.status.${job.status}`, job.status)} color={getStatusColor(job.status)} size="small" />
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>📍 {job.location}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>🏢 {job.department || t('recruitment.general', 'General')}</Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip label={t(`recruitment.${job.employment_type}`, job.employment_type.replace('_', ' '))} size="small" variant="outlined" />
                    <Chip label={t(`recruitment.${job.experience_level}`, job.experience_level)} size="small" variant="outlined" />
                  </Box>
                  {job.salary_min && job.salary_max && (
                    <Typography variant="body2" fontWeight="bold" color="primary" sx={{ mb: 2 }}>
                      ${job.salary_min.toLocaleString()} - ${job.salary_max.toLocaleString()}
                    </Typography>
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Typography variant="caption" color="text.secondary">{job.applications_count || 0} {t('recruitment.applicationsCount', 'applications')}</Typography>
                    {job.status === 'draft' && <Button size="small" onClick={() => handlePublishJob(job.id)}>{t('recruitment.publish', 'Publish')}</Button>}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Candidates Tab */}
      {selectedTab === 1 && (
        <Grid container spacing={3}>
          {candidates.length === 0 ? (
            <Grid item xs={12}><Card sx={{ p: 4, textAlign: 'center' }}><Typography color="text.secondary">{t('recruitment.noCandidatesFound', 'No candidates yet.')}</Typography></Card></Grid>
          ) : candidates.map((candidate) => (
            <Grid item xs={12} md={6} lg={4} key={candidate.id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold">{candidate.full_name}</Typography>
                  <Typography variant="body2" color="text.secondary">{candidate.email}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {candidate.current_position} {t('recruitment.at', 'at')} {candidate.current_company || 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>{candidate.years_of_experience || 0} {t('recruitment.yearsExperience', 'years experience')}</Typography>
                  <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {candidate.skills?.slice(0, 3).map((skill, idx) => (
                      <Chip key={idx} label={skill} size="small" />
                    ))}
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: 1, borderColor: 'divider' }}>
                    <Chip label={candidate.source} size="small" variant="outlined" />
                    <Typography variant="caption">{candidate.applications_count || 0} {t('recruitment.applicationsCount', 'applications')}</Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Pipeline Tab */}
      {selectedTab === 2 && (
        <Box sx={{ overflowX: 'auto' }}>
          <Box sx={{ display: 'flex', gap: 2, minWidth: 1200 }}>
            {pipelineStages.map((stage) => {
              const stageApps = applications.filter(app => app.stage === stage.key);
              return (
                <Box key={stage.key} sx={{ minWidth: 250, flex: 1 }}>
                  <Box sx={{ bgcolor: stage.color, color: 'white', p: 1.5, borderRadius: '8px 8px 0 0', display: 'flex', justifyContent: 'space-between' }}>
                    <Typography fontWeight="bold">{stage.label}</Typography>
                    <Chip label={stageApps.length} size="small" sx={{ bgcolor: 'white', color: stage.color }} />
                  </Box>
                  <Box sx={{ bgcolor: 'grey.100', p: 1, minHeight: 400, borderRadius: '0 0 8px 8px' }}>
                    {stageApps.map((app) => (
                      <Card key={app.id} sx={{ mb: 1 }}>
                        <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                          <Typography variant="body2" fontWeight="bold">{app.candidate?.full_name}</Typography>
                          <Typography variant="caption" color="text.secondary">{app.job_posting?.title}</Typography>
                          {app.rating && (
                            <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>⭐ {app.rating}/5</Typography>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                </Box>
              );
            })}
          </Box>
        </Box>
      )}

      {/* Create Job Dialog */}
      <Dialog open={openJobDialog} onClose={() => setOpenJobDialog(false)} fullWidth maxWidth="md">
        <DialogTitle>{t('recruitment.postJob', 'Post New Job')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField fullWidth label={t('recruitment.jobTitle', 'Job Title')} value={jobForm.title} onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })} />
            <TextField fullWidth label={t('recruitment.description', 'Description')} multiline rows={4} value={jobForm.description} onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })} />
            <Grid container spacing={2}>
              <Grid item xs={6}><TextField fullWidth label={t('recruitment.location', 'Location')} value={jobForm.location} onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })} /></Grid>
              <Grid item xs={6}><TextField fullWidth label={t('recruitment.department', 'Department')} value={jobForm.department} onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })} /></Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('recruitment.employmentType', 'Employment Type')}</InputLabel>
                  <Select value={jobForm.employment_type} label={t('recruitment.employmentType', 'Employment Type')} onChange={(e) => setJobForm({ ...jobForm, employment_type: e.target.value as any })}>
                    <MenuItem value="full_time">{t('recruitment.full_time', 'Full Time')}</MenuItem>
                    <MenuItem value="part_time">{t('recruitment.part_time', 'Part Time')}</MenuItem>
                    <MenuItem value="contract">{t('recruitment.contract', 'Contract')}</MenuItem>
                    <MenuItem value="internship">{t('recruitment.internship', 'Internship')}</MenuItem>
                    <MenuItem value="remote">{t('recruitment.remote', 'Remote')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel>{t('recruitment.experienceLevel', 'Experience Level')}</InputLabel>
                  <Select value={jobForm.experience_level} label={t('recruitment.experienceLevel', 'Experience Level')} onChange={(e) => setJobForm({ ...jobForm, experience_level: e.target.value as any })}>
                    <MenuItem value="entry">{t('recruitment.entry', 'Entry')}</MenuItem>
                    <MenuItem value="mid">{t('recruitment.mid', 'Mid')}</MenuItem>
                    <MenuItem value="senior">{t('recruitment.senior', 'Senior')}</MenuItem>
                    <MenuItem value="lead">{t('recruitment.lead', 'Lead')}</MenuItem>
                    <MenuItem value="executive">{t('recruitment.executive', 'Executive')}</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={6}><TextField fullWidth label={t('recruitment.minSalary', 'Min Salary')} type="number" value={jobForm.salary_min} onChange={(e) => setJobForm({ ...jobForm, salary_min: e.target.value })} /></Grid>
              <Grid item xs={6}><TextField fullWidth label={t('recruitment.maxSalary', 'Max Salary')} type="number" value={jobForm.salary_max} onChange={(e) => setJobForm({ ...jobForm, salary_max: e.target.value })} /></Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenJobDialog(false)}>{t('common.cancel', 'Cancel')}</Button>
          <Button variant="contained" onClick={handleCreateJob} disabled={!jobForm.title || !jobForm.description || !jobForm.location}>
            {t('recruitment.createJob', 'Create Job')}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>{snackbar.message}</Alert>
      </Snackbar>
    </MainLayout>
  );
};

export default RecruitmentPage;
