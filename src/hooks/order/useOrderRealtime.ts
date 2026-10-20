'use client';

/**
 * @file useOrderRealtime.ts
 * @description Real-time WebSocket hook for live order fulfillment tracking and automatic TanStack Query cache updates.
 */

import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { realtimeSocket, type RealtimeOrderEventPayload } from '@/lib/socket';
import { queryKeys } from '@/hooks/queryKeys';
import { useUserStore } from '@/store/user.store';

/**
 * Hook to subscribe to live order tracking WebSocket updates.
 */
export function useOrderRealtime(
  orderId?: string,
  onUpdate?: (event: RealtimeOrderEventPayload) => void
) {
  const queryClient = useQueryClient();
  const token = useUserStore((s) => s.accessToken);

  useEffect(() => {
    if (!orderId || typeof window === 'undefined') return;

    // Connect socket with bearer token if authenticated
    if (token) {
      realtimeSocket.connect(token);
    }

    realtimeSocket.joinOrder(orderId);

    const handleOrderEvent = (payload: RealtimeOrderEventPayload) => {
      if (!payload || payload.orderId === orderId || !payload.orderId) {
        // Invalidate all order queries so active UI refetches immediately
        queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });

        // Optimistically update specific order details in TanStack Query cache if matching
        if (orderId && (!payload.orderId || payload.orderId === orderId)) {
          queryClient.setQueryData(queryKeys.orders.detail(orderId), (prev: any) => {
            if (!prev?.data) return prev;
            return {
              ...prev,
              data: {
                ...prev.data,
                status: payload.status || prev.data.status,
                tracking: payload.tracking || prev.data.tracking,
                statusHistory: payload.note
                  ? [
                      ...(prev.data.statusHistory || []),
                      {
                        status: payload.status,
                        timestamp: payload.timestamp || new Date().toISOString(),
                        note: payload.note,
                      },
                    ]
                  : prev.data.statusHistory,
              },
            };
          });
        }

        if (onUpdate) {
          onUpdate(payload);
        }
      }
    };

    const unsubConfirmed = realtimeSocket.on('order.confirmed', handleOrderEvent);
    const unsubProcessing = realtimeSocket.on('order.processing', handleOrderEvent);
    const unsubShipped = realtimeSocket.on('order.shipped', handleOrderEvent);
    const unsubDelivered = realtimeSocket.on('order.delivered', handleOrderEvent);
    const unsubCancelled = realtimeSocket.on('order.cancelled', handleOrderEvent);
    const unsubUpdated = realtimeSocket.on('order.updated', handleOrderEvent);
    const unsubStatusChanged = realtimeSocket.on('order_status_changed', handleOrderEvent);
    const unsubStatus = realtimeSocket.on('order:status', handleOrderEvent);

    return () => {
      unsubConfirmed();
      unsubProcessing();
      unsubShipped();
      unsubDelivered();
      unsubCancelled();
      unsubUpdated();
      unsubStatusChanged();
      unsubStatus();
    };
  }, [orderId, token, queryClient, onUpdate]);
}
