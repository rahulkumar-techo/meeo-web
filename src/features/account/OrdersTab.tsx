'use client';

/**
 * @file OrdersTab.tsx
 * @description Account Orders tab rendering live paginated customer orders, search, status filter, and order inspection.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Package,
  Clock,
  CheckCircle2,
  Truck,
  Ban,
  ArrowRight,
  Filter,
  Eye,
  RefreshCw,
  ShoppingBag,
} from 'lucide-react';
import { useOrdersQuery } from '@/hooks/order/useOrder';
import { OrderDetailModal } from '@/features/orders/OrderDetailModal';
import { useUserStore } from '@/store/user.store';
import { AppRoute } from '@/routes';
import type { OrderStatus } from '@/types/order/order.types';

const STATUS_FILTERS: Array<{ label: string; value?: OrderStatus }> = [
  { label: 'All Orders' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Confirmed', value: 'CONFIRMED' },
  { label: 'Processing', value: 'PROCESSING' },
  { label: 'Shipped', value: 'SHIPPED' },
  { label: 'Delivered', value: 'DELIVERED' },
  { label: 'Cancelled', value: 'CANCELLED' },
];

export const OrdersTab: React.FC = () => {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated);

  const [page, setPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSearch, setActiveSearch] = useState('');

  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const { data, isLoading, isError, refetch, isFetching } = useOrdersQuery({
    page,
    limit: 10,
    status: selectedStatus,
    search: activeSearch || undefined,
  });

  const orders = data?.data?.items || [];
  const pagination = data?.data?.pagination;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    setActiveSearch(searchTerm.trim());
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'DELIVERED':
        return {
          icon: CheckCircle2,
          text: 'Delivered',
          classes: 'bg-emerald-50 text-emerald-800 border-emerald-200',
        };
      case 'SHIPPED':
        return {
          icon: Truck,
          text: 'Shipped',
          classes: 'bg-blue-50 text-blue-800 border-blue-200',
        };
      case 'CONFIRMED':
        return {
          icon: Package,
          text: 'Confirmed',
          classes: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      case 'PROCESSING':
        return {
          icon: Package,
          text: 'Processing',
          classes: 'bg-amber-50 text-amber-800 border-amber-200',
        };
      case 'CANCELLED':
        return {
          icon: Ban,
          text: 'Cancelled',
          classes: 'bg-red-50 text-red-800 border-red-200',
        };
      default:
        return {
          icon: Clock,
          text: status || 'Pending',
          classes: 'bg-zinc-50 text-zinc-800 border-zinc-200',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8E2DA] pb-4">
        <div>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#2D2621]">
            Your Orders
          </h2>
          <p className="text-xs text-[#786C64] mt-0.5">
            Review your live orders, track parcels, and manage cancellations.
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E8E2DA] hover:bg-[#FAF8F5] text-xs font-semibold text-[#2D2621] transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-[#8C5338] ${isFetching ? 'animate-spin' : ''}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex-1 max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#786C64]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by order number (e.g. ORD-)..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#FAF8F5] border border-[#E8E2DA] text-[#2D2621] placeholder:text-[#786C64]/70 focus:outline-hidden focus:ring-1 focus:ring-[#8C5338]"
          />
        </form>

        {/* Status Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          {STATUS_FILTERS.map((filter) => {
            const isSelected = selectedStatus === filter.value;
            return (
              <button
                key={filter.label}
                type="button"
                onClick={() => {
                  setSelectedStatus(filter.value);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                  isSelected
                    ? 'bg-[#8C5338] text-white border-[#8C5338]'
                    : 'bg-white text-[#786C64] border-[#E8E2DA] hover:bg-[#FAF8F5] hover:text-[#2D2621]'
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Unauthenticated State */}
      {!isAuthenticated && (
        <div className="text-center py-12 px-4 rounded-2xl border border-dashed border-[#E8E2DA] bg-[#FAF8F5]">
          <Package className="w-10 h-10 text-[#8C5338] mx-auto mb-3" />
          <h3 className="text-sm font-bold text-[#2D2621] mb-1">
            Sign in to view your orders
          </h3>
          <p className="text-xs text-[#786C64] mb-4">
            Log in with your customer account to retrieve order history and receipts.
          </p>
          <Link
            href={AppRoute.AUTH.LOGIN_WITH_REDIRECT(AppRoute.ACCOUNT)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#8C5338] hover:bg-[#6E3F29] text-white text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Sign In
          </Link>
        </div>
      )}

      {/* Loading State */}
      {isAuthenticated && isLoading && (
        <div className="py-16 text-center space-y-3">
          <div className="w-8 h-8 border-2 border-[#8C5338] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-[#786C64]">Retrieving your orders...</p>
        </div>
      )}

      {/* Error State */}
      {isAuthenticated && isError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
          Unable to retrieve orders at this time. Please try refreshing.
        </div>
      )}

      {/* Empty State */}
      {isAuthenticated && !isLoading && !isError && orders.length === 0 && (
        <div className="text-center py-14 px-4 rounded-2xl border border-dashed border-[#E8E2DA] bg-[#FAF8F5]/60 space-y-3">
          <div className="w-12 h-12 rounded-full bg-[#E8E2DA]/60 flex items-center justify-center mx-auto text-[#786C64]">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-[#2D2621]">No orders found</h3>
            <p className="text-xs text-[#786C64] mt-0.5">
              {activeSearch || selectedStatus
                ? 'Try adjusting your status filter or search keyword.'
                : 'You have not placed any orders yet.'}
            </p>
          </div>
          <Link
            href={AppRoute.CATEGORY}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#8C5338] hover:bg-[#6E3F29] text-white text-xs font-bold transition-colors cursor-pointer"
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Orders List */}
      {isAuthenticated && !isLoading && orders.length > 0 && (
        <div className="space-y-4">
          {orders.map((order) => {
            const badge = getStatusBadge(order.status);
            const StatusIcon = badge.icon;
            const currencySymbol = order.currency === 'USD' ? '$' : '₹';
            const total = order.grandTotal ?? order.totalAmount ?? 0;

            return (
              <div
                key={order.id}
                className="border border-[#E8E2DA] rounded-2xl p-5 hover:border-[#8C5338]/30 transition-all bg-[#FAF8F5]/40 space-y-4"
              >
                {/* Header Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#E8E2DA] pb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-[#2D2621]">
                      Order #{order.orderNumber}
                    </span>
                    <span className="text-xs text-[#786C64]">
                      • {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                    </span>
                  </div>

                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold border ${badge.classes}`}
                  >
                    <StatusIcon className="w-3 h-3" />
                    <span>{badge.text}</span>
                  </span>
                </div>

                {/* Items Preview / Meta Row */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="space-y-1">
                    <span className="text-[#786C64]">
                      {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'} in this order
                    </span>
                    {order.paymentStatus && (
                      <div className="text-[11px] text-[#786C64]">
                        Payment Status: <span className="font-semibold text-[#2D2621]">{order.paymentStatus}</span>
                      </div>
                    )}
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-bold text-[#2D2621]">
                      {currencySymbol}
                      {total.toLocaleString()}
                    </div>
                    <span className="text-[10px] text-[#786C64]">Total Amount</span>
                  </div>
                </div>

                {/* Footer Action Row */}
                <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#E8E2DA]/80">
                  <Link
                    href={AppRoute.ORDER_TRACK(order.orderNumber)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#E8E2DA] hover:bg-white text-xs font-semibold text-[#2D2621] transition-colors cursor-pointer"
                  >
                    <Truck className="w-3.5 h-3.5 text-[#8C5338]" />
                    <span>Track</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setSelectedOrderId(order.id)}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#8C5338] hover:bg-[#6E3F29] text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View Details</span>
                  </button>
                </div>
              </div>
            );
          })}

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-[#E8E2DA] text-xs">
              <span className="text-[#786C64]">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total orders)
              </span>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={pagination.page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 rounded-lg border border-[#E8E2DA] hover:bg-[#FAF8F5] disabled:opacity-50 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Previous
                </button>
                <button
                  type="button"
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 rounded-lg border border-[#E8E2DA] hover:bg-[#FAF8F5] disabled:opacity-50 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedOrderId && (
        <OrderDetailModal
          orderId={selectedOrderId}
          isOpen={Boolean(selectedOrderId)}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
};
