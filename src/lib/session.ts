/**
 * @file session.ts
 * @description Manages anonymous guest shopper session UUIDs stored in browser localStorage.
 */

const GUEST_SESSION_KEY = 'x-session-id';

/**
 * Retrieves the stored guest session ID from localStorage.
 */
export function getStoredSessionId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  try {
    return localStorage.getItem(GUEST_SESSION_KEY) || '';
  } catch {
    return '';
  }
}

/**
 * Persists the guest session ID returned by the backend.
 */
export function setSessionId(sessionId: string): void {
  if (typeof window === 'undefined' || !sessionId) {
    return;
  }

  try {
    localStorage.setItem(GUEST_SESSION_KEY, sessionId);
  } catch {
    // Ignore localStorage access errors
  }
}

/**
 * Removes the guest session ID upon user login or cart merge.
 */
export function clearSessionId(): void {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(GUEST_SESSION_KEY);
    } catch {
      // Ignore localStorage access errors
    }
  }
}

