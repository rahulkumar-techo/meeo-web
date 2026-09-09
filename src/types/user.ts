import { ShippingAddress } from './order';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarUrl?: string;
  memberTier: 'Standard' | 'Studio Member' | 'Archival Club' | 'Founding Collector';
  memberPoints: number;
  joinedDate: string;
  addresses: ShippingAddress[];
  savedPaymentMethods: {
    id: string;
    cardLast4?: string;
    cardBrand?: string;
    upiId?: string;
    isDefault: boolean;
  }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  type: 'drop_alert' | 'order_update' | 'price_drop' | 'exclusive_invite';
  link?: string;
}
