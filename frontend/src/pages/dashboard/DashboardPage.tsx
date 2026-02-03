import { dashboardApi, DashboardStats } from '@/api/dashboard';
import MotionContainer, { FadeIn, SlideUp } from '@/components/common/MotionContainer';
import StatCard from '@/components/common/StatCard';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeContext } from '@/contexts/ThemeContext';
import { exportToExcel, exportToPdf } from '@/utils/exportUtils';
import { DragDropContext, Draggable, Droppable, DropResult } from '@hello-pangea/dnd';
import {
    CheckCircle as CheckCircleIcon,
    DragIndicator as DragIcon,
    Edit as EditIcon,
    EventNote as EventNoteIcon,
    GetApp as ExportIcon,
    People as PeopleIcon,
    Save as SaveIcon,
    WatchLater as WatchLaterIcon,
} from '@mui/icons-material';
import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Menu,
    MenuItem,
    Skeleton,
    ToggleButton,
    ToggleButtonGroup,
    Typography,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
    Cell,
    Legend,
    Pie,
    PieChart,
    ResponsiveContainer,
    Tooltip
} from 'recharts';

// Colors for charts
const COLORS = ['#667eea', '#4caf50', '#ff9800', '#f44336', '#2196f3', '#9c27b0', '#00bcd4'];

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const themeContext = useThemeContext();
  const language = themeContext?.language || 'en';
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [period, setPeriod] = useState('all');
  const [exportAnchorEl, setExportAnchorEl] = useState<null | HTMLElement>(null);

  // Widget Order State - Added 'period' to stats
  const [statOrder, setStatOrder] = useState<string[]>(['total', 'present', 'leave', 'depts', 'period']);
  const [mainWidgetOrder, setMainWidgetOrder] = useState<string[]>(['chart', 'activity']);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        const response = await dashboardApi.getStats(period);
        setStats(response.data);
        
        // Load saved order from localStorage
        const savedStatOrder = localStorage.getItem('dashboard_stat_order');
        const savedMainOrder = localStorage.getItem('dashboard_main_order');
        if (savedStatOrder) setStatOrder(JSON.parse(savedStatOrder));
        if (savedMainOrder) setMainWidgetOrder(JSON.parse(savedMainOrder));
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [language, period]);

  const onDragEnd = (result: DropResult, type: 'stats' | 'main') => {
    if (!result.destination) return;

    const items = Array.from(type === 'stats' ? statOrder : mainWidgetOrder);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    if (type === 'stats') {
      setStatOrder(items);
      localStorage.setItem('dashboard_stat_order', JSON.stringify(items));
    } else {
      setMainWidgetOrder(items);
      localStorage.setItem('dashboard_main_order', JSON.stringify(items));
    }
  };

  const handleExportPdf = async () => {
    setExportAnchorEl(null);
    await exportToPdf('dashboard-content', `dashboard_report_${period}`);
  };

  const handleExportExcel = async () => {
    setExportAnchorEl(null);
    await exportToExcel(period);
  };

  const renderStatCard = (id: string) => {
    let cardContent = null;

    if (loading) {
        return (
            <Card sx={{ height: '100%', p: 2 }}>
                <Box display="flex" justifyContent="space-between" alignItems="center">
                     <Box>
                        <Skeleton variant="text" width={100} height={20} sx={{ mb: 1 }} />
                        <Skeleton variant="text" width={60} height={40} />
                     </Box>
                     <Skeleton variant="circular" width={56} height={56} />
                </Box>
            </Card>
        );
    }

    switch (id) {
      case 'total':
        cardContent = (
          <StatCard
            title={t('dashboard.totalEmployees')}
            value={stats?.total_employees?.toString() || '0'}
            icon={<PeopleIcon fontSize="large" />}
            color="primary"
            trend={{ value: 0, isPositive: true }}
          />
        );
        break;
      case 'present':
        cardContent = (
          <StatCard
            title={t('dashboard.presentToday')}
            value={stats?.active_employees?.toString() || '0'}
            icon={<CheckCircleIcon fontSize="large" />}
            color="success"
            trend={{ value: 0, isPositive: true }}
          />
        );
        break;
      case 'leave':
        cardContent = (
          <StatCard
            title={t('dashboard.onLeave')}
            value={stats?.on_leave_employees?.toString() || '0'}
            icon={<EventNoteIcon fontSize="large" />}
            color="warning"
            trend={{ value: 0, isPositive: false }}
          />
        );
        break;
      case 'depts':
        cardContent = (
          <StatCard
            title={t('dashboard.departments')}
            value={stats?.department_stats?.length?.toString() || '0'}
            icon={<WatchLaterIcon fontSize="large" />}
            color="info"
            trend={{ value: 0, isPositive: true }}
          />
        );
        break;
      case 'period':
        cardContent = period !== 'all' ? (
          <StatCard
            title={stats?.labels?.period_employees || t('dashboard.period_employees')}
            value={stats?.period_employees?.toString() || '0'}
            icon={<PeopleIcon fontSize="large" />}
            color="primary"
            trend={{ value: 0, isPositive: true }}
          />
        ) : null;
        break;
      default:
        return null;
    }

    if (!cardContent) return null;

    return (
        <SlideUp delay={0.1}>
            {cardContent}
        </SlideUp>
    );
  };

  const renderMainWidget = (id: string) => {
    if (loading) {
       return (
           <Card sx={{ height: '100%' }}>
               <CardContent>
                   <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between' }}>
                       <Skeleton variant="text" width={200} height={30} />
                   </Box>
                   <Skeleton variant="rectangular" height={300} width="100%" sx={{ borderRadius: 1 }} />
               </CardContent>
           </Card>
       );
    }

    if (!stats) return null;

    if (id === 'chart') {
      const departmentData = stats.department_stats.map((dept, index) => ({
        name: dept.department,
        value: dept.count,
        color: COLORS[index % COLORS.length]
      })) || [];

      return (
        <FadeIn delay={0.2}>
            <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                    {stats?.labels?.department_distribution || t('dashboard.departmentDistribution')}
                </Typography>
                {isEditMode && <DragIcon color="action" />}
                </Box>
                <Box sx={{ width: '100%', height: 350, mt: 2, direction: 'ltr' }}>
                <ResponsiveContainer>
                    <PieChart>
                    <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip formatter={(value: number, name: string) => [value, name]} />
                    <Legend 
                        layout="horizontal" 
                        align="center"
                        verticalAlign="bottom"
                        wrapperStyle={{ 
                        direction: language === 'ar' ? 'rtl' : 'ltr',
                        paddingTop: '20px'
                        }}
                    />
                    </PieChart>
                </ResponsiveContainer>
                </Box>
            </CardContent>
            </Card>
        </FadeIn>
      );
    }

    if (id === 'activity') {
      return (
        <FadeIn delay={0.3}>
            <Card sx={{ height: '100%' }}>
            <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6" fontWeight="bold">
                    {t('dashboard.recentHires')}
                </Typography>
                {isEditMode && <DragIcon color="action" />}
                </Box>
                <List>
                {stats?.recent_activities.map((activity) => (
                    <ListItem key={activity.id} sx={{ px: 0 }}>
                    <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                        {activity.avatar}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={
                        <Typography variant="body2">
                            <strong>{activity.name}</strong> {activity.action}
                        </Typography>
                        }
                        secondary={activity.time}
                    />
                    </ListItem>
                ))}
                </List>
            </CardContent>
            </Card>
        </FadeIn>
      );
    }
    return null;
  };

  const currentDate = new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return t('dashboard.goodMorning');
    if (hour < 18) return t('dashboard.goodAfternoon');
    return t('dashboard.goodEvening');
  };


  return (
    <MainLayout>
      <MotionContainer>
        {/* Welcome & Tools Section */}
        <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                {getGreeting()}, {user?.employee?.full_name || user?.email.split('@')[0]}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {currentDate}
            </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <ToggleButtonGroup
                value={period}
                exclusive
                onChange={(_, val) => val && setPeriod(val)}
                size="small"
                color="primary"
            >
                <ToggleButton value="today">{t('dashboard.filterToday')}</ToggleButton>
                <ToggleButton value="week">{t('dashboard.filterWeek')}</ToggleButton>
                <ToggleButton value="month">{t('dashboard.filterMonth')}</ToggleButton>
                <ToggleButton value="all">{t('dashboard.filterAll')}</ToggleButton>
            </ToggleButtonGroup>
            
            <Button
                variant="outlined"
                startIcon={<ExportIcon />}
                onClick={(e) => setExportAnchorEl(e.currentTarget)}
            >
                {t('reports.export')}
            </Button>
            <Menu
                anchorEl={exportAnchorEl}
                open={Boolean(exportAnchorEl)}
                onClose={() => setExportAnchorEl(null)}
            >
                <MenuItem onClick={handleExportPdf}>Export PDF</MenuItem>
                <MenuItem onClick={handleExportExcel}>Export Excel</MenuItem>
            </Menu>

            <Button
                variant={isEditMode ? "contained" : "outlined"}
                startIcon={isEditMode ? <SaveIcon /> : <EditIcon />}
                onClick={() => setIsEditMode(!isEditMode)}
                color={isEditMode ? "success" : "primary"}
            >
                {isEditMode ? t('common.save') : t('common.edit')}
            </Button>
            </Box>
        </Box>

        <Box id="dashboard-content" sx={{ p: isEditMode ? 1 : 0, bgcolor: 'background.default' }}>
            {/* Stats Cards Section */}
            <DragDropContext onDragEnd={(res) => onDragEnd(res, 'stats')}>
            <Droppable droppableId="stats-droppable" direction="horizontal">
            {(provided) => (
                <Grid 
                container 
                spacing={3} 
                sx={{ mb: 4 }} 
                {...provided.droppableProps} 
                ref={provided.innerRef}
                >
                {statOrder.map((id, index) => (
                    <Draggable key={id} draggableId={id} index={index} isDragDisabled={!isEditMode}>
                    {(provided, snapshot) => (
                        <Grid 
                        item 
                        xs={12} sm={6} lg={3}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{ 
                            ...provided.draggableProps.style,
                            opacity: snapshot.isDragging ? 0.8 : 1,
                            cursor: isEditMode ? 'grab' : 'default',
                            '&:active': { cursor: isEditMode ? 'grabbing' : 'default' }
                        }}
                        >
                        {renderStatCard(id)}
                        </Grid>
                    )}
                    </Draggable>
                ))}
                {provided.placeholder}
                </Grid>
            )}
            </Droppable>
        </DragDropContext>

        {/* Main Widgets Section */}
        <DragDropContext onDragEnd={(res) => onDragEnd(res, 'main')}>
            <Droppable droppableId="main-droppable">
            {(provided) => (
                <Grid 
                container 
                spacing={3} 
                sx={{ mb: 4 }} 
                {...provided.droppableProps} 
                ref={provided.innerRef}
                >
                {mainWidgetOrder.map((id, index) => (
                    <Draggable key={id} draggableId={id} index={index} isDragDisabled={!isEditMode}>
                    {(provided, snapshot) => (
                        <Grid 
                        item 
                        xs={12} lg={6}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        sx={{ 
                            ...provided.draggableProps.style,
                            opacity: snapshot.isDragging ? 0.8 : 1,
                            cursor: isEditMode ? 'grab' : 'default',
                        }}
                        >
                        {renderMainWidget(id)}
                        </Grid>
                    )}
                    </Draggable>
                ))}
                {provided.placeholder}
                </Grid>
            )}
            </Droppable>
        </DragDropContext>
        </Box>
      </MotionContainer>
    </MainLayout>
  );
};

export default DashboardPage;
