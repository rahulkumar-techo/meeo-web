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
      if (payload.orderId === orderId) {
        // Update specific order details in TanStack Query cache
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

        // Invalidate list queries
        queryClient.invalidateQueries({ queryKey: queryKeys.orders.list() });

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

    return () => {
      unsubConfirmed();
      unsubProcessing();
      unsubShipped();
      unsubDelivered();
      unsubCancelled();
    };
  }, [orderId, token, queryClient, onUpdate]);
}
