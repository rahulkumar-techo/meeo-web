import { NotificationItem } from '@/types/user';

export const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif-1',
    title: 'Drop Alert: Aethel-01 Italian Nappa Sneaker',
    message: 'Archival Drop № 24 is now unlocked for Studio tier members. Only 14 pairs remaining.',
    timestamp: '10 mins ago',
    read: false,
    type: 'drop_alert',
    link: '/product/prod-01',
  },
  {
    id: 'notif-2',
    title: 'Out for Delivery: Order MEEO-89234',
    message: 'BlueDart courier is 2.4 km from your Indiranagar delivery address.',
    timestamp: '45 mins ago',
    read: false,
    type: 'order_update',
    link: '/orders/ord-9021',
  },
  {
    id: 'notif-3',
    title: 'Price Drop: MagDock Pro Wireless',
    message: 'An item on your wishlist is currently ₹1,200 off during Autumn Curation.',
    timestamp: '2 hours ago',
    read: true,
    type: 'price_drop',
    link: '/product/prod-03',
  },
  {
    id: 'notif-4',
    title: 'Studio Member Reward Unlocked',
    message: 'You have earned 1,200 Studio Points. Use code STUDIO1000 for ₹1,000 instant credit.',
    timestamp: 'Yesterday',
    read: true,
    type: 'exclusive_invite',
    link: '/account',
  },
];
