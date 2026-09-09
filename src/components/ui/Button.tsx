'use client';

import React from 'react';
import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * Meeo Unified Button Component
 * Built on top of Material UI Button with custom brand variants and animations.
 *
 * @param variant - Brand styling preset ('primary' | 'secondary' | 'coral' | 'outline' | 'ghost' | 'tonal')
 * @param size - Size scale ('sm' | 'md' | 'lg' | 'icon')
 * @param isLoading - Displays an integrated circular loading indicator
 * @param leftIcon - Icon rendered before the button children
 * @param rightIcon - Icon rendered after the button children
 */
export interface ButtonProps extends Omit<MuiButtonProps, 'size' | 'variant'> {
  variant?: 'primary' | 'secondary' | 'coral' | 'outline' | 'ghost' | 'tonal';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  sx,
  ...props
}) => {
  // Map our size tokens to MUI dimensions and padding
  const sizeStyles = {
    sm: { height: 32, px: 2, fontSize: '0.75rem', borderRadius: '0.625rem' },
    md: { height: 40, px: 2.5, fontSize: '0.875rem', borderRadius: '0.75rem' },
    lg: { height: 48, px: 3.5, fontSize: '1rem', borderRadius: '0.875rem', fontWeight: 700 },
    icon: { width: 40, height: 40, minWidth: 40, p: 0, borderRadius: '0.75rem' },
  }[size];

  // Brand variant styles using Meeo color foundation
  const variantStyles = {
    primary: {
      backgroundColor: '#412ce7',
      color: '#ffffff',
      boxShadow: '0 2px 8px rgba(65, 44, 231, 0.25)',
      '&:hover': {
        backgroundColor: '#5b4dff',
        boxShadow: '0 4px 14px rgba(65, 44, 231, 0.35)',
      },
    },
    secondary: {
      backgroundColor: '#eaedff',
      color: '#412ce7',
      fontWeight: 700,
      '&:hover': {
        backgroundColor: '#dae2fd',
      },
    },
    coral: {
      backgroundColor: '#fd6a49',
      color: '#ffffff',
      boxShadow: '0 2px 8px rgba(253, 106, 73, 0.3)',
      '&:hover': {
        backgroundColor: '#e05736',
        boxShadow: '0 4px 14px rgba(253, 106, 73, 0.4)',
      },
    },
    outline: {
      border: '1px solid #c7c4d9',
      color: '#131b2e',
      backgroundColor: 'transparent',
      '&:hover': {
        borderColor: '#412ce7',
        backgroundColor: '#f2f3ff',
      },
    },
    ghost: {
      color: '#464556',
      backgroundColor: 'transparent',
      '&:hover': {
        color: '#131b2e',
        backgroundColor: 'rgba(234, 237, 255, 0.6)',
      },
    },
    tonal: {
      backgroundColor: '#f2f3ff',
      color: '#131b2e',
      '&:hover': {
        backgroundColor: '#eaedff',
      },
    },
  }[variant];

  return (
    <MuiButton
      disabled={disabled || isLoading}
      disableElevation
      className={className}
      sx={{
        textTransform: 'none',
        fontFamily: 'var(--font-plus-jakarta), sans-serif',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: size === 'sm' ? 1 : 1.25,
        transition: 'all 0.18s ease-in-out',
        cursor: 'pointer',
        ...sizeStyles,
        ...variantStyles,
        ...sx,
      }}
      {...props}
    >
      {isLoading ? (
        <CircularProgress size={16} color="inherit" sx={{ mr: children ? 1 : 0 }} />
      ) : (
        leftIcon && <span className="shrink-0 flex items-center">{leftIcon}</span>
      )}
      {children}
      {!isLoading && rightIcon && (
        <span className="shrink-0 flex items-center">{rightIcon}</span>
      )}
    </MuiButton>
  );
};
