import { Employee, employeeApi } from '@/api/employees';
import { PermissionGate } from '@/components/auth/PermissionGate';
import AvatarUpload from '@/components/employees/AvatarUpload';
import DocumentManager from '@/components/employees/DocumentManager';
import MainLayout from '@/components/layout/MainLayout';
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Email as EmailIcon,
    LocationOn as LocationOnIcon,
    Phone as PhoneIcon
} from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Divider,
    Grid,
    Tab,
    Tabs,
    TextField,
    Typography
} from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';

const EmployeeProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedTab, setSelectedTab] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [editedEmployee, setEditedEmployee] = useState<Partial<Employee>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchEmployee = useCallback(async () => {
    if (!id) return;
    try {
      const response = await employeeApi.getById(parseInt(id));
      if (response.success) {
        setEmployee(response.data);
        setEditedEmployee(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch employee:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    setDeleting(true);
    try {
      const response = await employeeApi.delete(parseInt(id));
      if (response.success) {
        navigate('/employees');
      }
    } catch (error) {
      console.error('Failed to delete employee:', error);
    } finally {
      setDeleting(false);
    }
  };

  const handleSave = async () => {
    if (!id || !employee) return;
    setSaving(true);
    try {
      const response = await employeeApi.update(parseInt(id), editedEmployee);
      if (response.success) {
        setEmployee({ ...employee, ...editedEmployee } as Employee);
        setIsEditing(false);
      }
    } catch (error) {
      console.error('Failed to update employee:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (field: keyof Employee) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedEmployee({ ...editedEmployee, [field]: e.target.value });
  };

  useEffect(() => {
    fetchEmployee();
  }, [fetchEmployee]);

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  if (!employee) {
    return (
      <MainLayout>
        <Typography variant="h5" sx={{ textAlign: 'center', py: 8 }}>
          Employee not found
        </Typography>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <Grid container spacing={3}>
        {/* Left Sidebar - Profile Card */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              {/* Profile Photo */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <AvatarUpload
                  employeeId={employee.id}
                  currentAvatarUrl={employee.avatar_url}
                  fullName={employee.full_name}
                  onUploadSuccess={(newUrl) => {
                    setEmployee({ ...employee, avatar_url: newUrl });
                  }}
                />
              </Box>

              {/* Basic Info */}
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography variant="h5" fontWeight="bold">
                  {employee.full_name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {t('employees.hireDate')}: {employee.hire_date || 'N/A'}
                </Typography>
                <Chip 
                  label={employee.employment_status} 
                  color={employee.employment_status === 'active' ? 'success' : 'default'} 
                  size="small" 
                  sx={{ mt: 1, textTransform: 'capitalize' }} 
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Probation End
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {employee.probation_end_date || 'N/A'}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="text.secondary">
                    Contract End
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {employee.contract_end_date || 'N/A'}
                  </Typography>
                </Grid>
              </Grid>

              <Divider sx={{ my: 2 }} />

              {/* Department & Position */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  {t('employees.department')}
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {employee.department || 'N/A'}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="caption" color="text.secondary">
                  {t('employees.position')}
                </Typography>
                <Typography variant="body1" fontWeight={500}>
                  {employee.position || 'N/A'}
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Contact Information */}
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <EmailIcon fontSize="small" color="action" />
                  <Typography variant="body2">{employee.email}</Typography>
                </Box>
                {employee.phone && (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <PhoneIcon fontSize="small" color="action" />
                    <Typography variant="body2">{employee.phone}</Typography>
                  </Box>
                )}
                {employee.address && (
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1 }}>
                    <LocationOnIcon fontSize="small" color="action" />
                    <Typography variant="body2">{employee.address}</Typography>
                  </Box>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Action Buttons */}
              <Button
                fullWidth
                variant="contained"
                startIcon={<EditIcon />}
                onClick={() => setIsEditing(!isEditing)}
                sx={{ mb: 1 }}
              >
                {isEditing ? t('common.cancel') : t('common.edit')}
              </Button>

              {!isEditing && (
                <PermissionGate permissions={['manage_employees']}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setDeleteDialogOpen(true)}
                  >
                    {t('common.delete')}
                  </Button>
                </PermissionGate>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Right Content - Tabbed Interface */}
        <Grid item xs={12} md={8}>
          <Card>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', px: 3, pt: 2 }}>
              <Tabs value={selectedTab} onChange={(_, val) => setSelectedTab(val)}>
                <Tab label={t('settings.profile')} />
                <Tab label={t('common.documents')} />
                <Tab label={t('common.performance')} />
              </Tabs>
            </Box>

            <CardContent sx={{ p: 3 }}>
              {/* Personal Info Tab */}
              {selectedTab === 0 && (
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {t('settings.profile')}
                  </Typography>
                  <Grid container spacing={3} sx={{ mt: 1 }}>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label={t('employees.firstName')}
                        value={editedEmployee.first_name || ''}
                        onChange={handleChange('first_name')}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label={t('employees.lastName')}
                        value={editedEmployee.last_name || ''}
                        onChange={handleChange('last_name')}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label={t('employees.email')}
                        value={editedEmployee.email || ''}
                        onChange={handleChange('email')}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label={t('employees.phone')}
                        value={editedEmployee.phone || ''}
                        onChange={handleChange('phone')}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Address"
                        value={editedEmployee.address || ''}
                        onChange={handleChange('address')}
                        disabled={!isEditing}
                        multiline
                        rows={3}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Probation End Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={editedEmployee.probation_end_date || ''}
                        onChange={handleChange('probation_end_date')}
                        disabled={!isEditing}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Contract End Date"
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={editedEmployee.contract_end_date || ''}
                        onChange={handleChange('contract_end_date')}
                        disabled={!isEditing}
                      />
                    </Grid>
                  </Grid>

                  {isEditing && (
                    <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                      <Button 
                        variant="contained" 
                        size="large" 
                        onClick={handleSave}
                        disabled={saving}
                      >
                        {saving ? t('common.loading') : t('common.save')}
                      </Button>
                      <Button variant="outlined" size="large" onClick={() => setIsEditing(false)}>
                        {t('common.cancel')}
                      </Button>
                    </Box>
                  )}
                </Box>
              )}

              {/* Documents Tab */}
              {selectedTab === 1 && (
                <DocumentManager 
                  employeeId={employee.id} 
                  documents={employee.documents || []} 
                  onUpdate={fetchEmployee}
                />
              )}

              {/* Performance Tab */}
              {selectedTab === 2 && (
                <Box>
                  <Typography variant="h6" fontWeight="bold" gutterBottom>
                    {t('common.performance')}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Performance data will be displayed here.
                  </Typography>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => !deleting && setDeleteDialogOpen(false)}
      >
        <DialogTitle>{t('common.delete')} Employee</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t('common.confirmDelete')}
            <br />
            <strong>{employee?.full_name}</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
            {t('common.cancel')}
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            disabled={deleting}
            autoFocus
          >
            {deleting ? t('common.loading') : t('common.delete')}
          </Button>
        </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default EmployeeProfilePage;
