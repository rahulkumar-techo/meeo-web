'use client';

import React, { useMemo } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { useTheme as useMeeoTheme } from '@/context/ThemeContext';

export const MuiThemeRegistry: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { resolvedTheme } = useMeeoTheme();

  const theme = useMemo(() => {
    const isDark = resolvedTheme === 'dark';

    return createTheme({
      palette: {
        mode: isDark ? 'dark' : 'light',
        primary: {
          main: '#412ce7',
          light: '#5b4dff',
          dark: '#3311dc',
          contrastText: '#ffffff',
        },
        secondary: {
          main: '#fd6a49',
          light: '#ff8f73',
          dark: '#ae3115',
          contrastText: '#ffffff',
        },
        background: {
          default: isDark ? '#0f131f' : '#faf8ff',
          paper: isDark ? '#161b2b' : '#ffffff',
        },
        text: {
          primary: isDark ? '#eef0ff' : '#131b2e',
          secondary: isDark ? '#a0a4b8' : '#464556',
        },
        divider: isDark ? '#2b334d' : '#e2e7ff',
      },
      typography: {
        fontFamily: 'var(--font-plus-jakarta), -apple-system, BlinkMacSystemFont, sans-serif',
        button: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
      shape: {
        borderRadius: 12,
      },
      components: {
        MuiButton: {
          styleOverrides: {
            root: {
              borderRadius: 12,
              padding: '8px 18px',
              fontSize: '0.875rem',
              boxShadow: 'none',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(65, 44, 231, 0.2)',
                transform: 'translateY(-1px)',
              },
              '&:active': {
                transform: 'translateY(0)',
              },
            },
          },
        },
        MuiChip: {
          styleOverrides: {
            root: {
              borderRadius: 9999,
              fontWeight: 600,
              fontSize: '0.75rem',
            },
          },
        },
        MuiSwitch: {
          styleOverrides: {
            switchBase: {
              '&.Mui-checked': {
                color: '#412ce7',
                '& + .MuiSwitch-track': {
                  backgroundColor: '#412ce7',
                  opacity: 0.9,
                },
              },
            },
          },
        },
        MuiSlider: {
          styleOverrides: {
            root: {
              color: '#412ce7',
            },
          },
        },
      },
    });
  }, [resolvedTheme]);

  return (
    <ThemeProvider theme={theme}>
      {children}
    </ThemeProvider>
  );
};
