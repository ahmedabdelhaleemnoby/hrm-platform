import { payrollApi, PayrollRecord } from '@/api/payroll'; // Assuming payrollApi has myPayslips method, if not I need to add it to frontend api
import MainLayout from '@/components/layout/MainLayout';
import { Download as DownloadIcon } from '@mui/icons-material';
import { Box, Button, Chip, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const MyPayslipsPage: React.FC = () => {
  const { t } = useTranslation();
  const [payslips, setPayslips] = useState<PayrollRecord[]>([]);

  useEffect(() => {
    const fetchPayslips = async () => {
        try {
            // We need to add this method to payrollApi frontend
            const response = await payrollApi.getMyPayslips(); 
            if(response.data.success) {
                setPayslips(response.data.data);
            }
        } catch (error) {
            console.error(error);
        }
    };
    fetchPayslips();
  }, []);

  return (
    <MainLayout>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          {t('My Payslips')}
        </Typography>
      </Box>

      <Paper sx={{ width: '100%', overflow: 'hidden', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: 'background.default' }}>
              <TableCell>{t('Period')}</TableCell>
              <TableCell>{t('Gross Salary')}</TableCell>
              <TableCell>{t('Deductions')}</TableCell>
              <TableCell>{t('Net Salary')}</TableCell>
              <TableCell>{t('Status')}</TableCell>
              <TableCell>{t('Actions')}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payslips.map((record) => (
              <TableRow key={record.id} hover>
                <TableCell>
                    {record.payroll_period?.name} <br/>
                    <Typography variant="caption" color="text.secondary">
                        {record.payroll_period?.start_date} - {record.payroll_period?.end_date}
                    </Typography>
                </TableCell>
                <TableCell>{record.gross_salary}</TableCell>
                <TableCell sx={{ color: 'error.main' }}>-{record.total_deductions}</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>{record.net_salary}</TableCell>
                <TableCell>
                  <Chip 
                    label={record.status} 
                    color={record.status === 'paid' ? 'success' : 'default'} 
                    size="small" 
                  />
                </TableCell>
                <TableCell>
                    <Button startIcon={<DownloadIcon/>} size="small">
                        {t('Download')}
                    </Button>
                </TableCell>
              </TableRow>
            ))}
            {payslips.length === 0 && (
                <TableRow>
                    <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                        {t('No payslips found')}
                    </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>
      </Paper>
    </MainLayout>
  );
};

export default MyPayslipsPage;
