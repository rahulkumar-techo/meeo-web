'use client';

/**
 * @file CartContext.tsx
 * @description Global shopping cart state with live backend synchronization, optimistic updates, and coupon management.
 */

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { Product } from '@/types/product';
import { CartItem, CartSummary } from '@/types/cart';
import { cartService } from '@/services/cart/cartService';
import { catalogService } from '@/services/catalog/catalogService';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  isCartDrawerOpen: boolean;
  summary: CartSummary;
  couponCode: string;
  appliedDiscount: number;
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, newQty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);

  // Sync and hydrate cart items from backend
  const refreshCart = useCallback(async () => {
    try {
      const res = await cartService.getCart();
      const rawData = (res as any)?.data || res;
      const itemsList = Array.isArray(rawData?.items)
        ? rawData.items
        : Array.isArray(rawData)
        ? rawData
        : [];
      if (itemsList.length > 0 || (rawData && 'items' in rawData)) {
        const backendItems: CartItem[] = itemsList.map((item: any) => ({
          id: item.id,
          productId: item.productId || item.variantId,
          variantId: item.variantId,
          product: {
            id: item.productId || item.variantId,
            slug: item.productId || item.variantId,
            name: item.productTitle || item.title || 'Curated Product',
            subtitle: item.variantTitle || '',
            category: 'objects',
            categoryLabel: 'Catalog',
            price: Number(item.unitPrice || item.price || 0),
            originalPrice: item.originalPrice ? Number(item.originalPrice) : undefined,
            rating: 4.8,
            reviewCount: 0,
            inStock: item.isAvailable !== false,
            stockCount: item.availableStock || 10,
            description: '',
            images: [
              item.thumbnailUrl ||
                'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop',
            ],
            specs: {},
            tags: [],
          },
          quantity: item.quantity,
          selectedColor: item.attributes?.find((a: any) => a.name?.toLowerCase() === 'color')?.value,
          selectedSize: item.attributes?.find((a: any) => a.name?.toLowerCase() === 'size')?.value,
          addedAt: new Date().toISOString(),
        }));
        setItems(backendItems);
      }
    } catch (err) {
      console.warn('Cart hydration notice:', err);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const itemCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const summary = useMemo<CartSummary>(() => {
    const subtotal = items.reduce(
      (acc, item) => acc + (item.product?.price || 0) * item.quantity,
      0
    );
    const freeShippingThreshold = 5000;
    const isFreeShippingUnlocked = subtotal >= freeShippingThreshold;
    const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
    const shipping = isFreeShippingUnlocked || subtotal === 0 ? 0 : 250;
    const discount = subtotal > 0 ? Math.min(appliedDiscount, subtotal) : 0;
    const estimatedTax = 0;
    const total = Math.max(0, subtotal - discount + shipping + estimatedTax);

    return {
      subtotal,
      discount,
      shipping,
      estimatedTax,
      total,
      couponCode,
      isFreeShippingUnlocked,
      amountNeededForFreeShipping,
    };
  }, [items, appliedDiscount, couponCode]);

  const addToCart = async (product: Product, quantity = 1, color?: string, size?: string) => {
    // 1. Resolve variant ID from product object or fetch details from server
    let targetVariantId =
      product.variants?.find(
        (v: any) =>
          (color && (v.title?.includes(color) || v.attributes?.some((a: any) => a.value === color))) ||
          (size && (v.title?.includes(size) || v.attributes?.some((a: any) => a.value === size)))
      )?.id || product.variants?.[0]?.id;

    if (!targetVariantId && (product.id || product.slug)) {
      try {
        let prodRes: any = null;
        if (product.id && UUID_REGEX.test(product.id)) {
          prodRes = await catalogService.getProductById(product.id);
        } else if (product.slug) {
          prodRes = await catalogService.getProductBySlug(product.slug);
        }
        const serverVariants = prodRes?.data?.variants || prodRes?.variants || [];
        if (serverVariants.length > 0) {
          const matched =
            serverVariants.find(
              (v: any) =>
                (color &&
                  (v.title?.includes(color) || v.attributes?.some((a: any) => a.value === color))) ||
                (size &&
                  (v.title?.includes(size) || v.attributes?.some((a: any) => a.value === size)))
            ) || serverVariants[0];
          targetVariantId = matched.id;
        }
      } catch (err) {
        console.warn('Could not fetch product variants from server:', err);
      }
    }

    if (!targetVariantId) {
      targetVariantId = product.id;
    }

    const tempId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : '00000000-0000-4000-8000-000000000000';

    // 2. Optimistic UI update
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) =>
          (i.variantId === targetVariantId || i.productId === product.id) &&
          i.selectedColor === color &&
          i.selectedSize === size
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      const newItem: CartItem = {
        id: tempId,
        productId: product.id,
        variantId: targetVariantId,
        product,
        quantity,
        selectedColor: color || product.colors?.[0]?.name,
        selectedSize: size || product.sizes?.[0]?.size,
        addedAt: new Date().toISOString(),
      };
      return [newItem, ...prev];
    });

    setIsCartDrawerOpen(true);

    // 3. Dispatch POST /api/v1/cart/items and sync database cart
    try {
      if (targetVariantId && UUID_REGEX.test(targetVariantId)) {
        await cartService.addToCart({
          variantId: targetVariantId,
          quantity,
        });
        await refreshCart();
      }
    } catch (err) {
      console.warn('Backend cart sync warning:', err);
    }
  };

  const removeFromCart = async (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
    if (UUID_REGEX.test(itemId) && itemId !== '00000000-0000-4000-8000-000000000000') {
      try {
        await cartService.removeFromCart(itemId);
        await refreshCart();
      } catch (err) {
        console.warn('Backend item remove warning:', err);
      }
    }
  };

  const updateQuantity = async (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      await removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
    );
    if (UUID_REGEX.test(itemId) && itemId !== '00000000-0000-4000-8000-000000000000') {
      try {
        await cartService.updateCartItem(itemId, { quantity: newQty });
        await refreshCart();
      } catch (err) {
        console.warn('Backend quantity update warning:', err);
      }
    }
  };

  const clearCart = async () => {
    setItems([]);
    try {
      await cartService.clearCart();
    } catch (err) {
      console.warn('Backend clear cart warning:', err);
    }
  };

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'STUDIO1000' || clean === 'MEEO2026' || clean === 'SUMMER25') {
      setCouponCode(clean);
      setAppliedDiscount(1000);
      return true;
    }
    if (clean === 'WELCOME500' || clean === 'WELCOME10') {
      setCouponCode(clean);
      setAppliedDiscount(500);
      return true;
    }
    return false;
  };

  const removeCoupon = () => {
    setCouponCode('');
    setAppliedDiscount(0);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        isCartDrawerOpen,
        summary,
        couponCode,
        appliedDiscount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
        openCartDrawer,
        closeCartDrawer,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
