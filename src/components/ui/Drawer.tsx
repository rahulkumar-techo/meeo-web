'use client';

import React from 'react';
import MuiDrawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Meeo Unified Drawer Component
 * Built on Material UI Drawer with slide-over animations for Cart, Navigation, and Filters.
 *
 * @param isOpen - Visibility toggle boolean
 * @param onClose - Callback invoked when backdrop or close button is clicked
 * @param title - Header title string
 * @param subtitle - Optional description below title
 * @param position - Anchor position ('right' | 'left' | 'bottom')
 * @param footer - Sticky footer actions container
 */
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  position?: 'right' | 'left' | 'bottom';
  footer?: React.ReactNode;
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  subtitle,
  children,
  position = 'right',
  footer,
}) => {
  const anchor = position === 'right' ? 'right' : position === 'left' ? 'left' : 'bottom';

  return (
    <MuiDrawer
      anchor={anchor}
      open={isOpen}
      onClose={onClose}
      transitionDuration={320}
      disableScrollLock={true}
      slotProps={{
        paper: {
          sx: {
            width: position === 'bottom' ? '100%' : { xs: '100%', sm: 440 },
            maxHeight: position === 'bottom' ? '85vh' : '100%',
            borderTopLeftRadius: position === 'bottom' || position === 'right' ? '1.5rem' : 0,
            borderBottomLeftRadius: position === 'right' ? '1.5rem' : 0,
            backgroundColor: 'background.paper',
            color: 'text.primary',
            backgroundImage: 'none',
            boxShadow: '0 24px 64px rgba(0, 0, 0, 0.35)',
            display: 'flex',
            flexDirection: 'column',
          },
        },
        backdrop: {
          sx: {
            backdropFilter: 'blur(4px)',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-[#e2e7ff] shrink-0">
        <div>
          {title && (
            <h3 className="text-lg font-extrabold text-[#131b2e] tracking-tight">{title}</h3>
          )}
          {subtitle && (
            <p className="text-xs text-[#464556] mt-0.5 font-medium">{subtitle}</p>
          )}
        </div>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: '#777588',
            '&:hover': { color: '#131b2e', backgroundColor: '#f2f3ff' },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>

      {/* Scrollable Content Body */}
      <div className="flex-1 overflow-y-auto p-6">{children}</div>

      {/* Optional Sticky Footer */}
      {footer && (
        <div className="p-6 border-t border-[#e2e7ff] bg-[#faf8ff] shrink-0">
          {footer}
        </div>
      )}
    </MuiDrawer>
  );
};
