/**
 * @file socket.ts
 * @description WebSocket / Real-time client manager for order tracking, push alerts, and status changes.
 */

import { API_BASE_URL } from '@/config/client';

export type OrderEventType =
  | 'order.confirmed'
  | 'order.processing'
  | 'order.shipped'
  | 'order.delivered'
  | 'order.cancelled'
  | 'payment.success'
  | 'notification.created';

export interface RealtimeOrderEventPayload {
  orderId: string;
  status: string;
  tracking?: {
    carrier?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    shippedAt?: string;
    estimatedDelivery?: string;
  };
  note?: string;
  timestamp: string;
}

type EventCallback = (payload: any) => void;

class RealtimeSocketManager {
  private socket: WebSocket | null = null;
  private listeners: Map<string, Set<EventCallback>> = new Map();
  private isConnected = false;
  private token: string | null = null;
  private reconnectTimer: NodeJS.Timeout | null = null;

  /**
   * Connect to backend WebSocket / Socket endpoint with JWT authentication.
   */
  public connect(token?: string, url?: string): void {
    if (typeof window === 'undefined') return;
    if (this.socket && (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING)) {
      return;
    }

    this.token = token || null;
    let wsBaseUrl = url || process.env.NEXT_PUBLIC_WS_URL;
    if (!wsBaseUrl) {
      if (API_BASE_URL && API_BASE_URL.startsWith('http')) {
        wsBaseUrl = API_BASE_URL.replace(/^http/, 'ws').replace(/\/api\/v1\/?$/, '');
      } else if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.startsWith('http')) {
        wsBaseUrl = process.env.NEXT_PUBLIC_API_URL.replace(/^http/, 'ws').replace(/\/api\/v1\/?$/, '');
      } else if (typeof window !== 'undefined') {
        const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        wsBaseUrl = `${proto}//${window.location.host}`;
      } else {
        wsBaseUrl = 'ws://localhost:5000';
      }
    }

    const fullUrl = this.token
      ? `${wsBaseUrl}/socket.io/?token=${encodeURIComponent(this.token)}&transport=websocket`
      : `${wsBaseUrl}/socket.io/?transport=websocket`;

    try {
      this.socket = new WebSocket(fullUrl);

      this.socket.onopen = () => {
        this.isConnected = true;
        this.emitLocal('system.connect_success', { connected: true, timestamp: new Date().toISOString() });
      };

      this.socket.onmessage = (event) => {
        try {
          const raw = typeof event.data === 'string' ? event.data : '';
          // Handle Socket.io Engine.io packet prefixes like '42["order.shipped", {...}]'
          if (raw.startsWith('42')) {
            const arr = JSON.parse(raw.substring(2));
            if (Array.isArray(arr) && arr.length >= 2) {
              this.emitLocal(arr[0], arr[1]);
              return;
            }
          }
          const parsed = JSON.parse(raw);
          if (parsed && (parsed.event || parsed.type)) {
            this.emitLocal(parsed.event || parsed.type, parsed.data || parsed.payload || parsed);
          }
        } catch {
          // Plain message handling
        }
      };

      this.socket.onclose = () => {
        this.isConnected = false;
        this.scheduleReconnect();
      };

      this.socket.onerror = () => {
        this.isConnected = false;
      };
    } catch {
      this.scheduleReconnect();
    }
  }

  private scheduleReconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      if (this.token) {
        this.connect(this.token);
      }
    }, 5000);
  }

  /**
   * Subscribe to an event topic.
   */
  public on(event: string, callback: EventCallback): () => void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);

    return () => {
      this.listeners.get(event)?.delete(callback);
    };
  }

  /**
   * Emit local event to registered listeners.
   */
  private emitLocal(event: string, data: any) {
    const callbacks = this.listeners.get(event);
    if (callbacks) {
      callbacks.forEach((cb) => {
        try {
          cb(data);
        } catch (e) {
          console.error(`Error in event listener for ${event}:`, e);
        }
      });
    }
  }

  /**
   * Join an order tracking room.
   */
  public joinOrder(orderId: string): void {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify({ action: 'join:order', orderId }));
    }
  }

  /**
   * Disconnect the socket.
   */
  public disconnect(): void {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.socket) {
      this.socket.close();
      this.socket = null;
    }
    this.isConnected = false;
    this.listeners.clear();
  }
}

export const realtimeSocket = new RealtimeSocketManager();
