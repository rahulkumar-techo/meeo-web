/**
 * @file session.ts
 * @description Manages anonymous guest shopper session UUIDs stored in browser localStorage.
 */

const GUEST_SESSION_KEY = 'x-session-id';

/**
 * Generate a random RFC4122 compliant UUID v4 string in vanilla JS
 */
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Retrieves the existing guest session ID or initializes a new one.
 */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') {
    return '';
  }

  try {
    let sessionId = localStorage.getItem(GUEST_SESSION_KEY);
    if (!sessionId) {
      sessionId = `guest_${generateUUID()}`;
      localStorage.setItem(GUEST_SESSION_KEY, sessionId);
    }
    return sessionId;
  } catch {
    return '';
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
