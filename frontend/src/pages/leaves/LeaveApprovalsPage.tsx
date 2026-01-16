import { leaveApi, LeaveRequest } from '@/api/leaves';
import MotionContainer from '@/components/common/MotionContainer';
import TableSkeleton from '@/components/common/TableSkeleton';
import MainLayout from '@/components/layout/MainLayout';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { Box, Button, Chip, Dialog, DialogActions, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LeaveApprovalsPage: React.FC = () => {
  const { t } = useTranslation();
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);
  const [rejectDialog, setRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
        const response = await leaveApi.getAll({ view_team: true });
        if(response.success) {
            // Filter only pending requests for the main view, or show all with pending first
            // For an "Approvals" page, only Pending makes sense to focus on
            const pending = response.data.filter((r: LeaveRequest) => r.status === 'pending');
            setRequests(pending);
        }
    } catch (error) {
        console.error(error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleApprove = async (id: number) => {
      if(!window.confirm(t('leave.approveConfirm', 'Are you sure you want to approve this request?'))) return;
      try {
          await leaveApi.update(id, { status: 'approved' });
          fetchRequests();
      } catch (error) {
          console.error(error);
      }
  };

  const handleRejectClick = (request: LeaveRequest) => {
      setSelectedRequest(request);
      setRejectDialog(true);
  };

  const handleRejectConfirm = async () => {
      if(!selectedRequest) return;
      try {
          await leaveApi.update(selectedRequest.id, { 
              status: 'rejected', 
              rejection_reason: rejectReason 
          });
          setRejectDialog(false);
          setRejectReason('');
          setSelectedRequest(null);
          fetchRequests();
      } catch (error) {
          console.error(error);
      }
  };

  return (
    <MainLayout>
      <MotionContainer>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          {t('leave.approvals', 'Leave Approvals')}
        </Typography>
        <Typography variant="body1" color="text.secondary">
            {t('leave.approvalsSubtitle', 'Manage leave requests from your team')}
        </Typography>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'background.default' }}>
              <TableCell>{t('leave.employee', 'Employee')}</TableCell>
              <TableCell>{t('leave.leaveType', 'Type')}</TableCell>
              <TableCell>{t('leave.dates', 'Dates')}</TableCell>
              <TableCell>{t('leave.reason', 'Reason')}</TableCell>
              <TableCell>{t('employees.actions', 'Actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
                <TableSkeleton rows={5} columns={5} />
            ) : requests.map((request) => (
              <TableRow key={request.id} hover>
                <TableCell>
                    <Typography fontWeight="bold">{request.employee?.full_name}</Typography>
                </TableCell>
                <TableCell>
                    <Chip 
                        label={request.leave_type?.name} 
                        size="small" 
                        sx={{ bgcolor: request.leave_type?.color || '#e0e0e0', color: '#fff' }} 
                    />
                </TableCell>
                <TableCell>
                    {request.start_date} &rarr; {request.end_date}
                    <Typography variant="caption" display="block" color="text.secondary">
                        ({request.total_days} {t('leave.days', 'days')})
                    </Typography>
                </TableCell>
                <TableCell>{request.reason || '-'}</TableCell>
                <TableCell>
                  <Button 
                    variant="contained" 
                    color="success" 
                    size="small" 
                    startIcon={<CheckIcon />}
                    onClick={() => handleApprove(request.id)}
                    sx={{ mr: 1 }}
                  >
                      {t('leave.approveAction', 'Approve')}
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    size="small" 
                    startIcon={<CloseIcon />}
                    onClick={() => handleRejectClick(request)}
                  >
                      {t('leave.rejectAction', 'Reject')}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {!loading && requests.length === 0 && (
                <TableRow>
                     <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                        {t('leave.noPending', 'No pending requests')}
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
      </MotionContainer>

      <Dialog open={rejectDialog} onClose={() => setRejectDialog(false)}>
          <DialogTitle>{t('leave.rejectTitle', 'Reject Request')}</DialogTitle>
          <DialogContent>
              <TextField
                  autoFocus
                  margin="dense"
                  label={t('leave.rejectionReason', 'Rejection Reason')}
                  fullWidth
                  multiline
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
              />
          </DialogContent>
          <DialogActions>
              <Button onClick={() => setRejectDialog(false)}>{t('common.cancel', 'Cancel')}</Button>
              <Button onClick={handleRejectConfirm} variant="contained" color="error">{t('leave.rejectAction', 'Reject')}</Button>
          </DialogActions>
      </Dialog>
    </MainLayout>
  );
};

export default LeaveApprovalsPage;
