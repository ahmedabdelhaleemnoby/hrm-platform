import { createTheme, ThemeProvider as MUIThemeProvider, Theme, useMediaQuery } from '@mui/material';
import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

type ThemeMode = 'light' | 'dark' | 'auto';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  resolvedMode: 'light' | 'dark'; // The actual applied mode (after resolving 'auto')
  language: string;
  setLanguage: (lang: string) => void;
  direction: 'ltr' | 'rtl';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeContextProvider');
  }
  return context;
};

const getDesignTokens = (mode: 'light' | 'dark', direction: 'ltr' | 'rtl') => ({
  direction,
  palette: {
    mode,
    primary: {
      main: '#667eea',
    },
    secondary: {
      main: '#764ba2',
    },
    ...(mode === 'dark' && {
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
    }),
  },
  typography: {
    fontFamily: direction === 'rtl' ? 'Cairo, Arial, sans-serif' : 'Inter, Arial, sans-serif',
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none' as const,
          fontWeight: 600,
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          ...(mode === 'dark' && {
            background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
          }),
        },
      },
    },
  },
});

interface ThemeContextProviderProps {
  children: ReactNode;
}

export const ThemeContextProvider: React.FC<ThemeContextProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  
  // Detect system preference
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  const [themeMode, setThemeModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('themeMode');
    if (saved === 'light' || saved === 'dark' || saved === 'auto') {
      return saved;
    }
    return 'auto'; // Default to auto mode
  });
  
  const [language, setLanguageState] = useState(() => {
    return localStorage.getItem('i18nextLng') || 'en';
  });

  // Resolve the actual mode based on user preference
  const resolvedMode: 'light' | 'dark' = useMemo(() => {
    if (themeMode === 'auto') {
      return prefersDarkMode ? 'dark' : 'light';
    }
    return themeMode;
  }, [themeMode, prefersDarkMode]);

  const direction: 'ltr' | 'rtl' = language === 'ar' ? 'rtl' : 'ltr';

  const setThemeMode = (mode: ThemeMode) => {
    setThemeModeState(mode);
    localStorage.setItem('themeMode', mode);
  };

  const setLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    setLanguageState(lang);
    localStorage.setItem('i18nextLng', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [direction, language]);

  const theme: Theme = useMemo(
    () => createTheme(getDesignTokens(resolvedMode, direction)),
    [resolvedMode, direction]
  );

  return (
    <ThemeContext.Provider value={{ themeMode, setThemeMode, resolvedMode, language, setLanguage, direction }}>
      <MUIThemeProvider theme={theme}>
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};
