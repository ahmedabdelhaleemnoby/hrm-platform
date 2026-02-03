import { useThemeContext } from '@/contexts/ThemeContext';
import { Home as HomeIcon, NavigateBefore as NavigateBeforeIcon, NavigateNext as NavigateNextIcon } from '@mui/icons-material';
import { Box, Link, Breadcrumbs as MUIBreadcrumbs, Typography } from '@mui/material';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const Breadcrumbs: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const themeContext = useThemeContext();
  const direction = themeContext?.direction || 'ltr';
  
  const pathnames = location.pathname.split('/').filter((x) => x);

  // Map of URL segments to i18n keys or direct labels
  const breadcrumbNameMap: Record<string, string> = {
    'dashboard': t('common.dashboard'),
    'employees': t('common.employees'),
    'attendance': t('common.attendance'),
    'leaves': t('common.leave'),
    'payroll': t('common.payroll'),
    'performance': t('common.performance'),
    'recruitment': t('common.recruitment'),
    'onboarding': t('common.onboarding'),
    'reports': t('common.reports'),
    'settings': t('common.settings'),
    'notifications': t('notifications.title'),
    'profile': t('settings.profile'),
  };

  if (pathnames.length === 0 || pathnames[0] === 'dashboard' && pathnames.length === 1) {
    return null; // Don't show on root or main dashboard
  }

  return (
    <Box sx={{ mb: 2 }}>
      <MUIBreadcrumbs
        separator={direction === 'rtl' ? <NavigateBeforeIcon fontSize="small" /> : <NavigateNextIcon fontSize="small" />}
        aria-label="breadcrumb"
      >
        <Link
          component={RouterLink}
          underline="hover"
          color="inherit"
          to="/dashboard"
          sx={{ display: 'flex', alignItems: 'center' }}
        >
          <HomeIcon sx={{ mr: direction === 'rtl' ? 0 : 0.5, ml: direction === 'rtl' ? 0.5 : 0 }} fontSize="inherit" />
          {t('common.dashboard')}
        </Link>
        
        {pathnames.map((value, index) => {
          const last = index === pathnames.length - 1;
          const to = `/${pathnames.slice(0, index + 1).join('/')}`;
          
          // Check if value is a numeric ID (e.g., employee ID)
          const isId = !isNaN(Number(value));
          const name = isId ? t('common.view') : (breadcrumbNameMap[value] || value);

          return last ? (
            <Typography color="text.primary" key={to} sx={{ fontWeight: 500 }}>
              {name}
            </Typography>
          ) : (
            <Link
              component={RouterLink}
              underline="hover"
              color="inherit"
              to={to}
              key={to}
            >
              {name}
            </Link>
          );
        })}
      </MUIBreadcrumbs>
    </Box>
  );
};

export default Breadcrumbs;
