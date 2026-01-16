import { leaveApi, LeaveRequest, LeaveType } from '@/api/leaves';
import MotionContainer from '@/components/common/MotionContainer';
import TableSkeleton from '@/components/common/TableSkeleton';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Add as AddIcon } from '@mui/icons-material';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Grid, MenuItem, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const MyLeavesPage: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [open, setOpen] = useState(false);
  const { control, handleSubmit, reset } = useForm({
      defaultValues: {
          leave_type_id: '',
          start_date: '',
          end_date: '',
          reason: ''
      }
  });

  const fetchLeaves = async () => {
      setLoading(true);
      try {
          const response = await leaveApi.getAll({ employee_id: user?.employee?.id });
          if(response.success) {
              setLeaves(response.data);
          }
      } catch (error) {
          console.error(error);
      } finally {
          setLoading(false);
      }
  };

  const fetchLeaveTypes = async () => {
      try {
          const response = await leaveApi.getTypes();
          if(response.success) {
              setLeaveTypes(response.data);
          }
      } catch (error) {
          console.error(error);
      }
  };

  useEffect(() => {
    if (user?.employee?.id) {
        fetchLeaves();
        fetchLeaveTypes();
    }
  }, [user]);

  const onSubmit = async (data: any) => {
      try {
          await leaveApi.create({
              ...data,
              leave_type_id: Number(data.leave_type_id)
          });
          setOpen(false);
          reset();
          fetchLeaves();
      } catch (error) {
          console.error(error);
      }
  };

  return (
    <MainLayout>
      <MotionContainer>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" fontWeight="bold">
          {t('leave.myLeaves', 'My Leaves')}
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setOpen(true)}>
            {t('leave.requestLeave', 'Request Leave')}
        </Button>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'background.default' }}>
              <TableCell>{t('leave.leaveType', 'Type')}</TableCell>
              <TableCell>{t('leave.dates', 'Dates')}</TableCell>
              <TableCell>{t('leave.reason', 'Reason')}</TableCell>
              <TableCell>{t('leave.status', 'Status')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
                <TableSkeleton rows={5} columns={4} />
            ) : leaves.map((leave) => (
              <TableRow key={leave.id} hover>
                <TableCell>
                    <Chip 
                        label={leave.leave_type?.name} 
                        size="small" 
                        sx={{ bgcolor: leave.leave_type?.color || '#e0e0e0', color: '#fff' }} 
                    />
                </TableCell>
                <TableCell>
                    {leave.start_date} &rarr; {leave.end_date}
                    <Typography variant="caption" display="block" color="text.secondary">
                        ({leave.total_days} {t('leave.days', 'days')})
                    </Typography>
                </TableCell>
                <TableCell>{leave.reason || '-'}</TableCell>
                <TableCell>
                  <Chip 
                    label={t(`leave.${leave.status}`, leave.status)} 
                    color={
                        leave.status === 'approved' ? 'success' : 
                        leave.status === 'rejected' ? 'error' : 'warning'
                    } 
                    size="small" 
                  />
                </TableCell>
              </TableRow>
            ))}
            {!loading && leaves.length === 0 && (
                <TableRow>
                     <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                        {t('leave.noHistory', 'No leave history')}
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
      </MotionContainer>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit(onSubmit)}>
            <DialogTitle>{t('leave.newRequest', 'New Leave Request')}</DialogTitle>
            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <Controller
                                name="leave_type_id"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <TextField 
                                        {...field} 
                                        select 
                                        label={t('leave.leaveType', 'Leave Type')} 
                                        fullWidth
                                    >
                                        {leaveTypes.map((type) => (
                                            <MenuItem key={type.id} value={type.id}>
                                                {type.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="start_date"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <TextField {...field} type="date" label={t('leave.startDate', 'Start Date')} fullWidth InputLabelProps={{ shrink: true }} />
                                )}
                            />
                        </Grid>
                         <Grid item xs={6}>
                            <Controller
                                name="end_date"
                                control={control}
                                rules={{ required: true }}
                                render={({ field }) => (
                                    <TextField {...field} type="date" label={t('leave.endDate', 'End Date')} fullWidth InputLabelProps={{ shrink: true }} />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
                             <Controller
                                name="reason"
                                control={control}
                                render={({ field }) => (
                                    <TextField {...field} label={t('leave.reason', 'Reason')} fullWidth multiline rows={3}  />
                                )}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => setOpen(false)}>{t('common.cancel', 'Cancel')}</Button>
                <Button type="submit" variant="contained">{t('common.submit', 'Submit')}</Button>
            </DialogActions>
        </form>
      </Dialog>
    </MainLayout>
  );
};

export default MyLeavesPage;
