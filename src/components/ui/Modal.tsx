'use client';

import React, { useEffect } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

/**
 * Meeo Unified Modal / Dialog Component
 * Built on Material UI Dialog with backdrop blur, responsive full-screen support, and strict background scroll lock.
 *
 * @param isOpen - Open state boolean
 * @param onClose - Triggered upon backdrop click or escape key
 * @param title - Modal title string
 * @param maxWidth - Scale constraint ('xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl')
 * @param fullScreenOnMobile - If true, takes 100% viewport on mobile devices (<640px)
 */
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  position?: 'center' | 'top';
  fullScreenOnMobile?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'md',
  position = 'center',
  fullScreenOnMobile = false,
}) => {
  const muiMaxWidth = maxWidth === '2xl' ? 'lg' : maxWidth;

  // Ensure documentElement never retains stale overflow locks when modal is closed
  useEffect(() => {
    if (!isOpen) {
      document.documentElement.style.overflow = '';
    }
  }, [isOpen]);

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth={muiMaxWidth}
      transitionDuration={200}
      disableScrollLock={false}
      sx={{
        ...(position === 'top' && {
          '& .MuiDialog-container': {
            alignItems: { xs: fullScreenOnMobile ? 'stretch' : 'flex-start', sm: 'flex-start' },
            pt: { xs: fullScreenOnMobile ? 0 : 2, sm: 6, md: 8 },
          },
        }),
      }}
      slotProps={{
        paper: {
          sx: {
            borderRadius: { xs: fullScreenOnMobile ? 0 : '1.5rem', sm: '1.5rem' },
            backgroundColor: 'background.paper',
            color: 'text.primary',
            backgroundImage: 'none',
            boxShadow: '0 24px 48px rgba(0, 0, 0, 0.35)',
            border: { xs: fullScreenOnMobile ? 'none' : '1px solid', sm: '1px solid' },
            borderColor: 'divider',
            overflow: 'hidden',
            overscrollBehavior: 'contain',
            p: 0,
            m: {
              xs: fullScreenOnMobile ? 0 : 1.5,
              sm: position === 'top' ? 2 : 'auto',
            },
            ...(fullScreenOnMobile && {
              width: { xs: '100vw', sm: 'auto' },
              minHeight: { xs: '100vh', sm: 'auto' },
              height: { xs: '100%', sm: 'auto' },
              maxHeight: { xs: '100vh', sm: 'calc(100% - 64px)' },
            }),
          },
        },
        backdrop: {
          sx: {
            backdropFilter: 'blur(6px)',
            backgroundColor: 'rgba(0, 0, 0, 0.55)',
            touchAction: 'none',
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
            px: { xs: 2.5, sm: 3.5 },
            py: { xs: 2, sm: 2.5 },
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

      <DialogContent
        sx={{
          p: { xs: 2.5, sm: 3.5 },
          fontFamily: 'var(--font-plus-jakarta), sans-serif',
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          overscrollBehavior: 'contain',
          touchAction: 'pan-y',
        }}
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};
