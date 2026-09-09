'use client';

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product } from '@/types/product';
import { CartItem, CartSummary } from '@/types/cart';
import { MOCK_PRODUCTS } from '@/data/products';

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  isCartDrawerOpen: boolean;
  summary: CartSummary;
  couponCode: string;
  appliedDiscount: number;
  addToCart: (product: Product, quantity?: number, color?: string, size?: string) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, newQty: number) => void;
  clearCart: () => void;
  openCartDrawer: () => void;
  closeCartDrawer: () => void;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const INITIAL_ITEMS: CartItem[] = [
  {
    id: 'cart-item-1',
    productId: 'prod-01',
    product: MOCK_PRODUCTS[0],
    quantity: 1,
    selectedColor: 'Off-White Chalk',
    selectedSize: 'EU 42 / US 9',
    addedAt: new Date().toISOString(),
  },
  {
    id: 'cart-item-2',
    productId: 'prod-03',
    product: MOCK_PRODUCTS[2],
    quantity: 1,
    selectedColor: 'Space Slate',
    addedAt: new Date().toISOString(),
  },
];

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(INITIAL_ITEMS);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);
  const [couponCode, setCouponCode] = useState('STUDIO1000');
  const [appliedDiscount, setAppliedDiscount] = useState(1000);

  const itemCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const summary = useMemo<CartSummary>(() => {
    const subtotal = items.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
    const freeShippingThreshold = 5000;
    const isFreeShippingUnlocked = subtotal >= freeShippingThreshold;
    const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
    const shipping = isFreeShippingUnlocked || subtotal === 0 ? 0 : 250;
    const discount = subtotal > 0 ? Math.min(appliedDiscount, subtotal) : 0;
    const estimatedTax = 0; // Inclusive of GST
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

  const addToCart = (product: Product, quantity = 1, color?: string, size?: string) => {
    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (i) =>
          i.productId === product.id &&
          i.selectedColor === color &&
          i.selectedSize === size
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += quantity;
        return updated;
      }

      const newItem: CartItem = {
        id: `cart-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: product.id,
        product,
        quantity,
        selectedColor: color || product.colors?.[0]?.name,
        selectedSize: size || product.sizes?.[0]?.size,
        addedAt: new Date().toISOString(),
      };
      return [newItem, ...prev];
    });

    setIsCartDrawerOpen(true);
  };

  const removeFromCart = (itemId: string) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(itemId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, quantity: newQty } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const openCartDrawer = () => setIsCartDrawerOpen(true);
  const closeCartDrawer = () => setIsCartDrawerOpen(false);

  const applyCoupon = (code: string) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'STUDIO1000' || clean === 'MEEO2026') {
      setCouponCode(clean);
      setAppliedDiscount(1000);
      return true;
    }
    if (clean === 'WELCOME500') {
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
