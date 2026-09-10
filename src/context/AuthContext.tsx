'use client';

import React from 'react';
export { useAuth, useUserStore } from '@/store/user.store';

/**
 * Pass-through provider for backwards compatibility (Zustand does not require Provider)
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

