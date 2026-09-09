'use client';

import React from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Meeo Unified Modal / Dialog Component
 * Built on Material UI Dialog with backdrop blur, smooth spring transitions, and brand styling.
 *
 * @param isOpen - Open state boolean
 * @param onClose - Triggered upon backdrop click or escape key
 * @param title - Modal title string
 * @param maxWidth - Scale constraint ('xs' | 'sm' | 'md' | 'lg' | 'xl')
 */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  position?: 'center' | 'top';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
  position = 'center',
}) => {
  const muiMaxWidth = maxWidth === '2xl' ? 'lg' : maxWidth;

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth={muiMaxWidth}
      transitionDuration={240}
      disableScrollLock={true}
      sx={{
        ...(position === 'top' && {
          '& .MuiDialog-container': {
            alignItems: 'flex-start',
            pt: { xs: 2, sm: 6, md: 8 },
          },
        }),
      }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: '1.5rem',
            backgroundColor: 'background.paper',
            color: 'text.primary',
            backgroundImage: 'none',
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.35)',
            border: '1px solid',
            borderColor: 'divider',
            overflow: 'hidden',
            p: 0,
            ...(position === 'top' && {
              m: { xs: 1.5, sm: 2 },
            }),
          },
        },
        backdrop: {
          sx: {
            backdropFilter: 'blur(6px)',
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
          },
        },
      }}
    >
      {title && (
        <DialogTitle
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            px: 3.5,
            py: 2.5,
            borderBottom: '1px solid',
            borderColor: 'divider',
            fontFamily: 'var(--font-plus-jakarta), sans-serif',
            fontWeight: 800,
            fontSize: '1.125rem',
            color: 'text.primary',
          }}
        >
          <span>{title}</span>
          <IconButton
            aria-label="close"
            onClick={onClose}
            size="small"
            sx={{
              color: '#777588',
              '&:hover': { color: '#131b2e', backgroundColor: '#f2f3ff' },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
      )}

      <DialogContent sx={{ p: 3.5, fontFamily: 'var(--font-plus-jakarta), sans-serif' }}>
        {children}
      </DialogContent>
    </Dialog>
  );
};
