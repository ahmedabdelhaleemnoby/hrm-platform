import { payrollApi, PayrollPeriod, PayrollRecord } from '@/api/payroll';
import MainLayout from '@/components/layout/MainLayout';
import { useThemeContext } from '@/contexts/ThemeContext';
import {
    Alert,
    Avatar,
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
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const PayrollPage: React.FC = () => {
  const { t } = useTranslation();
  const { language } = useThemeContext();
  const [periods, setPeriods] = useState<PayrollPeriod[]>([]);
  const [records, setRecords] = useState<PayrollRecord[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<number | ''>('');
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    working_days: 22,
  });
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const fetchData = async () => {
    try {
      const periodsRes = await payrollApi.getPeriods();
      setPeriods(periodsRes.data);
      
      if (periodsRes.data.length > 0) {
        const firstPeriod = periodsRes.data[0];
        setSelectedPeriod(firstPeriod.id);
        const recordsRes = await payrollApi.getRecords({ period_id: firstPeriod.id });
        setRecords(recordsRes.data);
      }
    } catch (error) {
      console.error(t('common.error', 'Failed to fetch payroll data:'), error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handlePeriodChange = async (periodId: number) => {
    setSelectedPeriod(periodId);
    const recordsRes = await payrollApi.getRecords({ period_id: periodId });
    setRecords(recordsRes.data);
  };

  const handleCalculate = async () => {
    if (!selectedPeriod) return;
    setCalculating(true);
    try {
      const res = await payrollApi.calculate(selectedPeriod);
      setSnackbar({ open: true, message: res.message, severity: 'success' });
      fetchData();
    } catch (error: any) {
      setSnackbar({ open: true, message: error.response?.data?.message || t('payroll.calculationFailed', 'Calculation failed'), severity: 'error' });
    } finally {
      setCalculating(false);
    }
  };

  const handleCreatePeriod = async () => {
    try {
      await payrollApi.createPeriod(formData);
      setSnackbar({ open: true, message: t('payroll.creationSuccess', 'Period created successfully!'), severity: 'success' });
      setOpenDialog(false);
      fetchData();
    } catch (error: any) {
      setSnackbar({ open: true, message: error.response?.data?.message || t('payroll.creationFailed', 'Creation failed'), severity: 'error' });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft': return 'default';
      case 'approved': return 'success';
      case 'paid': return 'info';
      case 'processing': return 'warning';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(language === 'ar' ? 'ar-EG' : 'en-US', {
      style: 'currency',
      currency: language === 'ar' ? 'EGP' : 'USD', // Assuming currency change, or keep USD if fixed
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const currentPeriod = periods.find(p => p.id === selectedPeriod);
  const totalGross = currentPeriod?.total_gross || records.reduce((acc, r) => acc + Number(r.gross_salary), 0);
  const totalDeductions = currentPeriod?.total_deductions || records.reduce((acc, r) => acc + Number(r.total_deductions), 0);
  const totalNet = currentPeriod?.total_net || records.reduce((acc, r) => acc + Number(r.net_salary), 0);

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
        <Typography variant="h4" fontWeight="bold">{t('payroll.management', 'Payroll Management')}</Typography>
        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>{t('payroll.period', 'Period')}</InputLabel>
            <Select
              value={selectedPeriod}
              label={t('payroll.period', 'Period')}
              onChange={(e) => handlePeriodChange(Number(e.target.value))}
            >
              {periods.map((period) => (
                <MenuItem key={period.id} value={period.id}>{period.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button variant="outlined" onClick={() => setOpenDialog(true)}>+ {t('payroll.newPeriod', 'New Period')}</Button>
          <Button 
            variant="contained" 
            onClick={handleCalculate} 
            disabled={!selectedPeriod || calculating}
          >
            {calculating ? <CircularProgress size={24} color="inherit" /> : t('payroll.calculate', 'Calculate Payroll')}
          </Button>
        </Box>
      </Box>

      {/* Status Indicator */}
      {currentPeriod && (
        <Box sx={{ mb: 3 }}>
          <Chip
            label={`${t(`common.status.${currentPeriod.status}`, currentPeriod.status.toUpperCase())} - ${currentPeriod.name}`}
            color={getStatusColor(currentPeriod.status)}
            sx={{ fontWeight: 600, px: 2, py: 0.5 }}
          />
        </Box>
      )}

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>{t('payroll.totalGross', 'Total Gross')}</Typography>
              <Typography variant="h4" fontWeight="bold">{formatCurrency(totalGross)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>{t('payroll.totalDeductions', 'Total Deductions')}</Typography>
              <Typography variant="h4" fontWeight="bold">{formatCurrency(totalDeductions)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>{t('payroll.netPayable', 'Net Payable')}</Typography>
              <Typography variant="h4" fontWeight="bold" color="primary">{formatCurrency(totalNet)}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>{t('payroll.employeesProcessed', 'Employees Processed')}</Typography>
              <Typography variant="h4" fontWeight="bold">{records.length}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Payroll Table */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>{t('payroll.records', 'Payroll Records')}</Typography>
          {records.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">{t('payroll.noRecords', 'No payroll records for this period. Click "Calculate Payroll" to generate.')}</Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t('leave.employee', 'Employee')}</TableCell>
                    <TableCell align="right">{t('payroll.basicSalary', 'Basic Salary')}</TableCell>
                    <TableCell align="right">{t('payroll.allowances', 'Allowances')}</TableCell>
                    <TableCell align="right">{t('payroll.totalGross', 'Gross')}</TableCell>
                    <TableCell align="right">{t('payroll.deductions', 'Deductions')}</TableCell>
                    <TableCell align="right">{t('payroll.netSalary', 'Net Salary')}</TableCell>
                    <TableCell>{t('common.status', 'Status')}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {records.map((record) => (
                    <TableRow key={record.id} hover>
                      <TableCell>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                          <Avatar sx={{ bgcolor: 'primary.main', width: 32, height: 32 }}>
                            {record.employee?.full_name?.charAt(0) || '?'}
                          </Avatar>
                          <Typography variant="body2" fontWeight={500}>
                            {record.employee?.full_name || `Employee #${record.employee_id}`}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell align="right">{formatCurrency(Number(record.basic_salary))}</TableCell>
                      <TableCell align="right" sx={{ color: 'success.main' }}>+{formatCurrency(Number(record.allowances))}</TableCell>
                      <TableCell align="right">{formatCurrency(Number(record.gross_salary))}</TableCell>
                      <TableCell align="right" sx={{ color: 'error.main' }}>-{formatCurrency(Number(record.total_deductions))}</TableCell>
                      <TableCell align="right">
                        <Typography variant="body2" fontWeight="bold">{formatCurrency(Number(record.net_salary))}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={record.status} color={getStatusColor(record.status)} size="small" />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Create Period Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>{t('payroll.createPeriod', 'Create New Payroll Period')}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 1 }}>
            <TextField
              fullWidth
              label={t('payroll.periodName', 'Period Name')}
              placeholder="e.g., January 2026"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
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
              label={t('payroll.workingDays', 'Working Days')}
              type="number"
              value={formData.working_days}
              onChange={(e) => setFormData({ ...formData, working_days: Number(e.target.value) })}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenDialog(false)}>{t('common.cancel', 'Cancel')}</Button>
          <Button 
            variant="contained" 
            onClick={handleCreatePeriod} 
            disabled={!formData.name || !formData.start_date || !formData.end_date}
          >
            {t('payroll.create', 'Create Period')}
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

export default PayrollPage;

