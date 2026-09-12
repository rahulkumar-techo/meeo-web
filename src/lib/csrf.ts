/**
 * @file csrf.ts
 * @description In-memory store and helper for managing Double-Submit CSRF tokens.
 */

let inMemoryCsrfToken: string | null = null;

/**
 * Get current cached CSRF token.
 */
export function getStoredCsrfToken(): string | null {
  return inMemoryCsrfToken;
}

/**
 * Store updated CSRF token.
 */
export function setStoredCsrfToken(token: string | null): void {
  inMemoryCsrfToken = token;
}
