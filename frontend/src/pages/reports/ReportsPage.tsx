import { AttendanceReports, EmployeeReports, PayrollReports, RecruitmentReports, reportsApi } from '@/api/reports';
import MainLayout from '@/components/layout/MainLayout';
import { useThemeContext } from '@/contexts/ThemeContext';
import { Download as DownloadIcon, PictureAsPdf as PdfIcon } from '@mui/icons-material';
import {
    Box,
    Button,
    Card,
    CardContent,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Legend,
    Line,
    LineChart,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const COLORS = ['#667eea', '#4caf50', '#ff9800', '#f44336', '#2196f3', '#9c27b0', '#00bcd4', '#795548'];

const ReportsPage: React.FC = () => {
  const { t } = useTranslation();
  const themeContext = useThemeContext();
  const language = themeContext?.language || 'en';
  const [employeeData, setEmployeeData] = useState<EmployeeReports | null>(null);
  const [attendanceData, setAttendanceData] = useState<AttendanceReports | null>(null);
  const [payrollData, setPayrollData] = useState<PayrollReports | null>(null);
  const [recruitmentData, setRecruitmentData] = useState<RecruitmentReports | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [empRes, attRes, payRes, recRes] = await Promise.all([
        reportsApi.getEmployeeReports(),
        reportsApi.getAttendanceReports(),
        reportsApi.getPayrollReports(),
        reportsApi.getRecruitmentReports(),
      ]);
      setEmployeeData(empRes.data);
      setAttendanceData(attRes.data);
      setPayrollData(payRes.data);
      setRecruitmentData(recRes.data);
    } catch (error) {
      console.error(t('reports.failedToFetch', 'Failed to fetch report data:'), error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <MainLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
          <CircularProgress />
        </Box>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" fontWeight="bold">
          {t('reports.title', 'Reports & Analytics')}
        </Typography>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>{t('reports.timePeriod', 'Time Period')}</InputLabel>
            <Select defaultValue="last30" label={t('reports.timePeriod', 'Time Period')}>
              <MenuItem value="last7">{t('reports.last7Days', 'Last 7 Days')}</MenuItem>
              <MenuItem value="last30">{t('reports.last30Days', 'Last 30 Days')}</MenuItem>
              <MenuItem value="last90">{t('reports.last90Days', 'Last 90 Days')}</MenuItem>
              <MenuItem value="thisyear">{t('reports.thisYear', 'This Year')}</MenuItem>
            </Select>
          </FormControl>
          <Button variant="outlined" startIcon={<PdfIcon />}>
            {t('reports.exportPDF', 'Export PDF')}
          </Button>
          <Button variant="contained" startIcon={<DownloadIcon />}>
            {t('reports.exportExcel', 'Export Excel')}
          </Button>
        </Box>
      </Box>

      {/* KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('employees.total', 'Total Employees')}
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {employeeData?.total_employees || 0}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('reports.monthlyPayrollNet', 'Monthly Payroll (Net)')}
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {language === 'ar' ? '' : '$'}
                {(payrollData?.monthly_expenses?.[0]?.total_net_pay || 0).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US')}
                {language === 'ar' ? ' ج.م' : ''}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('reports.recruitmentConversion', 'Recruitment Conversion')}
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {recruitmentData?.applications_by_stage?.find(s => s.stage === 'hired')?.count || 0}
              </Typography>
              <Typography variant="caption">{t('reports.totalHired', 'Total Hired')}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                {t('reports.attendanceRate', 'Attendance Rate')}
              </Typography>
              <Typography variant="h3" fontWeight="bold">
                {attendanceData?.status_summary?.find(s => s.status === 'present')?.count ? 
                  Math.round((attendanceData.status_summary.find(s => s.status === 'present')!.count / 
                  attendanceData.status_summary.reduce((acc, curr) => acc + curr.count, 0)) * 100) : 0}
                {language === 'ar' ? '٪' : '%'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Attendance Trends */}
        <Grid item xs={12} lg={8}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {t('reports.attendanceTrends', 'Attendance Trends (Daily)')}
              </Typography>
              <Box sx={{ width: '100%', height: 350, mt: 2 }}>
                <ResponsiveContainer>
                  <LineChart data={attendanceData?.trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" tickFormatter={(val) => new Date(val).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')} />
                    <YAxis />
                    <Tooltip labelFormatter={(val) => new Date(val).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'en-US')} />
                    <Legend />
                    <Line type="monotone" dataKey="count" stroke="#667eea" strokeWidth={2} name={t('reports.totalPresent', 'Total Present')} />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Employment Type Distribution */}
        <Grid item xs={12} lg={4}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {t('reports.employmentType', 'Employment Type')}
              </Typography>
              <Box sx={{ width: '100%', height: 350, mt: 2 }}>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={employeeData?.employment_type}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={(entry) => `${t(`recruitment.${entry.employment_type}`, entry.employment_type)}`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {employeeData?.employment_type.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: any, _name: any, props: any) => [value, t(`recruitment.${props.payload.employment_type}`, props.payload.employment_type)]} />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Department Distribution (Bar) */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {t('reports.employeesPerDepartment', 'Employees per Department')}
              </Typography>
              <Box sx={{ width: '100%', height: 300, mt: 2 }}>
                <ResponsiveContainer>
                  <BarChart data={employeeData?.department_distribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" tickFormatter={(val) => t(`common.${val.toLowerCase()}`, val).toString()} />
                    <YAxis />
                    <Tooltip labelFormatter={(val) => t(`common.${val.toLowerCase()}`, val).toString()} />
                    <Bar dataKey="count" fill="#667eea" name={t('common.count', 'Count')} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Payroll by Department */}
        <Grid item xs={12} lg={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {t('reports.payrollExpenseByDepartment', 'Payroll Expense by Department')}
              </Typography>
              <Box sx={{ width: '100%', height: 300, mt: 2 }}>
                <ResponsiveContainer>
                  <BarChart data={payrollData?.department_expenses}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="department" tickFormatter={(val) => t(`common.${val.toLowerCase()}`, val).toString()} />
                    <YAxis />
                    <Tooltip labelFormatter={(val) => t(`common.${val.toLowerCase()}`, val).toString()} formatter={(value) => [`${value} ${language === 'ar' ? 'ج.م' : '$'}`, t('reports.totalExpense').toString()]} />
                    <Bar dataKey="total_expense" fill="#4caf50" name={t('reports.totalExpense', 'Total Expense')} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recruitment Pipeline */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                {t('reports.recruitmentPipelineEfficiency', 'Recruitment Pipeline Efficiency')}
              </Typography>
              <Box sx={{ width: '100%', height: 300, mt: 2 }}>
                <ResponsiveContainer>
                  <BarChart data={recruitmentData?.applications_by_stage}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="stage" tickFormatter={(val) => t(`recruitment.${val}`, val)} />
                    <YAxis />
                    <Tooltip labelFormatter={(val) => t(`recruitment.${val}`, val)} />
                    <Bar dataKey="count" fill="#ff9800" name={t('reports.candidates', 'Candidates')} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </MainLayout>
  );
};

export default ReportsPage;
