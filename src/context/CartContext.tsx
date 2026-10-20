'use client';

/**
 * @file CartContext.tsx
 * @description Global shopping cart state with live backend synchronization, localStorage persistence, and resilient error recovery.
 */

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { Product } from '@/types/product';
import { CartItem, CartSummary } from '@/types/cart';
import { cartService } from '@/services/cart/cartService';
import { catalogService } from '@/services/catalog/catalogService';
import { useUserStore } from '@/store/user.store';
import { mapBackendCartItem } from '@/lib/apiHelper';
import { useToast } from '@/context/ToastContext';
import { couponService } from '@/services/coupon/couponService';
import { usePublicSettings } from '@/hooks/settings/usePublicSettings';
import { AppRoute } from '@/routes';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  cartId: string;
  isCartDrawerOpen: boolean;
  summary: CartSummary;
  couponCode: string;
  appliedDiscount: number;
  addToCart: (
    product: Product,
    quantity?: number,
    color?: string,
    size?: string,
    explicitVariantId?: string
  ) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, newQty: number) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
  syncCartToBackend: () => Promise<boolean>;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const LOCAL_STORAGE_CART_KEY = 'meeo_cart_items_v2';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { showToast } = useToast();
  const [items, setItems] = useState<CartItem[]>([]);
  const [cartId, setCartId] = useState<string>('');
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);

  const itemsRef = useRef<CartItem[]>(items);
  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  const isSyncingRef = useRef(false);
  const hasHydratedRef = useRef(false);

  // Helper to persist to localStorage
  const persistItems = useCallback((newItems: CartItem[]) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(newItems));
      } catch (err) {
        console.warn('Could not save cart to localStorage:', err);
      }
    }
  }, []);

  // 1. Initial hydration from localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setItems(parsed);
          }
        }
      } catch (err) {
        console.warn('Could not load cart from localStorage:', err);
      } finally {
        setIsInitialized(true);
      }
    }
  }, []);

  // Sync local items to server cart if user is authenticated and backend cart is empty
  const syncCartToBackend = useCallback(async (): Promise<boolean> => {
    const isAuth = useUserStore.getState().isAuthenticated;
    if (!isAuth || isSyncingRef.current) {
      return false;
    }

    let currentItems = itemsRef.current;
    if (currentItems.length === 0 && typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            currentItems = parsed;
          }
        }
      } catch {
        // Ignore parsing errors
      }
    }

    if (currentItems.length === 0) {
      return false;
    }

    try {
      isSyncingRef.current = true;
      const backendRes = await cartService.getCart();
      const rawData = (backendRes as any)?.data || backendRes;
      if (rawData?.id || rawData?.cartId) {
        setCartId(rawData.id || rawData.cartId);
      }

      const existingItems = Array.isArray(rawData?.items)
        ? rawData.items
        : Array.isArray(rawData)
        ? rawData
        : [];
      const existingVariantIds = new Set(
        existingItems.map((bi: any) => bi.variantId || bi.variant?.id)
      );

      for (const item of currentItems) {
        let targetVariantId = item.variantId;

        if (!targetVariantId || !UUID_REGEX.test(targetVariantId)) {
          targetVariantId =
            (item.product as any)?.defaultVariantId ||
            item.product?.variants?.[0]?.id;

          if (!targetVariantId || !UUID_REGEX.test(targetVariantId)) {
            const lookupKey =
              (item.product as any)?.productId ||
              item.productId ||
              item.product?.slug ||
              item.product?.id;
            if (lookupKey) {
              try {
                let prodRes: any = null;
                if (UUID_REGEX.test(lookupKey)) {
                  prodRes = await catalogService.getProductById(lookupKey);
                } else {
                  prodRes = await catalogService.getProductBySlug(lookupKey);
                }
                const sVariants = prodRes?.data?.variants || prodRes?.variants || [];
                if (sVariants.length > 0) {
                  targetVariantId = sVariants[0]?.id;
                }
              } catch {
                // Ignore lookup errors
              }
            }
          }
        }

        if (
          targetVariantId &&
          UUID_REGEX.test(targetVariantId) &&
          !existingVariantIds.has(targetVariantId)
        ) {
          try {
            await cartService.addToCart({
              variantId: targetVariantId,
              quantity: item.quantity || 1,
            });
            existingVariantIds.add(targetVariantId);
          } catch (addErr) {
            console.warn('Sync add to cart failed for variant:', targetVariantId, addErr);
          }
        }
      }

      const updatedRes = await cartService.getCart();
      const updatedRaw = (updatedRes as any)?.data || updatedRes;
      if (updatedRaw?.id || updatedRaw?.cartId) {
        setCartId(updatedRaw.id || updatedRaw.cartId);
      }
      const updatedList = Array.isArray(updatedRaw?.items)
        ? updatedRaw.items
        : Array.isArray(updatedRaw)
        ? updatedRaw
        : [];

      if (updatedList.length > 0) {
        const mapped = updatedList.map(mapBackendCartItem);
        setItems(mapped);
        persistItems(mapped);
        return true;
      }
      return false;
    } catch (syncErr) {
      console.warn('Cart backend sync notice:', syncErr);
      return false;
    } finally {
      isSyncingRef.current = false;
    }
  }, [persistItems]);

  // 2. Hydrate cart items from backend once when authenticated
  const refreshCart = useCallback(async () => {
    const isAuth = useUserStore.getState().isAuthenticated;
    if (!isAuth) {
      return;
    }

    try {
      const res = await cartService.getCart();
      const rawData = (res as any)?.data || res;
      if (rawData?.id || rawData?.cartId) {
        setCartId(rawData.id || rawData.cartId);
      }

      const itemsList = Array.isArray(rawData?.items)
        ? rawData.items
        : Array.isArray(rawData)
        ? rawData
        : [];

      if (itemsList.length > 0) {
        const mapped = itemsList.map(mapBackendCartItem);
        setItems(mapped);
        persistItems(mapped);
      }
    } catch (err) {
      console.warn('Cart backend hydration notice:', err);
    }
  }, [persistItems]);

  const isAuthenticated = useUserStore((s) => s.isAuthenticated);

  // Run initial hydration only once when user is authenticated
  useEffect(() => {
    if (isInitialized && isAuthenticated && !hasHydratedRef.current) {
      hasHydratedRef.current = true;
      refreshCart();
    } else if (!isAuthenticated) {
      hasHydratedRef.current = false;
    }
  }, [isInitialized, isAuthenticated, refreshCart]);

  const { standardShippingFee, freeShippingThreshold } = usePublicSettings();

  const itemCount = useMemo(() => {
    return items.reduce((acc, item) => acc + (item.quantity || 1), 0);
  }, [items]);

  const summary = useMemo<CartSummary>(() => {
    const subtotal = items.reduce(
      (acc, item) => acc + (item.product?.price || 0) * (item.quantity || 1),
      0
    );
    const isFreeShippingUnlocked = subtotal >= freeShippingThreshold;
    const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
    const shipping = isFreeShippingUnlocked || subtotal === 0 ? 0 : standardShippingFee;
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
      freeShippingThreshold,
      standardShippingFee,
    };
  }, [items, appliedDiscount, couponCode, freeShippingThreshold, standardShippingFee]);

  const addToCart = async (
    product: Product,
    quantity = 1,
    color?: string,
    size?: string,
    explicitVariantId?: string
  ) => {
    if (!product) return;

    // Login is compulsory: guests cannot add to cart
    const isAuth = useUserStore.getState().isAuthenticated;
    if (!isAuth) {
      showToast('Please sign in to add items to your cart.', 'info');
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname + window.location.search;
        setTimeout(() => {
          window.location.href = AppRoute.AUTH.LOGIN_WITH_REDIRECT(currentPath);
        }, 350);
      }
      return;
    }

    // 1. Resolve variant ID from explicit parameter or matching attributes
    let targetVariantId =
      explicitVariantId ||
      (product as any)?.selectedVariantId ||
      (product as any)?.variantId;

    if (!targetVariantId && (color || size) && product.variants?.length) {
      const matched =
        product.variants.find((v: any) => {
          const matchCol =
            !color ||
            v.title?.toLowerCase().includes(color.toLowerCase()) ||
            v.sku?.toLowerCase().includes(color.toLowerCase()) ||
            v.attributes?.some((a: any) => a.value?.toLowerCase() === color.toLowerCase()) ||
            v.attributes?.colors?.toLowerCase() === color.toLowerCase();
          const matchSz =
            !size ||
            v.title?.toLowerCase().includes(size.toLowerCase()) ||
            v.sku?.toLowerCase().includes(size.toLowerCase()) ||
            v.attributes?.some((a: any) => a.value?.toLowerCase() === size.toLowerCase()) ||
            v.attributes?.size?.toLowerCase() === size.toLowerCase();
          return matchCol && matchSz;
        }) ||
        product.variants.find((v: any) => {
          return (
            (color &&
              (v.title?.toLowerCase().includes(color.toLowerCase()) ||
                v.attributes?.some((a: any) => a.value?.toLowerCase() === color.toLowerCase()))) ||
            (size &&
              (v.title?.toLowerCase().includes(size.toLowerCase()) ||
                v.attributes?.some((a: any) => a.value?.toLowerCase() === size.toLowerCase())))
          );
        });
      if (matched?.id) {
        targetVariantId = matched.id;
      }
    }

    // Fallback to defaultVariantId or first variant only if not yet found
    if (!targetVariantId) {
      targetVariantId =
        (product as any)?.defaultVariantId ||
        product.variants?.[0]?.id;
    }

    if (!targetVariantId || !UUID_REGEX.test(targetVariantId)) {
      const lookupKey =
        (product as any)?.productId ||
        product.slug ||
        product.id;

      if (lookupKey) {
        try {
          let prodRes: any = null;
          if (UUID_REGEX.test(lookupKey)) {
            prodRes = await catalogService.getProductById(lookupKey);
          } else {
            prodRes = await catalogService.getProductBySlug(lookupKey);
          }
          const serverVariants = prodRes?.data?.variants || prodRes?.variants || [];
          if (serverVariants.length > 0) {
            const matched =
              (explicitVariantId && serverVariants.find((v: any) => v.id === explicitVariantId)) ||
              serverVariants.find(
                (v: any) =>
                  (color &&
                    (v.title?.toLowerCase().includes(color.toLowerCase()) ||
                      v.attributes?.some((a: any) => a.value?.toLowerCase() === color.toLowerCase()))) ||
                  (size &&
                    (v.title?.toLowerCase().includes(size.toLowerCase()) ||
                      v.attributes?.some((a: any) => a.value?.toLowerCase() === size.toLowerCase())))
              ) ||
              serverVariants[0];
            targetVariantId = matched.id;
          }
        } catch (err) {
          console.warn('Could not fetch product variants from server:', err);
        }
      }
    }

    if (!targetVariantId) {
      targetVariantId = product.id;
    }

    const tempId =
      typeof crypto !== 'undefined' && crypto.randomUUID
        ? crypto.randomUUID()
        : `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // 2. Optimistic UI update & immediate persistence
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) =>
          (i.variantId === targetVariantId || (i.productId === product.id && i.variantId === targetVariantId)) &&
          i.selectedColor === color &&
          i.selectedSize === size
      );

      let updated: CartItem[];
      if (existingIndex > -1) {
        updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
      } else {
        const newItem: CartItem = {
          id: tempId,
          productId: (product as any)?.productId || product.id,
          variantId: targetVariantId,
          product: {
            ...product,
            selectedVariantId: targetVariantId,
          },
          quantity,
          selectedColor: color || product.colors?.[0]?.name,
          selectedSize: size || product.sizes?.[0]?.size,
          addedAt: new Date().toISOString(),
        };
        updated = [newItem, ...prev];
      }

      persistItems(updated);
      return updated;
    });

    setIsCartDrawerOpen(true);

    // 3. Dispatch POST /api/v1/cart/items and sync database cart
    if (isAuth && targetVariantId && UUID_REGEX.test(targetVariantId)) {
      try {
        const addRes = await cartService.addToCart({
          variantId: targetVariantId,
          quantity,
        });
        const cartData = (addRes as any)?.data || addRes;
        if (cartData?.id || cartData?.cartId) {
          setCartId(cartData.id || cartData.cartId);
        }
        if (Array.isArray(cartData?.items) && cartData.items.length > 0) {
          const mapped = cartData.items.map(mapBackendCartItem);
          setItems(mapped);
          persistItems(mapped);
        } else {
          await refreshCart();
        }
      } catch (err) {
        console.warn('Backend cart sync warning:', err);
      }
    }
  };

  const removeFromCart = async (itemId: string) => {
    setItems((prev) => {
      const updated = prev.filter((item) => item.id !== itemId);
      persistItems(updated);
      return updated;
    });

    const isAuth = useUserStore.getState().isAuthenticated;
    if (isAuth && UUID_REGEX.test(itemId) && itemId !== '00000000-0000-4000-8000-000000000000') {
      try {
        await cartService.removeFromCart(itemId);
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

    setItems((prev) => {
      const updated = prev.map((item) =>
        item.id === itemId ? { ...item, quantity: newQty } : item
      );
      persistItems(updated);
      return updated;
    });

    const isAuth = useUserStore.getState().isAuthenticated;
    if (isAuth && UUID_REGEX.test(itemId) && itemId !== '00000000-0000-4000-8000-000000000000') {
      try {
        await cartService.updateCartItem(itemId, { quantity: newQty });
      } catch (err) {
        console.warn('Backend quantity update warning:', err);
      }
    }
  };

  const clearCart = async () => {
    setItems([]);
    persistItems([]);

    const isAuth = useUserStore.getState().isAuthenticated;
    if (isAuth) {
      try {
        await cartService.clearCart();
      } catch (err) {
        console.warn('Backend clear cart warning:', err);
      }
    }
  };

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  const applyCoupon = async (code: string): Promise<boolean> => {
    const clean = code.trim().toUpperCase();
    if (!clean) return false;
    try {
      const res = await couponService.validateCoupon({
        code: clean,
        cartSubtotal: summary.subtotal,
      });
      const data = res?.data;
      if (res?.success && data && data.isValid !== false) {
        setCouponCode(clean);
        setAppliedDiscount(Number(data.discountAmount ?? data.discountValue ?? 0));
        return true;
      }
      return false;
    } catch {
      return false;
    }
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
        cartId,
        isCartDrawerOpen,
        summary,
        couponCode,
        appliedDiscount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refreshCart,
        syncCartToBackend,
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
