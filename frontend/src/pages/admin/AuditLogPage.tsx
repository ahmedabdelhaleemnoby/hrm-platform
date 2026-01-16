import { AuditLog, auditLogsApi } from '@/api/auditLogs';
import MainLayout from '@/components/layout/MainLayout';
import {
    History as HistoryIcon,
    Info as InfoIcon,
    Search as SearchIcon,
} from '@mui/icons-material';
import {
    Box,
    Card,
    CardContent,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
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
    Tooltip,
    Typography,
} from '@mui/material';
import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const AuditLogPage: React.FC = () => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const fetchLogs = async () => {
    try {
      const response = await auditLogsApi.getLogs({
        page,
        subject_type: searchQuery,
      });
      if (response.success) {
        setLogs(response.data.data);
        setTotalPages(response.data.last_page);
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [page, searchQuery]);

  const handlePageChange = (_: any, value: number) => {
    setPage(value);
  };

  const getEventColor = (event: string) => {
    switch (event) {
      case 'created':
        return 'success';
      case 'updated':
        return 'info';
      case 'deleted':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatLogSubject = (subject: string) => {
    return subject.split('\\').pop() || subject;
  };

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <HistoryIcon fontSize="large" color="primary" />
          {t('common.auditLogs') || 'Audit Logs'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track all system activities and changes
        </Typography>
      </Box>

      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
            <TextField
              fullWidth
              placeholder="Search by subject (e.g., Employee, User)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <TableContainer component={Paper} elevation={0} variant="outlined">
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: 'action.hover' }}>
                  <TableCell sx={{ fontWeight: 'bold' }}>Date</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>User</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Action</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Subject</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }}>Description</TableCell>
                  <TableCell sx={{ fontWeight: 'bold' }} align="center">Details</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log.id} hover>
                    <TableCell>
                      {format(new Date(log.created_at), 'yyyy-MM-dd HH:mm:ss')}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="medium">
                        {log.causer?.name || 'System'}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {log.causer?.email}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={log.event}
                        size="small"
                        color={getEventColor(log.event) as any}
                        sx={{ textTransform: 'capitalize' }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2">{formatLogSubject(log.subject_type)}</Typography>
                      <Typography variant="caption" color="text.secondary">ID: {log.subject_id}</Typography>
                    </TableCell>
                    <TableCell>{log.description}</TableCell>
                    <TableCell align="center">
                      <Tooltip title="View Changes">
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => setSelectedLog(log)}
                        >
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Details Dialog */}
      <Dialog
        open={Boolean(selectedLog)}
        onClose={() => setSelectedLog(null)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Reviewing Changes - {selectedLog && formatLogSubject(selectedLog.subject_type)} #{selectedLog?.subject_id}
        </DialogTitle>
        <DialogContent dividers>
          {selectedLog && (
            <Box>
              <Typography variant="subtitle2" gutterBottom color="primary">Changes:</Typography>
              <Paper variant="outlined" sx={{ p: 2, bgcolor: 'grey.50', fontFamily: 'monospace', fontSize: '0.8rem', overflowX: 'auto' }}>
                <pre>{JSON.stringify(selectedLog.properties, null, 2)}</pre>
              </Paper>

              <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="caption" color="text.secondary" display="block">Causer</Typography>
                  <Typography variant="body2">{selectedLog.causer?.name || 'System'}</Typography>
                </Box>
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="caption" color="text.secondary" display="block">Timestamp</Typography>
                  <Typography variant="body2">{format(new Date(selectedLog.created_at), 'yyyy-MM-dd HH:mm:ss')}</Typography>
                </Box>
              </Box>
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default AuditLogPage;
