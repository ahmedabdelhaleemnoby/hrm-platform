import { useThemeContext } from '@/contexts/ThemeContext';
import { Box, useMediaQuery, useTheme } from '@mui/material';
import React, { useState } from 'react';
import Breadcrumbs from '../common/Breadcrumbs';
import Sidebar from './Sidebar';
import TopBar from './TopBar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const { resolvedMode, direction } = useThemeContext();

  const handleMenuClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        minHeight: '100vh', 
        bgcolor: resolvedMode === 'dark' ? 'background.default' : 'grey.50',
        direction: direction,
      }}
    >
      {/* Sidebar */}
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          ml: 0,
        }}
      >
        {/* Top Bar */}
        <TopBar onMenuClick={handleMenuClick} />

        {/* Page Content */}
        <Box
          sx={{
            mt: '64px', // AppBar height
            p: { xs: 2, sm: 3 },
            minHeight: 'calc(100vh - 64px)',
          }}
        >
          <Breadcrumbs />
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;
