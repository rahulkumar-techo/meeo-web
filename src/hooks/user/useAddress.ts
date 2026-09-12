'use client';

/**
 * @file useAddress.ts
 * @description Saved delivery and billing address queries & mutations with TanStack Query caching.
 */

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { addressService } from '@/services/user/addressService';
import { queryKeys } from '@/hooks/queryKeys';
import { useUserStore } from '@/store/user.store';
import type { ApiResponse } from '@/types/common/api.types';
import type {
  SavedAddress,
  CreateAddressPayload,
  UpdateAddressPayload,
} from '@/types/user/user.types';

/**
 * Fetch all saved delivery/billing addresses for authenticated customer.
 * Stale time: 5 mins.
 */
export function useAddressesQuery() {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);

  return useQuery<SavedAddress[]>({
    queryKey: queryKeys.user.addresses(),
    queryFn: async () => {
      const res = await addressService.getAddresses();
      return res.data || [];
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Add a new saved address.
 */
export function useCreateAddressMutation() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<SavedAddress>, Error, CreateAddressPayload>({
    mutationFn: (payload) => addressService.createAddress(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.addresses() });
    },
  });
}

/**
 * Update an existing saved address.
 */
export function useUpdateAddressMutation() {
  const queryClient = useQueryClient();

  return useMutation<
    ApiResponse<SavedAddress>,
    Error,
    { addressId: string; payload: UpdateAddressPayload }
  >({
    mutationFn: ({ addressId, payload }) => addressService.updateAddress(addressId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.addresses() });
    },
  });
}

/**
 * Delete a saved address.
 */
export function useDeleteAddressMutation() {
  const queryClient = useQueryClient();

  return useMutation<ApiResponse<null>, Error, string>({
    mutationFn: (addressId) => addressService.deleteAddress(addressId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user.addresses() });
    },
  });
}
