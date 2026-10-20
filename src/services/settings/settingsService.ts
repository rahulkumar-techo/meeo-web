/**
 * @file settingsService.ts
 * @description Fetches public storefront settings including shipping rules, threshold, and feature flags.
 */

import { apiClient } from '@/config/client';
import { ApiRoute } from '@/routes';
import type { ApiResponse } from '@/types/common/api.types';

export interface PublicSettings {
  standardShippingFee?: number;
  freeShippingThreshold?: number;
  platformBrandName?: string;
  publicDomainUrl?: string;
  supportEmail?: string;
  defaultCurrency?: string;
  timezone?: string;
  maintenanceMode?: boolean;
  readOnlyMode?: boolean;
  disableCheckout?: boolean;
  disablePayments?: boolean;
  featureFlags?: Record<string, boolean>;
  [key: string]: any;
}

export const settingsService = {
  /**
   * Fetch public tenant settings (shipping threshold, standard fee, platform configuration).
   */
  async getPublicSettings(): Promise<PublicSettings> {
    const response = await apiClient.get<ApiResponse<PublicSettings>>(ApiRoute.SETTINGS.PUBLIC);
    const data = (response.data as any)?.data || response.data;
    return data;
  },
};
