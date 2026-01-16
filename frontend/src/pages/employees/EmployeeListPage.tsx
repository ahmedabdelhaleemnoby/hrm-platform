import { Employee, employeeApi } from '@/api/employees';
import { PermissionGate } from '@/components/auth/PermissionGate';
import TableSkeleton from '@/components/common/TableSkeleton';
import MainLayout from '@/components/layout/MainLayout';
import { Add as AddIcon, Delete as DeleteIcon, Search as SearchIcon } from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Grid,
    IconButton,
    InputAdornment,
    Pagination,
    Paper,
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
import { useNavigate } from 'react-router-dom';

import { useTranslation } from 'react-i18next';

const EmployeeListPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetchEmployees();
  }, [page, search]);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const response = await employeeApi.getAll({
        page,
        per_page: 10,
        search: search || undefined,
      });
      setEmployees(response.data);
      setTotal(response.meta.total);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  };
    const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'on_leave':
        return 'warning';
      case 'suspended':
        return 'error';
      default:
        return 'default';
    }
  };

  const handleDeleteClick = (e: React.MouseEvent, employee: Employee) => {
    e.stopPropagation();
    setEmployeeToDelete(employee);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!employeeToDelete) return;
    setDeleting(true);
    try {
      await employeeApi.delete(employeeToDelete.id);
      fetchEmployees();
      setDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    } catch (error) {
      console.error('Failed to delete employee:', error);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h4" component="h1" fontWeight="bold">
            {t('employees.title', 'Employees')}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            size="large"
            onClick={() => navigate('/employees/new')}
          >
            {t('employees.addEmployee', 'Add Employee')}
          </Button>
        </Box>

        {/* Stats Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  {t('employees.total', 'Total Employees')}
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                  {total}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  {t('employees.active', 'Active')}
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="success.main">
                  {employees.filter(e => e.employment_status === 'active').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  {t('employees.onLeave', 'On Leave')}
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="warning.main">
                  {employees.filter(e => e.employment_status === 'on_leave').length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={3}>
            <Card>
              <CardContent>
                <Typography color="text.secondary" gutterBottom>
                  {t('employees.thisMonth', 'This Month')}
                </Typography>
                <Typography variant="h4" fontWeight="bold" color="primary.main">
                  0
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Search */}
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            placeholder={t('employees.searchPlaceholder', 'Search employees by name, email, or employee code...')}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Employee Table */}
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('employees.employeeCode', 'Employee Code')}</TableCell>
                <TableCell>{t('employees.fullName', 'Name')}</TableCell>
                <TableCell>{t('employees.email', 'Email')}</TableCell>
                <TableCell>{t('employees.department', 'Department')}</TableCell>
                <TableCell>{t('employees.position', 'Position')}</TableCell>
                <TableCell>{t('employees.status', 'Status')}</TableCell>
                <TableCell>{t('employees.hireDate', 'Hire Date')}</TableCell>
                <PermissionGate permissions={['view_all_salaries', 'view_dept_salaries']}>
                  <TableCell>{t('employees.salary', 'Salary')}</TableCell>
                </PermissionGate>
                <PermissionGate permissions={['manage_employees']}>
                  <TableCell align="right">{t('employees.actions', 'Actions')}</TableCell>
                </PermissionGate>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableSkeleton rows={10} columns={8} />
              ) : employees.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    {t('common.noData', 'No employees found')}
                  </TableCell>
                </TableRow>
              ) : (
                employees.map((employee) => (
                  <TableRow
                    key={employee.id}
                    hover
                    sx={{ cursor: 'pointer' }}
                    onClick={() => navigate(`/employees/${employee.id}`)}
                  >
                    <TableCell>{employee.employee_code}</TableCell>
                    <TableCell>{employee.full_name}</TableCell>
                    <TableCell>{employee.email}</TableCell>
                    <TableCell>{employee.department || '-'}</TableCell>
                    <TableCell>{employee.position || '-'}</TableCell>
                    <TableCell>
                      <Chip
                        label={employee.employment_status}
                        color={getStatusColor(employee.employment_status)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {employee.hire_date ? new Date(employee.hire_date).toLocaleDateString() : '-'}
                    </TableCell>
                    <PermissionGate permissions={['view_all_salaries', 'view_dept_salaries']}>
                      <TableCell>{employee.salary ? `$${employee.salary.toLocaleString()}` : '-'}</TableCell>
                    </PermissionGate>
                    <PermissionGate permissions={['manage_employees']}>
                      <TableCell align="right">
                        <IconButton
                          size="small"
                          color="error"
                          onClick={(e) => handleDeleteClick(e, employee)}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </TableCell>
                    </PermissionGate>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
          <Pagination 
            count={Math.ceil(total / 10)} 
            page={page} 
            onChange={(_, value: number) => setPage(value)} 
            color="primary" 
          />
        </Box>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteDialogOpen}
          onClose={() => !deleting && setDeleteDialogOpen(false)}
        >
          <DialogTitle>{t('employees.deleteTitle', 'Delete Employee')}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {t('employees.deleteConfirm', { name: employeeToDelete?.full_name })}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)} disabled={deleting}>
              {t('common.cancel', 'Cancel')}
            </Button>
            <Button 
              onClick={handleDeleteConfirm} 
              color="error" 
              variant="contained"
              disabled={deleting}
              autoFocus
            >
              {deleting ? t('employees.deleting', 'Deleting...') : t('common.delete', 'Delete')}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </MainLayout>
  );
};

export default EmployeeListPage;
