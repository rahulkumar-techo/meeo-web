'use client';

import React from 'react';
import Chip, { ChipProps } from '@mui/material/Chip';

/**
 * Meeo Unified Badge / Chip Component
 * Uses Material UI Chip styled with Meeo's editorial tag tokens.
 *
 * @param variant - Preset styling ('primary' | 'coral' | 'neutral' | 'success' | 'outline' | 'drop')
 * @param size - Size scale ('sm' | 'md')
 * @param dot - Optional live indicator dot
 */
export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'coral' | 'neutral' | 'success' | 'outline' | 'drop';
  size?: 'sm' | 'md';
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  dot = false,
}) => {
  const variantStyles = {
    primary: {
      backgroundColor: '#e2e7ff',
      color: '#412ce7',
    },
    coral: {
      backgroundColor: '#ffdad2',
      color: '#ae3115',
    },
    neutral: {
      backgroundColor: '#f2f3ff',
      color: '#464556',
    },
    success: {
      backgroundColor: '#dcfce7',
      color: '#15803d',
    },
    outline: {
      backgroundColor: 'transparent',
      border: '1px solid #c7c4d9',
      color: '#464556',
    },
    drop: {
      backgroundColor: '#fd6a49',
      color: '#ffffff',
      boxShadow: '0 1px 4px rgba(253, 106, 73, 0.3)',
    },
  }[variant];

  const dotColor = variant === 'drop' || variant === 'coral' ? '#ffffff' : '#fd6a49';

  return (
    <Chip
      size={size === 'sm' ? 'small' : 'medium'}
      label={
        <span className="flex items-center gap-1.5 font-bold uppercase tracking-wider text-[11px]">
          {dot && (
            <span
              className="w-1.5 h-1.5 rounded-full inline-block"
              style={{ backgroundColor: dotColor }}
            />
          )}
          {children}
        </span>
      }
      className={className}
      sx={{
        height: size === 'sm' ? 22 : 28,
        borderRadius: 9999,
        fontFamily: 'var(--font-plus-jakarta), sans-serif',
        fontWeight: 700,
        ...variantStyles,
      }}
    />
  );
};
