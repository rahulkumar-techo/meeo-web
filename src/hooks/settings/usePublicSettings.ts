'use client';

/**
 * @file usePublicSettings.ts
 * @description Hook to fetch public storefront settings with graceful fallbacks.
 */

import { useQuery } from '@tanstack/react-query';
import { settingsService, PublicSettings } from '@/services/settings/settingsService';
import { queryKeys } from '@/hooks/queryKeys';

export const DEFAULT_PUBLIC_SETTINGS: PublicSettings = {
  standardShippingFee: 40,
  freeShippingThreshold: 500,
  defaultCurrency: 'INR',
};

export function usePublicSettings() {
  const query = useQuery<PublicSettings>({
    queryKey: queryKeys.settings.public(),
    queryFn: () => settingsService.getPublicSettings(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });

  const publicSettings = query.data || DEFAULT_PUBLIC_SETTINGS;

  const standardShippingFee =
    typeof publicSettings.standardShippingFee === 'number'
      ? publicSettings.standardShippingFee
      : DEFAULT_PUBLIC_SETTINGS.standardShippingFee!;

  const freeShippingThreshold =
    typeof publicSettings.freeShippingThreshold === 'number'
      ? publicSettings.freeShippingThreshold
      : DEFAULT_PUBLIC_SETTINGS.freeShippingThreshold!;

  return {
    ...query,
    publicSettings,
    standardShippingFee,
    freeShippingThreshold,
  };
}
