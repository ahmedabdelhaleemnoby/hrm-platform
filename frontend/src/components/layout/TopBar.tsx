import { Notification, notificationsApi } from '@/api/notifications';
import { searchApi, SearchResult } from '@/api/search';
import { useAuth } from '@/contexts/AuthContext';
import { useThemeContext } from '@/contexts/ThemeContext';
import echo from '@/utils/echo';
import {
  Brightness4 as AutoModeIcon,
  DarkMode as DarkModeIcon,
  LightMode as LightModeIcon,
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  Search as SearchIcon,
  Translate as TranslateIcon,
} from '@mui/icons-material';
import {
  AppBar,
  Avatar,
  Badge,
  Box,
  CircularProgress,
  Divider,
  IconButton,
  InputBase,
  ListItemIcon,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import { ar, enUS } from 'date-fns/locale';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface TopBarProps {
  onMenuClick: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { themeMode, setThemeMode, resolvedMode, language, setLanguage, direction } = useThemeContext();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null);
  const [themeAnchorEl, setThemeAnchorEl] = useState<null | HTMLElement>(null);
  const [notiAnchorEl, setNotiAnchorEl] = useState<null | HTMLElement>(null);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchAnchorEl, setSearchAnchorEl] = useState<null | HTMLElement>(null);

  // Notifications State
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const fetchNotifications = async () => {
    try {
      const response = await notificationsApi.getNotifications();
      if (response.success) {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unread_count);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  React.useEffect(() => {
    if (user) {
      fetchNotifications();

      // Subscribe to private notification channel
      const channel = echo.private(`App.Models.User.${user.id}`);
      
      channel.notification(() => {
        fetchNotifications();
      });

      return () => {
        echo.leave(`App.Models.User.${user.id}`);
      };
    }
  }, [user]);

  // Debounced Search Logic
  React.useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery.length >= 2) {
        handleSearch(searchQuery);
      } else {
        setSearchResults(null);
        setSearchAnchorEl(null);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleSearch = async (query: string) => {
    setIsSearching(true);
    try {
      const response = await searchApi.search(query);
      if (response.success) {
        setSearchResults(response.data);
        if (response.data.employees.length > 0 || response.data.departments.length > 0) {
          setSearchAnchorEl(document.getElementById('search-input-container'));
        } else {
          setSearchAnchorEl(null);
        }
      }
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchItemClick = (type: string, id?: number, name?: string) => {
    setSearchAnchorEl(null);
    setSearchQuery('');
    if (type === 'employee' && id) {
      navigate(`/employees/${id}`);
    } else if (type === 'department' && name) {
      navigate(`/employees?department=${encodeURIComponent(name)}`);
    }
  };

  const handleNotiClick = (event: React.MouseEvent<HTMLElement>) => {
    setNotiAnchorEl(event.currentTarget);
  };

  const handleNotiClose = () => {
    setNotiAnchorEl(null);
  };

  const handleMarkAllRead = async () => {
    try {
      await notificationsApi.markAllAsRead();
      fetchNotifications();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleMarkAsRead = async (noti: Notification) => {
    try {
      if (!noti.read_at) {
        await notificationsApi.markAsRead(noti.id);
        fetchNotifications();
      }
      handleNotiClose();

      // Navigation logic based on notification type
      const data = noti.data;
      switch (data.type) {
        case 'leave':
          navigate('/leave');
          break;
        case 'attendance':
          navigate('/attendance');
          break;
        case 'payroll':
          navigate('/payroll');
          break;
        case 'candidate':
          navigate('/recruitment');
          break;
        default:
          // If no specific type, just stay or go to notification page
          break;
      }
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleClose();
    logout();
  };

  const handleProfile = () => {
    handleClose();
    navigate('/profile');
  };

  const handleLangClick = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleLangClose = () => {
    setLangAnchorEl(null);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    handleLangClose();
  };

  const handleThemeClick = (event: React.MouseEvent<HTMLElement>) => {
    setThemeAnchorEl(event.currentTarget);
  };

  const handleThemeClose = () => {
    setThemeAnchorEl(null);
  };

  const handleThemeModeChange = (mode: 'light' | 'dark' | 'auto') => {
    setThemeMode(mode);
    handleThemeClose();
  };

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light':
        return <LightModeIcon />;
      case 'dark':
        return <DarkModeIcon />;
      case 'auto':
        return <AutoModeIcon />;
    }
  };

  const getThemeLabel = () => {
    switch (themeMode) {
      case 'light':
        return t('settings.lightMode');
      case 'dark':
        return t('settings.darkMode');
      case 'auto':
        return t('settings.autoMode');
    }
  };

  const getNotificationText = (noti: Notification) => {
    const data = noti.data;
    switch (data.type) {
      case 'leave':
        return t('notifications.newLeaveRequest', { name: data.name });
      case 'attendance':
        return t('notifications.attendanceAlert', { name: data.name });
      case 'payroll':
        return t('notifications.payrollProcessed', { month: data.month });
      case 'candidate':
        return t('notifications.newCandidate', { job: data.job });
      default:
        return data.message || '';
    }
  };

  const getTimeAgo = (date: string) => {
    return formatDistanceToNow(new Date(date), { 
      addSuffix: true,
      locale: language === 'ar' ? ar : enUS
    });
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        bgcolor: resolvedMode === 'dark' ? 'background.paper' : 'white',
        color: 'text.primary',
        borderBottom: '1px solid',
        borderColor: 'divider',
        ...(direction === 'rtl' 
          ? { right: { md: '260px' }, left: 'auto' }
          : { left: { md: '260px' } }
        ),
        width: { md: 'calc(100% - 260px)' },
      }}
    >
      <Toolbar>
        {/* Mobile Menu Button */}
        {isMobile && (
          <IconButton
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}

        {/* Search Bar */}
        <Box
          id="search-input-container"
          sx={{
            display: 'flex',
            alignItems: 'center',
            bgcolor: resolvedMode === 'dark' ? 'grey.800' : 'grey.100',
            borderRadius: 2,
            px: 2,
            py: 0.5,
            flex: { xs: 1, sm: 0 },
            minWidth: { sm: 300 },
            position: 'relative',
          }}
        >
          <SearchIcon sx={{ color: 'text.secondary', mr: 1 }} />
          <InputBase
            placeholder={t('common.search')}
            sx={{ flex: 1 }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {isSearching && <CircularProgress size={20} sx={{ ml: 1 }} />}

          <Menu
            anchorEl={searchAnchorEl}
            open={Boolean(searchAnchorEl)}
            onClose={() => setSearchAnchorEl(null)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
            autoFocus={false}
            disableAutoFocusItem
            PaperProps={{
              sx: { width: { xs: '100vw', sm: 350 }, maxHeight: 400, mt: 1 }
            }}
          >
            {searchResults?.employees.length ? (
              <>
                <Typography variant="overline" sx={{ px: 2, fontWeight: 'bold', color: 'primary.main' }}>
                  {t('employees.title')}
                </Typography>
                {searchResults.employees.map((emp) => (
                  <MenuItem key={emp.id} onClick={() => handleSearchItemClick('employee', emp.id)}>
                    <Avatar sx={{ width: 32, height: 32, mr: 1.5, fontSize: '0.8rem' }}>
                      {emp.first_name[0]}{emp.last_name[0]}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {emp.first_name} {emp.last_name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {emp.position} • {emp.department}
                      </Typography>
                    </Box>
                  </MenuItem>
                ))}
              </>
            ) : null}

            {searchResults?.departments.length ? (
              <>
                <Divider sx={{ my: 1 }} />
                <Typography variant="overline" sx={{ px: 2, fontWeight: 'bold', color: 'primary.main' }}>
                  {t('dashboard.departments')}
                </Typography>
                {searchResults.departments.map((dept) => (
                  <MenuItem key={dept.name} onClick={() => handleSearchItemClick('department', undefined, dept.name)}>
                    <ListItemIcon>
                      <Box sx={{ width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        🏢
                      </Box>
                    </ListItemIcon>
                    <Typography variant="body2">{dept.name}</Typography>
                  </MenuItem>
                ))}
              </>
            ) : null}
            
            {!searchResults?.employees.length && !searchResults?.departments.length && (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography variant="body2" color="text.secondary">
                  {t('common.noResults')}
                </Typography>
              </Box>
            )}
          </Menu>
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        {/* Language Toggle */}
        <Tooltip title={t('settings.language')}>
          <IconButton onClick={handleLangClick} sx={{ mx: 0.5 }}>
            <TranslateIcon />
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={langAnchorEl}
          open={Boolean(langAnchorEl)}
          onClose={handleLangClose}
        >
          <MenuItem 
            onClick={() => handleLanguageChange('en')} 
            selected={language === 'en'}
          >
            🇺🇸 English
          </MenuItem>
          <MenuItem 
            onClick={() => handleLanguageChange('ar')} 
            selected={language === 'ar'}
          >
            🇸🇦 العربية
          </MenuItem>
        </Menu>

        {/* Theme Mode Toggle */}
        <Tooltip title={getThemeLabel()}>
          <IconButton onClick={handleThemeClick} sx={{ mx: 0.5 }}>
            {getThemeIcon()}
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={themeAnchorEl}
          open={Boolean(themeAnchorEl)}
          onClose={handleThemeClose}
        >
          <MenuItem 
            onClick={() => handleThemeModeChange('light')} 
            selected={themeMode === 'light'}
          >
            <ListItemIcon><LightModeIcon fontSize="small" /></ListItemIcon>
            {t('settings.lightMode')}
          </MenuItem>
          <MenuItem 
            onClick={() => handleThemeModeChange('dark')} 
            selected={themeMode === 'dark'}
          >
            <ListItemIcon><DarkModeIcon fontSize="small" /></ListItemIcon>
            {t('settings.darkMode')}
          </MenuItem>
          <MenuItem 
            onClick={() => handleThemeModeChange('auto')} 
            selected={themeMode === 'auto'}
          >
            <ListItemIcon><AutoModeIcon fontSize="small" /></ListItemIcon>
            {t('settings.autoMode')}
          </MenuItem>
        </Menu>

        {/* Notifications */}
        <Tooltip title={t('notifications.title')}>
          <IconButton sx={{ mx: 0.5 }} onClick={handleNotiClick}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>
        </Tooltip>
        <Menu
          anchorEl={notiAnchorEl}
          open={Boolean(notiAnchorEl)}
          onClose={handleNotiClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: { width: 320, maxHeight: 400, mt: 1.5 }
          }}
        >
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 'bold' }}>
              {t('notifications.title')}
            </Typography>
            {unreadCount > 0 && (
              <Typography 
                variant="caption" 
                color="primary" 
                sx={{ cursor: 'pointer', fontWeight: 'bold' }}
                onClick={handleMarkAllRead}
              >
                {t('notifications.markAllAsRead')}
              </Typography>
            )}
          </Box>
          <Divider />
          {notifications.length > 0 ? (
            notifications.map((noti) => (
              <MenuItem 
                key={noti.id} 
                onClick={() => handleMarkAsRead(noti)}
                sx={{ 
                  py: 1.5, 
                  px: 2, 
                  whiteSpace: 'normal',
                  bgcolor: noti.read_at ? 'transparent' : 'action.hover',
                  borderLeft: noti.read_at ? 'none' : '4px solid',
                  borderColor: 'primary.main',
                  display: 'block'
                }}
              >
                <Box>
                  <Typography variant="body2" sx={{ fontWeight: noti.read_at ? 400 : 600 }}>
                    {getNotificationText(noti)}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {getTimeAgo(noti.created_at)}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {t('notifications.noNotifications')}
              </Typography>
            </Box>
          )}
          <Divider />
          <MenuItem 
            sx={{ justifyContent: 'center', py: 1 }}
            onClick={() => {
              handleNotiClose();
              navigate('/notifications');
            }}
          >
            <Typography variant="caption" color="primary" fontWeight="bold">
              {t('notifications.viewAll')}
            </Typography>
          </MenuItem>
        </Menu>

        {/* User Menu */}
        <IconButton onClick={handleProfileClick} sx={{ ml: 1 }}>
          <Avatar
            sx={{
              width: 36,
              height: 36,
              bgcolor: 'primary.main',
            }}
          >
            {user?.employee?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
          </Avatar>
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
        >
          <Box sx={{ px: 2, py: 1.5, minWidth: 200 }}>
            <Typography variant="subtitle2" fontWeight="bold">
              {user?.employee?.full_name || 'User'}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <Divider />
          <MenuItem onClick={handleProfile}>{t('settings.profile')}</MenuItem>
          <MenuItem onClick={handleClose}>{t('settings.title')}</MenuItem>
          <Divider />
          <MenuItem onClick={handleLogout}>{t('common.logout')}</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default TopBar;
