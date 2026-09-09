'use client';

import React from 'react';
import Link from 'next/link';
import { Bell, Flame, Truck, Tag, Sparkles, Check, ArrowRight } from 'lucide-react';
import { NotificationItem } from '@/types/user';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';

interface NotificationsListProps {
  notifications: NotificationItem[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
}

export const NotificationsList: React.FC<NotificationsListProps> = ({
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
}) => {
  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'drop_alert':
        return <Flame className="w-5 h-5 text-[#fd6a49]" />;
      case 'order_update':
        return <Truck className="w-5 h-5 text-[#412ce7]" />;
      case 'price_drop':
        return <Tag className="w-5 h-5 text-[#ae3115]" />;
      default:
        return <Sparkles className="w-5 h-5 text-[#412ce7]" />;
    }
  };

  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={<Bell className="w-8 h-8 stroke-[1.5]" />}
        title="No New Alerts in Notification Vault"
        description="You are fully up-to-date with your shipment milestones and limited drop invitations."
        actionLabel="Browse Catalog"
        actionHref="/category"
      />
    );
  }

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#e2e7ff] shadow-sm flex flex-col gap-6">
      <div className="flex items-center justify-between pb-4 border-b border-[#e2e7ff]">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-[#412ce7]" />
          <h3 className="text-base font-bold text-[#131b2e]">Telemetry &amp; Drop Broadcasts</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onMarkAllAsRead}>
          Mark all as read
        </Button>
      </div>

      <div className="flex flex-col gap-3">
        {notifications.map((notif) => (
          <div
            key={notif.id}
            onClick={() => onMarkAsRead(notif.id)}
            className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-4 cursor-pointer ${
              notif.read
                ? 'border-[#e2e7ff] bg-white opacity-70'
                : 'border-[#412ce7]/40 bg-[#eaedff]/30 shadow-xs'
            }`}
          >
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#f2f3ff] flex items-center justify-center shrink-0">
                {getIcon(notif.type)}
              </div>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-[#131b2e]">{notif.title}</h4>
                <p className="text-xs text-[#464556] mt-0.5 leading-relaxed">{notif.message}</p>
                <span className="text-[11px] text-[#777588] font-medium block mt-1.5">
                  {notif.timestamp}
                </span>
              </div>
            </div>

            {notif.link && (
              <Link
                href={notif.link}
                className="shrink-0 text-xs font-bold text-[#412ce7] hover:underline flex items-center gap-1 mt-1"
              >
                <span>Inspect</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
