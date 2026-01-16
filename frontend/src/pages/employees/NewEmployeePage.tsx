import { Employee, employeeApi } from '@/api/employees';
import MainLayout from '@/components/layout/MainLayout';
import {
    Box,
    Button,
    Card,
    CardContent,
    Container,
    Divider,
    Grid,
    MenuItem,
    TextField,
    Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const NewEmployeePage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [employee, setEmployee] = useState<Partial<Employee>>({
    employment_status: 'active',
    employment_type: 'full_time',
  });

  const handleChange = (field: keyof Employee) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmployee({ ...employee, [field]: e.target.value });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await employeeApi.create(employee);
      if (response.success) {
        navigate('/employees');
      }
    } catch (error) {
      console.error('Failed to create employee:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            Add New Employee
          </Typography>
        </Box>

        <Card>
          <CardContent sx={{ p: 4 }}>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Basic Information
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label={t('employees.firstName')}
                  value={employee.first_name || ''}
                  onChange={handleChange('first_name')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label={t('employees.lastName')}
                  value={employee.last_name || ''}
                  onChange={handleChange('last_name')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label={t('employees.email')}
                  type="email"
                  value={employee.email || ''}
                  onChange={handleChange('email')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('employees.phone')}
                  value={employee.phone || ''}
                  onChange={handleChange('phone')}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" fontWeight="bold" gutterBottom>
              Employment Details
            </Typography>
            <Grid container spacing={3} sx={{ mb: 4 }}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('employees.department')}
                  value={employee.department || ''}
                  onChange={handleChange('department')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label={t('employees.position')}
                  value={employee.position || ''}
                  onChange={handleChange('position')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Employment Status"
                  value={employee.employment_status || 'active'}
                  onChange={handleChange('employment_status' as any)}
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="on_leave">On Leave</MenuItem>
                  <MenuItem value="terminated">Terminated</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  select
                  label="Employment Type"
                  value={employee.employment_type || 'full_time'}
                  onChange={handleChange('employment_type' as any)}
                >
                  <MenuItem value="full_time">Full Time</MenuItem>
                  <MenuItem value="part_time">Part Time</MenuItem>
                  <MenuItem value="contract">Contract</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label={t('employees.hireDate')}
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={employee.hire_date || ''}
                  onChange={handleChange('hire_date')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Probation End Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={employee.probation_end_date || ''}
                  onChange={handleChange('probation_end_date')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Contract End Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={employee.contract_end_date || ''}
                  onChange={handleChange('contract_end_date')}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Salary"
                  type="number"
                  value={employee.salary || ''}
                  onChange={handleChange('salary')}
                />
              </Grid>
            </Grid>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button variant="outlined" size="large" onClick={() => navigate('/employees')}>
                {t('common.cancel')}
              </Button>
              <Button
                variant="contained"
                size="large"
                onClick={handleSave}
                disabled={loading}
              >
                {loading ? t('common.loading') : 'Save Employee'}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </MainLayout>
  );
};

export default NewEmployeePage;
