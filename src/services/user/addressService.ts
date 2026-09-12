/**
 * @file addressService.ts
 * @description Customer address book management (shipping/billing address CRUD operations).
 */

import { apiClient } from '@/config/client';
import type { ApiResponse } from '@/types/common/api.types';
import type {
  SavedAddress,
  CreateAddressPayload,
  UpdateAddressPayload,
} from '@/types/user/user.types';

export const addressService = {
  /**
   * Fetch all saved customer shipping and billing addresses.
   */
  async getAddresses(): Promise<ApiResponse<SavedAddress[]>> {
    try {
      const response = await apiClient.get<ApiResponse<SavedAddress[]>>('/user/addresses');
      return response.data;
    } catch {
      return { success: true, data: [] };
    }
  },

  /**
   * Add a new saved address.
   */
  async createAddress(payload: CreateAddressPayload): Promise<ApiResponse<SavedAddress>> {
    const response = await apiClient.post<ApiResponse<SavedAddress>>('/user/addresses', payload);
    return response.data;
  },

  /**
   * Update an existing address.
   */
  async updateAddress(
    addressId: string,
    payload: UpdateAddressPayload
  ): Promise<ApiResponse<SavedAddress>> {
    const response = await apiClient.patch<ApiResponse<SavedAddress>>(
      `/user/addresses/${addressId}`,
      payload
    );
    return response.data;
  },

  /**
   * Delete a saved address.
   */
  async deleteAddress(addressId: string): Promise<ApiResponse<null>> {
    const response = await apiClient.delete<ApiResponse<null>>(`/user/addresses/${addressId}`);
    return response.data;
  },
};
