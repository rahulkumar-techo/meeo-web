/**
 * @file app-route.ts
 * @description Centralized registry of application client-side routes and URL builders.
 * Use these constants instead of hardcoded strings for Next.js navigation, router.push, and Link hrefs.
 */

export const AppRoute = {
  // Public Storefront Pages
  HOME: '/',
  ABOUT: '/about',

  // Catalog & Product Browsing
  CATEGORY: '/category',
  CATEGORY_WITH_QUERY: (query: string) =>
    `/category?q=${encodeURIComponent(query.trim())}`,
  CATEGORY_FILTER: (params?: { category?: string; brand?: string; q?: string }) => {
    if (!params) return '/category';
    const searchParams = new URLSearchParams();
    if (params.category) searchParams.set('category', params.category);
    if (params.brand) searchParams.set('brand', params.brand);
    if (params.q) searchParams.set('q', params.q);
    const queryString = searchParams.toString();
    return queryString ? `/category?${queryString}` : '/category';
  },

  // Product Details
  PRODUCTS: '/product',
  PRODUCT: (idOrSlug: string) => `/product/${encodeURIComponent(idOrSlug)}`,

  // Search
  SEARCH: (query?: string) =>
    query ? `/search?q=${encodeURIComponent(query.trim())}` : '/search',

  // Cart & Checkout Flow
  CART: '/cart',
  CHECKOUT: '/checkout',

  // Customer Account & Wishlist
  ACCOUNT: '/account',
  WISHLIST: '/wishlist',
  ORDERS: '/orders',
  ORDER_DETAIL: (orderId: string) => `/orders/${encodeURIComponent(orderId)}`,
  TRACK: '/track',
  ORDER_TRACK: (orderNumber?: string) =>
    orderNumber ? `/track?orderNumber=${encodeURIComponent(orderNumber)}` : '/track',

  // Authentication Pages
  AUTH: {
    LOGIN: '/login',
    LOGIN_WITH_REDIRECT: (redirectPath: string) =>
      `/login?redirect=${encodeURIComponent(redirectPath)}`,
    REGISTER: '/register',
    REGISTER_WITH_REDIRECT: (redirectPath: string) =>
      `/register?redirect=${encodeURIComponent(redirectPath)}`,
    VERIFY_OTP: (
      paramOrOptions?: string | { email?: string; dest?: string; mode?: string; redirect?: string },
      redirectPath?: string
    ) => {
      if (!paramOrOptions) return '/verify-otp';
      const params = new URLSearchParams();
      if (typeof paramOrOptions === 'string') {
        params.set('email', paramOrOptions);
        if (redirectPath) params.set('redirect', redirectPath);
      } else {
        if (paramOrOptions.email) params.set('email', paramOrOptions.email);
        if (paramOrOptions.dest) params.set('dest', paramOrOptions.dest);
        if (paramOrOptions.mode) params.set('mode', paramOrOptions.mode);
        if (paramOrOptions.redirect) params.set('redirect', paramOrOptions.redirect);
      }
      const query = params.toString();
      return query ? `/verify-otp?${query}` : '/verify-otp';
    },
    FORGOT_PASSWORD: '/forgot-password',
    RESET_PASSWORD: (email?: string) =>
      email ? `/reset-password?email=${encodeURIComponent(email)}` : '/reset-password',
  },
} as const;

// Backward-compatible alias
export const AppRoutes = AppRoute;
export type AppRouteType = typeof AppRoute;
