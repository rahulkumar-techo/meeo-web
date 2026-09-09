'use client';

import React from 'react';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

/**
 * Meeo Unified Input Field Component
 * Uses Material UI TextField with custom rounded borders, focus rings, and icon adornments.
 *
 * @param label - Floating or upper label for the input field
 * @param error - Error string message (sets error state)
 * @param helperText - Subtitle or formatting hint
 * @param leftIcon - Prefix adornment
 * @param rightIcon - Suffix adornment
 */
export type InputProps = Omit<TextFieldProps, 'variant'> & {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

export const Input = React.forwardRef<HTMLDivElement, InputProps>(
  ({ label, error, helperText, leftIcon, rightIcon, className = '', sx, ...props }, ref) => {
    return (
      <TextField
        ref={ref}
        label={label}
        error={Boolean(error)}
        helperText={error || helperText}
        variant="outlined"
        fullWidth
        className={className}
        slotProps={{
          input: {
            startAdornment: leftIcon ? (
              <InputAdornment position="start" sx={{ color: '#777588' }}>
                {leftIcon}
              </InputAdornment>
            ) : undefined,
            endAdornment: rightIcon ? (
              <InputAdornment position="end" sx={{ color: '#777588' }}>
                {rightIcon}
              </InputAdornment>
            ) : undefined,
          },
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            borderRadius: '0.75rem',
            backgroundColor: 'background.paper',
            fontFamily: 'var(--font-plus-jakarta), sans-serif',
            fontSize: '0.875rem',
            color: 'text.primary',
            '& fieldset': {
              borderColor: 'divider',
            },
            '&:hover fieldset': {
              borderColor: 'primary.light',
            },
            '&.Mui-focused fieldset': {
              borderColor: 'primary.main',
              borderWidth: '2px',
            },
          },
          '& .MuiInputLabel-root': {
            fontFamily: 'var(--font-plus-jakarta), sans-serif',
            fontSize: '0.875rem',
            fontWeight: 600,
            color: 'text.secondary',
            '&.Mui-focused': {
              color: 'primary.main',
            },
          },
          '& .MuiFormHelperText-root': {
            fontFamily: 'var(--font-plus-jakarta), sans-serif',
            fontSize: '0.75rem',
          },
          ...sx,
        }}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
