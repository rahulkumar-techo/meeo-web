/**
 * @file device.ts
 * @description Device metadata helper for authentication and session tracking.
 * Ensures deviceName and deviceId strictly adhere to backend API constraints (max 100 characters).
 */

export interface DeviceInfo {
  deviceName: string;
  deviceId: string;
}

const DEVICE_ID_KEY = 'urban_device_id';

/**
 * Returns a human-friendly, concise device description strictly under 100 characters.
 * Avoids passing raw userAgent which exceeds 100 characters.
 * Example outputs: "Chrome on Windows", "Safari on macOS", "Chrome on Android"
 */
export function getDeviceInfo(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      deviceName: 'Web Browser',
      deviceId: 'web-client',
    };
  }

  // Retrieve or create persistent unique device identifier
  let deviceId = '';
  try {
    deviceId = localStorage.getItem(DEVICE_ID_KEY) || '';
    if (!deviceId) {
      deviceId = `web_${Math.random().toString(36).substring(2, 10)}_${Date.now().toString(36)}`;
      localStorage.setItem(DEVICE_ID_KEY, deviceId);
    }
  } catch {
    deviceId = `web_${Date.now().toString(36)}`;
  }

  // Parse clean browser name
  const ua = navigator.userAgent || '';
  let browser = 'Browser';
  if (ua.includes('Edg/')) {
    browser = 'Edge';
  } else if (ua.includes('Chrome/')) {
    browser = 'Chrome';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome/')) {
    browser = 'Safari';
  } else if (ua.includes('Firefox/')) {
    browser = 'Firefox';
  } else if (ua.includes('Opera/') || ua.includes('OPR/')) {
    browser = 'Opera';
  }

  // Parse operating system / device category
  let os = 'Device';
  if (ua.includes('iPhone')) {
    os = 'iPhone';
  } else if (ua.includes('iPad')) {
    os = 'iPad';
  } else if (ua.includes('Android')) {
    os = 'Android';
  } else if (ua.includes('Windows')) {
    os = 'Windows';
  } else if (ua.includes('Mac OS')) {
    os = 'macOS';
  } else if (ua.includes('Linux')) {
    os = 'Linux';
  }

  // Ensure length is always well below the 100-character maximum
  const deviceName = `${browser} on ${os}`.slice(0, 80);

  return {
    deviceName,
    deviceId: deviceId.slice(0, 80),
  };
}

/**
 * Parses and extracts specific validation error messages from backend responses.
 * Correctly extracts messages from:
 * - { message: "Validation failed", errors: { "0": { field: "/deviceName", message: "must NOT have more than 100 characters" } } }
 * - { message: "Invalid credentials" }
 */
export function formatApiErrorMessage(err: any, fallback = 'Operation failed'): string {
  const data = err?.response?.data;
  if (!data) return err?.message || fallback;

  if (data.errors) {
    if (Array.isArray(data.errors) && data.errors.length > 0) {
      const first = data.errors[0];
      return typeof first === 'string' ? first : first.message || data.message || fallback;
    }
    if (typeof data.errors === 'object') {
      const values = Object.values(data.errors);
      if (values.length > 0) {
        const first: any = values[0];
        if (typeof first === 'string') return first;
        if (Array.isArray(first) && first.length > 0) return first[0];
        if (first?.message) return first.message;
      }
    }
  }

  return data.message || fallback;
}
