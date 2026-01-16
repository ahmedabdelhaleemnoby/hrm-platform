import scheduledEmailLogsApi, { ScheduledEmailLog } from '@/api/scheduledEmailLogs';
import MainLayout from '@/components/layout/MainLayout';
import {
    CheckCircle as CheckCircleIcon,
    Error as ErrorIcon,
    SkipNext as SkipNextIcon
} from '@mui/icons-material';
import {
    Box,
    Card,
    Chip,
    Container,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const ScheduledEmailHistoryPage: React.FC = () => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<ScheduledEmailLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [total, setTotal] = useState(0);

  const fetchLogs = async (currentPage: number, currentRowsPerPage: number) => {
    setLoading(true);
    try {
      const response = await scheduledEmailLogsApi.getLogs({
        page: currentPage + 1,
        per_page: currentRowsPerPage,
      });
      setLogs(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error('Failed to fetch scheduled email logs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusChip = (status: string, errorMessage: string | null) => {
    switch (status) {
      case 'success':
        return (
          <Chip
            icon={<CheckCircleIcon />}
            label={t('common.success')}
            color="success"
            size="small"
            variant="outlined"
          />
        );
      case 'failed':
        return (
          <Tooltip title={errorMessage || 'Unknown error'}>
            <Chip
              icon={<ErrorIcon />}
              label={t('common.failed')}
              color="error"
              size="small"
              variant="outlined"
            />
          </Tooltip>
        );
      case 'skipped':
        return (
          <Chip
            icon={<SkipNextIcon />}
            label={t('common.skipped')}
            color="warning"
            size="small"
            variant="outlined"
          />
        );
      default:
        return <Chip label={status} size="small" variant="outlined" />;
    }
  };

  return (
    <MainLayout>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            {t('admin.emailHistory.title')}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {t('admin.emailHistory.description')}
          </Typography>
        </Box>

        <Card sx={{ borderRadius: 2, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <TableContainer component={Paper} sx={{ boxShadow: 'none' }}>
            <Table>
              <TableHead sx={{ bgcolor: 'action.hover' }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: 'bold' }}>{t('admin.emailHistory.executionDate')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{t('admin.emailHistory.type')}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>{t('admin.emailHistory.recipients')}</TableCell>
                  <TableCell align="center" sx={{ fontWeight: 'bold' }}>{t('admin.emailHistory.stats')}</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>{t('admin.emailHistory.status')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      {t('common.loading')}...
                    </TableCell>
                  </TableRow>
                ) : logs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      {t('common.noData')}
                    </TableCell>
                  </TableRow>
                ) : (
                  logs.map((log) => (
                    <TableRow key={log.id} hover>
                      <TableCell>
                        {format(new Date(log.executed_at), 'yyyy-MM-dd HH:mm:ss')}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ textTransform: 'capitalize' }}>
                          {log.type.replace('_', ' ')}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">{log.recipients_count}</TableCell>
                      <TableCell align="center">
                        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1 }}>
                          <Tooltip title={`${t('admin.emailHistory.absent')}: ${log.absent_count}`}>
                            <Chip label={`A: ${log.absent_count}`} size="small" sx={{ fontSize: '0.7rem' }} />
                          </Tooltip>
                          <Tooltip title={`${t('admin.emailHistory.contracts')}: ${log.expiring_contracts_count}`}>
                            <Chip label={`C: ${log.expiring_contracts_count}`} size="small" sx={{ fontSize: '0.7rem' }} />
                          </Tooltip>
                          <Tooltip title={`${t('admin.emailHistory.birthdays')}: ${log.birthdays_count}`}>
                            <Chip label={`B: ${log.birthdays_count}`} size="small" sx={{ fontSize: '0.7rem' }} />
                          </Tooltip>
                          <Tooltip title={`${t('admin.emailHistory.probation')}: ${log.probation_endings_count}`}>
                            <Chip label={`P: ${log.probation_endings_count}`} size="small" sx={{ fontSize: '0.7rem' }} />
                          </Tooltip>
                        </Box>
                      </TableCell>
                      <TableCell>{getStatusChip(log.status, log.error_message)}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 15, 25, 50]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
      </Container>
    </MainLayout>
  );
};

export default ScheduledEmailHistoryPage;
