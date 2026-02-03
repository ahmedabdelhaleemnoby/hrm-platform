import {
  EventAvailable as AttendanceIcon,
  ChevronRight as ChevronRightIcon,
  Brightness4 as DarkIcon,
  Translate as LanguageIcon,
  Brightness7 as LightIcon,
  AccountBalanceWallet as PayrollIcon,
  People as PeopleIcon,
  TrendingUp as PerformanceIcon,
} from '@mui/icons-material';
import {
  alpha,
  AppBar,
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  TextField,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useThemeContext } from '../../contexts/ThemeContext';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  // Safely get theme context with fallback values
  const themeContext = useThemeContext();
  const resolvedMode = themeContext?.resolvedMode ?? 'light';
  const setThemeMode = themeContext?.setThemeMode ?? (() => {});
  const language = themeContext?.language ?? 'en';
  const setLanguage = themeContext?.setLanguage ?? (() => {});
  const direction = themeContext?.direction ?? 'ltr';

  const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null);

  const handleLangMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchorEl(event.currentTarget);
  };

  const handleLangMenuClose = () => {
    setLangAnchorEl(null);
  };

  const handleLanguageChange = (lang: string) => {
    setLanguage(lang);
    handleLangMenuClose();
  };

  const toggleTheme = () => {
    setThemeMode(resolvedMode === 'dark' ? 'light' : 'dark');
  };

  const features = [
    {
      title: t('landing.features.employeeManagement.title'),
      description: t('landing.features.employeeManagement.description'),
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#6366f1',
    },
    {
      title: t('landing.features.smartAttendance.title'),
      description: t('landing.features.smartAttendance.description'),
      icon: <AttendanceIcon sx={{ fontSize: 40 }} />,
      color: '#10b981',
    },
    {
      title: t('landing.features.automatedPayroll.title'),
      description: t('landing.features.automatedPayroll.description'),
      icon: <PayrollIcon sx={{ fontSize: 40 }} />,
      color: '#f59e0b',
    },
    {
      title: t('landing.features.performanceTracking.title'),
      description: t('landing.features.performanceTracking.description'),
      icon: <PerformanceIcon sx={{ fontSize: 40 }} />,
      color: '#ef4444',
    },
  ];

  const bgColor = resolvedMode === 'dark' ? '#0f172a' : '#f8fafc';
  const textColor = resolvedMode === 'dark' ? '#ffffff' : '#0f172a';
  const subTextColor = resolvedMode === 'dark' ? '#94a3b8' : '#64748b';
  const navBg = resolvedMode === 'dark' ? alpha('#0f172a', 0.8) : alpha('#f8fafc', 0.8);
  const cardBg = resolvedMode === 'dark' ? '#1e293b' : '#ffffff';
  const cardBorder = resolvedMode === 'dark' ? '#334155' : '#e2e8f0';

  return (
    <Box sx={{ bgcolor: bgColor, color: textColor, minHeight: '100vh', overflowX: 'hidden', direction }}>
      {/* Navigation */}
      <AppBar position="sticky" elevation={0} sx={{ bgcolor: navBg, backdropFilter: 'blur(10px)', borderBottom: `1px solid ${cardBorder}` }}>
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
            <Typography variant="h5" component="div" sx={{ fontWeight: 800, letterSpacing: 1, color: resolvedMode === 'dark' ? '#ffffff' : '#0f172a' }}>
              HRM<Box component="span" sx={{ color: '#6366f1' }}>FLOW</Box>
            </Typography>
            
            <Stack direction="row" spacing={1} alignItems="center">
              <Tooltip title={resolvedMode === 'dark' ? t('settings.lightMode') : t('settings.darkMode')}>
                <IconButton onClick={toggleTheme} color="inherit" sx={{ color: resolvedMode === 'dark' ? '#ffffff' : '#0f172a' }}>
                  {resolvedMode === 'dark' ? <LightIcon /> : <DarkIcon />}
                </IconButton>
              </Tooltip>

              <Tooltip title={t('settings.language')}>
                <IconButton onClick={handleLangMenuOpen} color="inherit" sx={{ color: resolvedMode === 'dark' ? '#ffffff' : '#0f172a' }}>
                  <LanguageIcon />
                </IconButton>
              </Tooltip>
              
              <Menu
                anchorEl={langAnchorEl}
                open={Boolean(langAnchorEl)}
                onClose={handleLangMenuClose}
              >
                <MenuItem onClick={() => handleLanguageChange('en')} selected={language === 'en'}>English</MenuItem>
                <MenuItem onClick={() => handleLanguageChange('ar')} selected={language === 'ar'}>العربية</MenuItem>
              </Menu>

              <Box sx={{ borderLeft: `1px solid ${cardBorder}`, height: 24, mx: 1 }} />

              <Button color="inherit" onClick={() => navigate('/login')} sx={{ color: resolvedMode === 'dark' ? '#ffffff' : '#0f172a' }}>
                {t('landing.nav.login')}
              </Button>
              <Button 
                variant="contained" 
                onClick={() => navigate('/login')}
                sx={{ 
                  bgcolor: '#6366f1', 
                  '&:hover': { bgcolor: '#4f46e5' },
                  borderRadius: 2,
                  px: 3,
                  display: { xs: 'none', sm: 'inline-flex' }
                }}
              >
                {t('landing.nav.getStarted')}
              </Button>
            </Stack>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Box sx={{ 
        pt: { xs: 8, md: 12 }, 
        pb: { xs: 8, md: 15 },
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: -100,
          right: direction === 'ltr' ? -100 : 'auto',
          left: direction === 'rtl' ? -100 : 'auto',
          width: 400,
          height: 400,
          background: `radial-gradient(circle, rgba(99,102,241,${resolvedMode === 'dark' ? '0.15' : '0.1'}) 0%, rgba(15,23,42,0) 70%)`,
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0,
          left: -100,
          width: 500,
          height: 500,
          background: 'radial-gradient(circle, rgba(168,85,247,0.1) 0%, rgba(15,23,42,0) 70%)',
          zIndex: 0,
        }
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={5} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ position: 'relative', zIndex: 1, textAlign: direction === 'rtl' ? 'right' : 'left' }}>
                <Typography 
                  variant="h1" 
                  sx={{ 
                    fontSize: { xs: '2.5rem', md: '3.5rem' }, 
                    fontWeight: 900, 
                    lineHeight: 1.1,
                    mb: 3,
                    color: resolvedMode === 'dark' ? '#ffffff' : '#0f172a',
                  }}
                >
                  {t('landing.hero.title')} <br />
                  <Box component="span" sx={{ color: '#6366f1' }}>{t('landing.hero.subtitle')}</Box>
                </Typography>
                <Typography variant="h6" sx={{ color: subTextColor, mb: 5, fontWeight: 400, maxWidth: 500 }}>
                  {t('landing.hero.description')}
                </Typography>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent={direction === 'rtl' ? 'flex-end' : 'flex-start'}>
                  <Button 
                    variant="contained" 
                    size="large"
                    onClick={() => navigate('/login')}
                    endIcon={direction === 'ltr' ? <ChevronRightIcon /> : null}
                    startIcon={direction === 'rtl' ? <ChevronRightIcon sx={{ transform: 'rotate(180deg)' }} /> : null}
                    sx={{ 
                      bgcolor: '#6366f1', 
                      height: 56, 
                      px: 4, 
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      boxShadow: '0 10px 15px -3px rgba(99, 102, 241, 0.3)'
                    }}
                  >
                    {t('landing.hero.startTrial')}
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    sx={{ 
                      color: resolvedMode === 'dark' ? '#ffffff' : '#0f172a', 
                      borderColor: cardBorder, 
                      height: 56, 
                      px: 4,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      '&:hover': { borderColor: '#6366f1', bgcolor: alpha('#6366f1', 0.05) }
                    }}
                  >
                    {t('landing.hero.watchDemo')}
                  </Button>
                </Stack>
                <Typography variant="caption" sx={{ display: 'block', mt: 2, color: subTextColor, fontStyle: 'italic' }}>
                   {t('landing.hero.demoHint') || 'Try with Demo Account: admin@demo.com / password'}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} md={6} sx={{ position: 'relative', zIndex: 1 }}>
              <Box 
                sx={{ 
                  position: 'relative',
                  width: '100%',
                  height: 0,
                  paddingBottom: '100%',
                  borderRadius: 4,
                  overflow: 'hidden',
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)',
                  transform: direction === 'ltr' 
                    ? 'perspective(1000px) rotateY(-5deg) rotateX(5deg)'
                    : 'perspective(1000px) rotateY(5deg) rotateX(5deg)',
                  border: `1px solid ${alpha(textColor, 0.1)}`,
                }}
              >
                <Box 
                  component="img"
                  src="/images/landing/hero.png"
                  alt="HRM Dashboard Preview"
                  sx={{ 
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 8, bgcolor: resolvedMode === 'dark' ? '#1e293b' : '#f1f5f9' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4} justifyContent="center">
            {[
              { label: t('landing.stats.activeUsers'), value: '10k+' },
              { label: t('landing.stats.countries'), value: '50+' },
              { label: t('landing.stats.timeSaved'), value: '30%' },
              { label: t('landing.stats.csat'), value: '4.9/5' },
            ].map((stat, index) => (
              <Grid item xs={6} md={3} key={index} textAlign="center">
                <Typography variant="h3" sx={{ fontWeight: 800, color: textColor, mb: 1 }}>{stat.value}</Typography>
                <Typography variant="body1" sx={{ color: subTextColor }}>{stat.label}</Typography>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: { xs: 8, md: 15 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 800, letterSpacing: 2 }}>
              {t('landing.features.overline')}
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 800, color: textColor, mt: 1, fontSize: { xs: '2rem', md: '3rem' } }}>
              {t('landing.features.title')} <br /> {t('landing.features.subtitle')}
            </Typography>
          </Box>
          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    bgcolor: cardBg, 
                    color: textColor, 
                    borderRadius: 3,
                    border: `1px solid ${cardBorder}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-10px)',
                      borderColor: feature.color,
                      boxShadow: resolvedMode === 'dark' 
                        ? `0 20px 25px -5px rgba(0,0,0,0.5), 0 10px 10px -5px ${alpha(feature.color, 0.2)}`
                        : `0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px ${alpha(feature.color, 0.1)}`
                    }
                  }}
                >
                  <CardContent sx={{ p: 4, textAlign: direction === 'rtl' ? 'right' : 'left' }}>
                    <Box sx={{ 
                      width: 64, 
                      height: 64, 
                      borderRadius: 2, 
                      bgcolor: alpha(feature.color, 0.1), 
                      color: feature.color,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mb: 3,
                      mx: direction === 'rtl' ? '0 0 auto auto' : 'auto 0 0'
                    }}>
                      {feature.icon}
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>{feature.title}</Typography>
                    <Typography variant="body1" sx={{ color: subTextColor }}>{feature.description}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Dashboard Preview Section */}
      <Box sx={{ py: 15, bgcolor: resolvedMode === 'dark' ? '#1e293b' : '#ffffff', direction }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 10 }}>
            <Typography variant="overline" sx={{ color: '#6366f1', fontWeight: 700, letterSpacing: 2 }}>
              Inside the Platform
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 800, mt: 2, mb: 3 }}>
              Powerful Dashboard for Real-time Insights
            </Typography>
            <Typography variant="h6" sx={{ color: subTextColor, maxWidth: 800, mx: 'auto', fontWeight: 400 }}>
              Monitor your workforce, track attendance, and manage leave requests from a single intuitive interface designed for efficiency.
            </Typography>
          </Box>

          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} lg={7}>
              <Box 
                sx={{ 
                  bgcolor: cardBg, 
                  borderRadius: 4, 
                  p: 4, 
                  boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 10px 10px -5px rgba(0,0,0,0.04)',
                  border: `1px solid ${cardBorder}`,
                  position: 'relative'
                }}
              >
                {/* Mock Dashboard Stats */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  {[
                    { label: t('dashboard.totalEmployees'), value: '124', color: '#6366f1', icon: <PeopleIcon /> },
                    { label: t('dashboard.presentToday'), value: '98', color: '#10b981', icon: <AttendanceIcon /> },
                    { label: t('dashboard.onLeave'), value: '12', color: '#f59e0b', icon: <PayrollIcon /> },
                    { label: t('dashboard.departments'), value: '8', color: '#6366f1', icon: <PerformanceIcon /> },
                  ].map((stat, idx) => (
                    <Grid item xs={6} sm={3} key={idx}>
                      <Box sx={{ p: 2, borderRadius: 2, bgcolor: alpha(stat.color, 0.05), border: `1px solid ${alpha(stat.color, 0.1)}` }}>
                        <Box sx={{ color: stat.color, mb: 1 }}>{stat.icon}</Box>
                        <Typography variant="h5" fontWeight="bold">{stat.value}</Typography>
                        <Typography variant="caption" sx={{ color: subTextColor }}>{stat.label}</Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>

                {/* Mock Chart Area */}
                <Box sx={{ height: 200, bgcolor: alpha(subTextColor, 0.05), borderRadius: 2, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'flex-end', gap: 1, p: 2 }}>
                   {[60, 40, 70, 90, 50, 80, 60, 45, 75, 55].map((h, i) => (
                     <Box key={i} sx={{ flex: 1, bgcolor: '#6366f1', height: `${h}%`, borderRadius: '4px 4px 0 0', opacity: 0.6 + (i * 0.04) }} />
                   ))}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} lg={5}>
              <Stack spacing={4}>
                {[
                  { title: 'Smart Reports', desc: 'Generate comprehensive PDF and Excel reports with a single click for payroll and attendance.' },
                  { title: 'Customizable Layout', desc: 'Drag and drop dashboard widgets to prioritize the information that matters most to you.' },
                  { title: 'Mobile Ready', desc: 'Access your HRM platform on the go with a fully responsive mobile interface.' }
                ].map((item, i) => (
                  <Box key={i} sx={{ display: 'flex', gap: 3 }}>
                    <Box sx={{ 
                      width: 48, 
                      height: 48, 
                      borderRadius: '50%', 
                      p: 1.5,
                      bgcolor: alpha('#6366f1', 0.1), 
                      color: '#6366f1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <AttendanceIcon fontSize="small" />
                    </Box>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>{item.title}</Typography>
                      <Typography variant="body1" sx={{ color: subTextColor }}>{item.desc}</Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Section */}
      <Container maxWidth="lg" sx={{ pb: 15 }}>
        <Box 
          sx={{ 
            bgcolor: '#6366f1', 
            borderRadius: { xs: 4, md: 8 }, 
            p: { xs: 6, md: 8 }, 
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 25px 50px -12px rgba(99,102,241,0.5)',
          }}
        >
          <Box sx={{ position: 'relative', zIndex: 1 }}>
            <Typography variant="h3" sx={{ fontWeight: 800, color: 'white', mb: 3, fontSize: { xs: '1.8rem', md: '2.5rem' } }}>
              {t('landing.cta.title')}
            </Typography>
            <Typography variant="h6" sx={{ color: alpha('#fff', 0.8), mb: 5, maxWidth: 600, mx: 'auto', fontWeight: 400 }}>
              {t('landing.cta.description')}
            </Typography>
            <Button 
              variant="contained" 
              size="large"
              onClick={() => navigate('/login')}
              sx={{ 
                bgcolor: '#ffffff', 
                color: '#6366f1',
                height: 56, 
                px: 5, 
                fontSize: '1.2rem',
                fontWeight: 700,
                borderRadius: 2,
                '&:hover': { bgcolor: '#f8fafc' }
              }}
            >
              {t('landing.cta.button')}
            </Button>
          </Box>
          <Box sx={{ 
            position: 'absolute', 
            top: -50, 
            left: -50, 
            width: 300, 
            height: 300, 
            borderRadius: '50%', 
            background: 'rgba(255,255,255,0.1)',
            filter: 'blur(50px)'
          }} />
          <Box sx={{ 
            position: 'absolute', 
            bottom: -50, 
            right: -50, 
            width: 300, 
            height: 300, 
            borderRadius: '50%', 
            background: 'rgba(255,255,255,0.1)',
            filter: 'blur(50px)'
          }} />
        </Box>
      </Container>

      {/* Footer */}
      <Box sx={{ py: 8, borderTop: `1px solid ${cardBorder}`, bgcolor: resolvedMode === 'dark' ? alpha('#0f172a', 0.5) : '#f8fafc' }}>
        <Container maxWidth="lg">
          <Grid container spacing={5}>
            <Grid item xs={12} md={4} sx={{ textAlign: direction === 'rtl' ? 'right' : 'left' }}>
              <Typography variant="h5" sx={{ fontWeight: 800, mb: 3 }}>
                HRM<Box component="span" sx={{ color: '#6366f1' }}>FLOW</Box>
              </Typography>
              <Typography variant="body1" sx={{ color: subTextColor, maxWidth: 300 }}>
                {t('landing.footer.description')}
              </Typography>
            </Grid>
            <Grid item xs={6} md={2} sx={{ textAlign: direction === 'rtl' ? 'right' : 'left' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>{t('landing.footer.product')}</Typography>
              <Stack spacing={1.5}>
                <Typography variant="body2" sx={{ color: subTextColor, cursor: 'pointer' }}>{t('landing.footer.features')}</Typography>
                <Typography variant="body2" sx={{ color: subTextColor, cursor: 'pointer' }}>{t('landing.footer.pricing')}</Typography>
                <Typography variant="body2" sx={{ color: subTextColor, cursor: 'pointer' }}>{t('landing.footer.integrations')}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={6} md={2} sx={{ textAlign: direction === 'rtl' ? 'right' : 'left' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>{t('landing.footer.company')}</Typography>
              <Stack spacing={1.5}>
                <Typography variant="body2" sx={{ color: subTextColor, cursor: 'pointer' }}>{t('landing.footer.aboutUs')}</Typography>
                <Typography variant="body2" sx={{ color: subTextColor, cursor: 'pointer' }}>{t('landing.footer.careers')}</Typography>
                <Typography variant="body2" sx={{ color: subTextColor, cursor: 'pointer' }}>{t('landing.footer.blog')}</Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: direction === 'rtl' ? 'right' : 'left' }}>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>{t('landing.footer.support')}</Typography>
              <Typography variant="body2" sx={{ color: subTextColor, mb: 2 }}>
                {t('landing.footer.newsletterDescription')}
              </Typography>
              <Stack direction="row" spacing={1}>
                <TextField 
                  size="small" 
                  placeholder={t('landing.footer.emailPlaceholder')}
                  sx={{ 
                    bgcolor: resolvedMode === 'dark' ? '#1e293b' : '#ffffff', 
                    borderRadius: 1,
                    '& .MuiOutlinedInput-root': { color: textColor, '& fieldset': { borderColor: cardBorder } }
                  }} 
                />
                <Button variant="contained" sx={{ bgcolor: '#6366f1' }}>{t('landing.footer.join')}</Button>
              </Stack>
            </Grid>
          </Grid>
          <Box sx={{ mt: 8, pt: 4, borderTop: `1px solid ${cardBorder}`, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: subTextColor }}>
              © {new Date().getFullYear()} HRMFLOW. {t('landing.footer.rights')}
            </Typography>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
