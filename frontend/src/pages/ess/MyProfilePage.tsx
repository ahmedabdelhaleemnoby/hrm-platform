import { Employee, employeeApi } from '@/api/employees';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, Box, Chip, Divider, Grid, Paper, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const MyProfilePage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [employee, setEmployee] = useState<Employee | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (user?.employee?.id) {
        try {
            const response = await employeeApi.getById(user.employee.id);
            if(response.success) {
                setEmployee(response.data);
            }
        } catch (error) {
            console.error(error);
        }
      }
    };
    fetchProfile();
  }, [user]);

  if (!employee) {
    return (
        <MainLayout>
            <Typography>Loading...</Typography>
        </MainLayout>
    )
  }

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          {t('My Profile')}
        </Typography>
      </Box>

      <Paper sx={{ p: 4, borderRadius: 2 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Avatar
              src={employee.avatar_url || undefined}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
            />
            <Typography variant="h5" fontWeight="bold">{employee.full_name}</Typography>
            <Typography variant="body1" color="text.secondary">{employee.position}</Typography>
            <Chip 
              label={t(employee.employment_status || 'Active')} 
              color="success" 
              sx={{ mt: 1 }} 
            />
          </Grid>

          <Grid item xs={12} md={8}>
            <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>{t('Personal Information')}</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">{t('Email')}</Typography>
                        <Typography>{employee.email}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">{t('Phone')}</Typography>
                        <Typography>{employee.phone || '-'}</Typography>
                    </Grid>
                </Grid>
            </Box>
            <Divider sx={{ my: 2 }} />
             <Box sx={{ mb: 3 }}>
                <Typography variant="h6" sx={{ mb: 2 }}>{t('Employment Details')}</Typography>
                <Grid container spacing={2}>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">{t('Department')}</Typography>
                        <Typography>{employee.department}</Typography>
                    </Grid>
                    <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">{t('Employee Code')}</Typography>
                        <Typography>{employee.employee_code}</Typography>
                    </Grid>
                     <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary">{t('Join Date')}</Typography>
                        <Typography>{employee.hire_date}</Typography>
                    </Grid>
                </Grid>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </MainLayout>
  );
};

export default MyProfilePage;
