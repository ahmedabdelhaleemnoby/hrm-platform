import { useThemeContext } from '@/contexts/ThemeContext';
import {
  AdminPanelSettings as AdminPanelSettingsIcon,
  Assignment as AssignmentIcon,
  AttachMoney as AttachMoneyIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Dashboard as DashboardIcon,
  EventNote as EventNoteIcon,
  History as HistoryIcon,
  HowToReg as OnboardingIcon,
  People as PeopleIcon,
  Work as RecruitmentIcon,
  Schedule as ScheduleIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon
} from '@mui/icons-material';
import {
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';

const drawerWidth = 260;

interface MenuItem {
  textKey: string;
  icon: React.ReactNode;
  path: string;
  roles?: string[]; // Optional: if undefined, shown to all
}

const menuItems: MenuItem[] = [
  { textKey: 'common.dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { textKey: 'common.employees', icon: <PeopleIcon />, path: '/employees', roles: ['admin', 'hr_manager', 'dept_manager'] },
  { textKey: 'common.attendance', icon: <ScheduleIcon />, path: '/attendance', roles: ['admin', 'hr_manager', 'dept_manager'] },
  { textKey: 'leave.approvals', icon: <EventNoteIcon />, path: '/leave-approvals', roles: ['admin', 'hr_manager', 'dept_manager'] },
  { textKey: 'common.leave', icon: <EventNoteIcon />, path: '/leave' }, // ESS accessible (but maybe different view)
  { textKey: 'common.calendar', icon: <EventNoteIcon />, path: '/calendar' },
  { textKey: 'common.payroll', icon: <AttachMoneyIcon />, path: '/payroll', roles: ['admin', 'finance_manager'] },
  { textKey: 'common.performance', icon: <TrendingUpIcon />, path: '/performance', roles: ['admin', 'hr_manager'] },
  { textKey: 'common.recruitment', icon: <RecruitmentIcon />, path: '/recruitment', roles: ['admin', 'hr_manager'] },
  { textKey: 'common.onboarding', icon: <OnboardingIcon />, path: '/onboarding', roles: ['admin', 'hr_manager'] },
  { textKey: 'common.reports', icon: <AssignmentIcon />, path: '/reports', roles: ['admin', 'hr_manager', 'finance_manager'] },
  { textKey: 'common.auditLogs', icon: <HistoryIcon />, path: '/audit-logs', roles: ['admin'] },
  { textKey: 'admin.emailHistory.title', icon: <HistoryIcon />, path: '/scheduled-email-history', roles: ['admin'] },
  { textKey: 'common.roleManagement', icon: <AdminPanelSettingsIcon />, path: '/roles', roles: ['admin'] },
  { textKey: 'common.userRoleManagement', icon: <PeopleIcon />, path: '/user-roles', roles: ['admin'] },
  
  // ESS Specific Links
  { textKey: 'common.myProfile', icon: <PeopleIcon />, path: '/my-profile', roles: ['employee'] },
  { textKey: 'common.myPayslips', icon: <AttachMoneyIcon />, path: '/my-payslips', roles: ['employee'] },
  { textKey: 'leave.myLeaves', icon: <EventNoteIcon />, path: '/my-leaves', roles: ['employee'] },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

import { useAuth } from '@/contexts/AuthContext';

const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { t } = useTranslation();
  const { resolvedMode, direction } = useThemeContext();
  const { user } = useAuth(); // Get current user

  const handleNavigate = (path: string) => {
    navigate(path);
    if (isMobile) {
      onClose();
    }
  };

  const lightGradient = 'linear-gradient(180deg, #667eea 0%, #764ba2 100%)';
  const darkGradient = 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)';

  const drawer = (
    <Box
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: resolvedMode === 'dark' ? darkGradient : lightGradient,
        color: 'white',
      }}
    >
      {/* Logo / Header */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <Box display="flex" alignItems="center" gap={1}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              bgcolor: 'rgba(255,255,255,0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <DashboardIcon />
          </Box>
          <Typography variant="h6" fontWeight="bold">
            HRM Platform
          </Typography>
        </Box>
        {isMobile && (
          <IconButton onClick={onClose} sx={{ color: 'white' }}>
            {direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        )}
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
      {/* Navigation Menu - Scrollable */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', px: 2, py: 2 }}>
        <List>
          {menuItems.filter(item => {
            if (!item.roles) return true; // Show if no specific roles defined
            if (!user || !user.roles) return false; // Hide if user not ready
            // @ts-ignore - roles is definitely on user if we use the right type, but to be safe for now
            return item.roles.some(role => user.roles.includes(role));
          }).map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <ListItemButton
                key={item.textKey}
                onClick={() => handleNavigate(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  bgcolor: isActive ? 'rgba(255,255,255,0.15)' : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(255,255,255,0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={t(item.textKey)}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 600 : 400,
                  }}
                />
              </ListItemButton>
            );
          })}
        </List>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mt: 'auto' }} />

      {/* Settings - Fixed at bottom */}
      <Box sx={{ px: 2, py: 2, flexShrink: 0 }}>
        <List>
          <ListItemButton
            onClick={() => handleNavigate('/settings')}
            sx={{
              borderRadius: 2,
              '&:hover': {
                bgcolor: 'rgba(255,255,255,0.1)',
              },
            }}
          >
            <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary={t('common.settings')} />
          </ListItemButton>
        </List>
      </Box>
    </Box>
  );

  return (
    <Drawer
      anchor={direction === 'rtl' ? 'right' : 'left'}
      variant={isMobile ? 'temporary' : 'permanent'}
      open={open}
      onClose={onClose}
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          border: 'none',
        },
      }}
    >
      {drawer}
    </Drawer>
  );
};

export default Sidebar;
