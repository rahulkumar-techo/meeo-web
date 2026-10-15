/**
 * @file api-route.ts
 * @description Centralized registry of backend REST API endpoints.
 * All HTTP client calls reference these constants instead of raw strings.
 */

export const ApiRoute = {
  // Authentication & Session Management
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/register',
    REGISTER: '/auth/register',
    OTP_VERIFICATION: '/auth/verify-otp',
    RESEND_OTP: '/auth/resend-otp',
    FORGOT_PASSWORD: '/auth/forgot-password',
    VERIFY_RESET_OTP: '/auth/verify-reset-otp',
    RESET_PASSWORD: '/auth/reset-password',
    GOOGLE_AUTH: '/auth/google',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    LOGOUT: '/auth/logout',
    LOGOUT_ALL: '/auth/logout-all',
    SESSIONS: '/auth/sessions',
    SESSION_ID: (sessionId: string) => `/auth/sessions/${sessionId}`,
    REVOKE_ALL_SESSIONS: '/auth/sessions/revoke-all',
    ACCOUNTS: '/auth/accounts',
    CHANGE_PASSWORD: '/auth/password/change',
    SET_PASSWORD: '/auth/password/set',
    LINK_GOOGLE: '/auth/accounts/google/link',
    UNLINK_ACCOUNT: (provider: string) => `/auth/accounts/${provider}`,
  },

  // Customer Profile & Phone Verification
  USER: {
    PROFILE: '/user/profile',
    ADDRESSES: '/user/addresses',
    UPDATE_ADDRESS: (addressId: string) => `/user/addresses/${addressId}`,
    DELETE_ADDRESS: (addressId: string) => `/user/addresses/${addressId}`,
    PHONE_REQUEST_OTP: '/user/phone/request-otp',
    VERIFY_PHONE_NO: '/user/phone/request-otp',
    UPDATE_PHONE_NO: '/user/phone',
  },

  // Catalog, Products & Matrix Attributes
  PRODUCT: {
    PRODUCTS: '/products',
    PRODUCT_DETAILS: (productId: string) => `/products/${productId}`,
    PRODUCT_BY_SLUG: (slug: string) => `/products/slug/${slug}`,
    PRODUCT_SLUGS: (slug: string) => `/products/slug/${slug}`,
    PRODUCT_ATTRIBUTES: (productId: string) => `/products/${productId}/attributes`,
    // Backward compatibility aliases
    PRODUCTDETAILS: (productId: string) => `/products/${productId}`,
    PRODUCST_ATTRIBUTES: (productId: string) => `/products/${productId}/attributes`,
  },

  // Categories Hierarchy
  CATEGORIES: {
    CATEGORIES: '/categories',
    CATEGORIES_TREE: '/categories/tree',
    CATEGORIES_BY_ID: (categoryId: string) => `/categories/${categoryId}`,
    CATEGORIES_SLUG: (slug: string) => `/categories/slug/${slug}`,
    // Backward compatibility alias
    CATEGORIES_BYID: (categoryId: string) => `/categories/${categoryId}`,
  },

  // Brands
  BRAND: {
    BRANDS: '/brands',
    SINGLE_BRAND: (brandId: string) => `/brands/${brandId}`,
    BRAND_SLUG: (slug: string) => `/brands/slug/${slug}`,
  },

  // SKU Variants
  PRODUCT_VARIANT: {
    SINGLE_PRODUCT_VARIANT: (variantId: string) => `/variants/${variantId}`,
    VARIANT_SKU: (sku: string) => `/variants/sku/${sku}`,
  },

  // Shopping Cart & Merge
  CART: {
    CART: '/cart',
    CART_ITEMS: '/cart/items',
    UPDATE_CART_ITEMS: (itemId: string) => `/cart/items/${itemId}`,
    DELETE_CART_ITEMS: (itemId: string) => `/cart/items/${itemId}`,
    DELETE_ALL_ITEMS: '/cart',
    MERGE_CART: '/cart/merge',
  },

  // Customer Wishlist
  WISHLISTS: {
    BASE: '/wishlists',
    WISHLISTS: '/wishlists',
    CREATE_WISHLISTS: '/wishlists',
    PRODUCT_WISHLISTS: (productId: string) => `/wishlists/products/${productId}`,
    DELETE_PRODUCT_WISHLISTS: (productId: string) => `/wishlists/products/${productId}`,
    TRANSFER_TO_CART: (productId: string) => `/wishlists/products/${productId}/move-to-cart`,
    // Singular variants used by some endpoints
    SINGULAR_BASE: '/wishlist',
    SINGULAR_PRODUCT: (productId: string) => `/wishlist/products/${productId}`,
    SINGULAR_TRANSFER_TO_CART: (productId: string) => `/wishlist/products/${productId}/move-to-cart`,
    // Backward compatibility typo aliases
    PRODUCT_WISHlISTS: (productId: string) => `/wishlists/products/${productId}`,
    DELETE_PRODUCT_WISHlISTS: (productId: string) => `/wishlists/products/${productId}`,
  },

  // Orders & Checkout
  ORDERS: {
    ORDERS: '/orders',
    ORDER_DETAILS: (orderId: string) => `/orders/${orderId}`,
    VALIDATE_CHECKOUT_ORDER: '/orders/validate-checkout',
    ORDER_CHECKOUT: '/orders/checkout',
    ORDER_NUMBER: (orderNumber: string) => `/orders/number/${orderNumber}`,
    ORDER_CANCEL: (orderId: string) => `/orders/${orderId}/cancel`,
    // Backward compatibility typo alias
    ORDER_CANCLE: (orderId: string) => `/orders/${orderId}/cancel`,
  },

  // Payments
  PAYMENTS: {
    INITIALIZE: '/payments/initialize',
    PAYMENT_INITIALIZE: '/payments/initialize',
    VERIFY: '/payments/verify',
    FAIL: '/payments/fail',
    RETRY: '/payments/retry',
    PAYMENT_RETRY: '/payments/retry',
    GET_PAYMENT: (paymentId: string) => `/payments/${paymentId}`,
    PAYMENT_DETAILS: (paymentId: string) => `/payments/${paymentId}`,
    PAYMENT_WEBHOOK: (provider: string) => `/payments/webhook/${provider}`,
  },

  // Coupons
  COUPONS: {
    COUPON_VALIDATE: '/coupons/validate',
    COUPON_HISTORY: '/coupons/my-history',
  },

  // Promotions
  PROMOTIONS: {
    PROMOTIONS_PREVIEW: '/promotions/preview',
    PROMOTIONS_VALIDATECODE: '/promotions/validate-code',
    PROMOTION_VALIDATION: '/promotions/active',
    PROMOTION_HISTORY: '/promotions/my-history',
    // Backward compatibility typo alias
    PRMOTION_HISTORY: '/promotions/my-history',
  },

  // Reviews & Ratings
  REVIEWS: {
    PRODUCT_REVIEWS: (productId: string) => `/reviews/products/${productId}`,
    PRODUCT_REVIEWS_SUMMARY: (productId: string) => `/reviews/products/${productId}/summary`,
    GET_MY_REVIEWS: '/reviews/my-reviews',
    REVIEWS: '/reviews',
    UPDATE_REVIEWS: (reviewId: string) => `/reviews/${reviewId}`,
    DELETE_REVIEWS: (reviewId: string) => `/reviews/${reviewId}`,
    REPORT: (reviewId: string) => `/reviews/${reviewId}/report`,
  },

  // Search & Suggestions
  SEARCHES: {
    SEARCH: '/search',
    SEARCH_SUGGESTIONS: '/search/suggestions',
    SEARCH_FACETS: '/search/facets',
    // Backward compatibility typo alias
    SEARCH_SUGGESSTIONS: '/search/suggestions',
  },

  // Product Discovery Feeds
  DISCOVERY: {
    DISCOVERY_FEATURED: '/discovery/featured',
    DISCOVERY_RELATED_PRODUCT: (productId: string) => `/discovery/related/${productId}`,
    DISCOVERY_TRENDING: '/discovery/trending',
    DISCOVERY_NEW_ARRIVALS: '/discovery/new-arrivals',
  },

  // In-App Notifications
  NOTIFICATIONS: {
    NOTIFICATIONS: '/notifications',
    UNREAD_NOTIFICATIONS_COUNT: '/notifications/unread-count',
    READ_NOTIFICATION: (notificationId: string) => `/notifications/${notificationId}/read`,
    MARK_ALL_NOTIFICATION: '/notifications/mark-all-read',
    DELETE_NOTIFICATION: (notificationId: string) => `/notifications/${notificationId}`,
    NOTIFICATION_PREFERENCES: '/notifications/preferences',
    UPDATE_NOTIFICATION_PREFERENCES: '/notifications/preferences',
    REGISTER_DEVICE: '/notifications/devices',
    DEVICES: '/notifications/devices',
    // Backward compatibility typo aliases
    NOTIFICATION_PREFRENCES: '/notifications/preferences',
    UPDATE_NOTIFICATION_PREFRENCES: '/notifications/preferences',
  },

  // Address Book Alias
  ADDRESS: {
    ADDRESSES: '/user/addresses',
    UPDATE_ADDRESS: (addressId: string) => `/user/addresses/${addressId}`,
    DELETE_ADDRESS: (addressId: string) => `/user/addresses/${addressId}`,
  },
} as const;

export type ApiRouteType = typeof ApiRoute;
