/**
 * @file test-routes-services.mjs
 * @description Unit and integration test suite for ApiRoute, AppRoute, and queryKeys.
 */

import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';

// 1. Test ApiRoute
import { ApiRoute } from '../src/routes/api-route.ts';

console.log('--- 1. Testing ApiRoute Constants & URL Builders ---');

// Auth routes
assert.strictEqual(ApiRoute.AUTH.LOGIN, '/auth/login');
assert.strictEqual(ApiRoute.AUTH.REGISTER, '/auth/register');
assert.strictEqual(ApiRoute.AUTH.OTP_VERIFICATION, '/auth/verify-otp');
assert.strictEqual(ApiRoute.AUTH.RESEND_OTP, '/auth/resend-otp');
assert.strictEqual(ApiRoute.AUTH.FORGOT_PASSWORD, '/auth/forgot-password');
assert.strictEqual(ApiRoute.AUTH.VERIFY_RESET_OTP, '/auth/verify-reset-otp');
assert.strictEqual(ApiRoute.AUTH.RESET_PASSWORD, '/auth/reset-password');
assert.strictEqual(ApiRoute.AUTH.GOOGLE_AUTH, '/auth/google');
assert.strictEqual(ApiRoute.AUTH.REFRESH, '/auth/refresh');
assert.strictEqual(ApiRoute.AUTH.ME, '/auth/me');
assert.strictEqual(ApiRoute.AUTH.LOGOUT, '/auth/logout');
assert.strictEqual(ApiRoute.AUTH.LOGOUT_ALL, '/auth/logout-all');
assert.strictEqual(ApiRoute.AUTH.SESSIONS, '/auth/sessions');
assert.strictEqual(ApiRoute.AUTH.SESSION_ID('sess-123'), '/auth/sessions/sess-123');
assert.strictEqual(ApiRoute.AUTH.REVOKE_ALL_SESSIONS, '/auth/sessions/revoke-all');
assert.strictEqual(ApiRoute.AUTH.ACCOUNTS, '/auth/accounts');
assert.strictEqual(ApiRoute.AUTH.SET_PASSWORD, '/auth/password/set');
assert.strictEqual(ApiRoute.AUTH.CHANGE_PASSWORD, '/auth/password/change');
assert.strictEqual(ApiRoute.AUTH.LINK_GOOGLE, '/auth/accounts/google/link');
assert.strictEqual(ApiRoute.AUTH.UNLINK_ACCOUNT('google'), '/auth/accounts/google');

// User routes
assert.strictEqual(ApiRoute.USER.PROFILE, '/user/profile');
assert.strictEqual(ApiRoute.USER.ADDRESSES, '/user/addresses');
assert.strictEqual(ApiRoute.USER.UPDATE_ADDRESS('addr-1'), '/user/addresses/addr-1');
assert.strictEqual(ApiRoute.USER.DELETE_ADDRESS('addr-1'), '/user/addresses/addr-1');
assert.strictEqual(ApiRoute.USER.PHONE_REQUEST_OTP, '/user/phone/request-otp');
assert.strictEqual(ApiRoute.USER.UPDATE_PHONE_NO, '/user/phone');

// Product & Catalog routes
assert.strictEqual(ApiRoute.PRODUCT.PRODUCTS, '/products');
assert.strictEqual(ApiRoute.PRODUCT.PRODUCT_DETAILS('prod-123'), '/products/prod-123');
assert.strictEqual(ApiRoute.PRODUCT.PRODUCT_BY_SLUG('nike-air-max'), '/products/slug/nike-air-max');
assert.strictEqual(ApiRoute.PRODUCT.PRODUCT_ATTRIBUTES('prod-123'), '/products/prod-123/attributes');
assert.strictEqual(ApiRoute.CATEGORIES.CATEGORIES, '/categories');
assert.strictEqual(ApiRoute.CATEGORIES.CATEGORIES_TREE, '/categories/tree');
assert.strictEqual(ApiRoute.CATEGORIES.CATEGORIES_BY_ID('cat-1'), '/categories/cat-1');
assert.strictEqual(ApiRoute.BRAND.BRANDS, '/brands');
assert.strictEqual(ApiRoute.BRAND.SINGLE_BRAND('brand-1'), '/brands/brand-1');

// Cart & Wishlist routes
assert.strictEqual(ApiRoute.CART.CART, '/cart');
assert.strictEqual(ApiRoute.CART.CART_ITEMS, '/cart/items');
assert.strictEqual(ApiRoute.CART.UPDATE_CART_ITEMS('item-1'), '/cart/items/item-1');
assert.strictEqual(ApiRoute.CART.DELETE_CART_ITEMS('item-1'), '/cart/items/item-1');
assert.strictEqual(ApiRoute.CART.MERGE_CART, '/cart/merge');
assert.strictEqual(ApiRoute.WISHLISTS.BASE, '/wishlists');
assert.strictEqual(ApiRoute.WISHLISTS.SINGULAR_BASE, '/wishlist');
assert.strictEqual(ApiRoute.WISHLISTS.SINGULAR_PRODUCT('p-1'), '/wishlist/products/p-1');
assert.strictEqual(ApiRoute.WISHLISTS.SINGULAR_TRANSFER_TO_CART('p-1'), '/wishlist/products/p-1/move-to-cart');

// Orders & Payments routes
assert.strictEqual(ApiRoute.ORDERS.ORDERS, '/orders');
assert.strictEqual(ApiRoute.ORDERS.ORDER_CHECKOUT, '/orders/checkout');
assert.strictEqual(ApiRoute.ORDERS.VALIDATE_CHECKOUT_ORDER, '/orders/validate-checkout');
assert.strictEqual(ApiRoute.ORDERS.ORDER_DETAILS('ord-99'), '/orders/ord-99');
assert.strictEqual(ApiRoute.ORDERS.ORDER_NUMBER('ORD-001'), '/orders/number/ORD-001');
assert.strictEqual(ApiRoute.ORDERS.ORDER_CANCEL('ord-99'), '/orders/ord-99/cancel');
assert.strictEqual(ApiRoute.PAYMENTS.INITIALIZE, '/payments/initialize');
assert.strictEqual(ApiRoute.PAYMENTS.VERIFY, '/payments/verify');
assert.strictEqual(ApiRoute.PAYMENTS.GET_PAYMENT('pay-1'), '/payments/pay-1');
assert.strictEqual(ApiRoute.PAYMENTS.RETRY, '/payments/retry');

// Reviews & Search routes
assert.strictEqual(ApiRoute.REVIEWS.PRODUCT_REVIEWS('p-1'), '/reviews/products/p-1');
assert.strictEqual(ApiRoute.REVIEWS.PRODUCT_REVIEWS_SUMMARY('p-1'), '/reviews/products/p-1/summary');
assert.strictEqual(ApiRoute.REVIEWS.REVIEWS, '/reviews');
assert.strictEqual(ApiRoute.REVIEWS.GET_MY_REVIEWS, '/reviews/my-reviews');
assert.strictEqual(ApiRoute.REVIEWS.UPDATE_REVIEWS('rev-1'), '/reviews/rev-1');
assert.strictEqual(ApiRoute.REVIEWS.DELETE_REVIEWS('rev-1'), '/reviews/rev-1');
assert.strictEqual(ApiRoute.REVIEWS.REPORT('rev-1'), '/reviews/rev-1/report');
assert.strictEqual(ApiRoute.SEARCHES.SEARCH, '/search');
assert.strictEqual(ApiRoute.SEARCHES.SEARCH_SUGGESTIONS, '/search/suggestions');
assert.strictEqual(ApiRoute.SEARCHES.SEARCH_FACETS, '/search/facets');
assert.strictEqual(ApiRoute.DISCOVERY.DISCOVERY_FEATURED, '/discovery/featured');
assert.strictEqual(ApiRoute.DISCOVERY.DISCOVERY_TRENDING, '/discovery/trending');
assert.strictEqual(ApiRoute.DISCOVERY.DISCOVERY_NEW_ARRIVALS, '/discovery/new-arrivals');
assert.strictEqual(ApiRoute.DISCOVERY.DISCOVERY_RELATED_PRODUCT('p-1'), '/discovery/related/p-1');

console.log('✓ All ApiRoute endpoints passed validation!');

// 2. Test AppRoute
import { AppRoute } from '../src/routes/app-route.ts';

console.log('--- 2. Testing AppRoute Constants & URL Helpers ---');

assert.strictEqual(AppRoute.HOME, '/');
assert.strictEqual(AppRoute.ABOUT, '/about');
assert.strictEqual(AppRoute.CATEGORY, '/category');
assert.strictEqual(AppRoute.CATEGORY_WITH_QUERY('running shoes'), '/category?q=running%20shoes');
assert.strictEqual(
  AppRoute.CATEGORY_FILTER({ category: 'shoes', brand: 'Nike' }),
  '/category?category=shoes&brand=Nike'
);
assert.strictEqual(AppRoute.PRODUCTS, '/product');
assert.strictEqual(AppRoute.PRODUCT('nike-air-max'), '/product/nike-air-max');
assert.strictEqual(AppRoute.PRODUCT('p with spaces'), '/product/p%20with%20spaces');
assert.strictEqual(AppRoute.SEARCH(), '/search');
assert.strictEqual(AppRoute.SEARCH('tactile keyboard'), '/search?q=tactile%20keyboard');
assert.strictEqual(AppRoute.CART, '/cart');
assert.strictEqual(AppRoute.CHECKOUT, '/checkout');
assert.strictEqual(AppRoute.ACCOUNT, '/account');
assert.strictEqual(AppRoute.WISHLIST, '/wishlist');
assert.strictEqual(AppRoute.ORDERS, '/orders');
assert.strictEqual(AppRoute.ORDER_DETAIL('ord-123'), '/orders/ord-123');

// Auth app routes
assert.strictEqual(AppRoute.AUTH.LOGIN, '/login');
assert.strictEqual(
  AppRoute.AUTH.LOGIN_WITH_REDIRECT('/product/sneaker-1'),
  '/login?redirect=%2Fproduct%2Fsneaker-1'
);
assert.strictEqual(AppRoute.AUTH.REGISTER, '/register');
assert.strictEqual(
  AppRoute.AUTH.VERIFY_OTP({ email: 'test@meeo.com', mode: 'login', redirect: '/checkout' }),
  '/verify-otp?email=test%40meeo.com&mode=login&redirect=%2Fcheckout'
);
assert.strictEqual(
  AppRoute.AUTH.VERIFY_OTP('test@meeo.com', '/checkout'),
  '/verify-otp?email=test%40meeo.com&redirect=%2Fcheckout'
);
assert.strictEqual(AppRoute.AUTH.FORGOT_PASSWORD, '/forgot-password');
assert.strictEqual(
  AppRoute.AUTH.RESET_PASSWORD('test@meeo.com'),
  '/reset-password?email=test%40meeo.com'
);

console.log('✓ All AppRoute URLs & dynamic helpers passed validation!');

// 3. Test QueryKeys Factory
import { queryKeys } from '../src/hooks/queryKeys.ts';

console.log('--- 3. Testing QueryKeys Factory ---');

assert.deepStrictEqual(queryKeys.auth.all, ['auth']);
assert.deepStrictEqual(queryKeys.auth.me(), ['auth', 'me']);
assert.deepStrictEqual(queryKeys.auth.currentUser(), ['auth', 'currentUser']);
assert.deepStrictEqual(queryKeys.auth.accounts(), ['auth', 'accounts']);
assert.deepStrictEqual(queryKeys.auth.sessions(), ['auth', 'sessions']);
assert.deepStrictEqual(queryKeys.user.addresses(), ['user', 'addresses']);
assert.deepStrictEqual(queryKeys.user.addressDetail('addr-1'), ['user', 'addresses', 'addr-1']);
assert.deepStrictEqual(queryKeys.catalog.products({ page: 1 }), ['catalog', 'products', { page: 1 }]);
assert.deepStrictEqual(queryKeys.catalog.productBySlug('slug-1'), ['catalog', 'product', 'slug', 'slug-1']);
assert.deepStrictEqual(queryKeys.catalog.categories(true), ['catalog', 'categories', { tree: true }]);
assert.deepStrictEqual(queryKeys.cart.active(), ['cart', 'active']);
assert.deepStrictEqual(queryKeys.wishlist.active(), ['wishlist', 'active']);
assert.deepStrictEqual(queryKeys.orders.detail('o-1'), ['orders', 'detail', 'o-1']);
assert.deepStrictEqual(queryKeys.reviews.byProduct('p-1'), ['reviews', 'product', 'p-1', {}]);
assert.deepStrictEqual(queryKeys.payments.status('pay-1'), ['payments', 'status', 'pay-1']);

console.log('✓ All QueryKey factory entries passed validation!');

// 4. Verify that Services files reference ApiRoute properly
console.log('--- 4. Checking Service Files for ApiRoute Integration ---');

const servicesDir = path.resolve('src/services');
const serviceFiles = [
  'auth/authService.ts',
  'cart/cartService.ts',
  'catalog/catalogService.ts',
  'coupon/couponService.ts',
  'order/orderService.ts',
  'payment/paymentService.ts',
  'product/productService.ts',
  'review/reviewService.ts',
  'search/searchService.ts',
  'user/userService.ts',
  'user/addressService.ts',
  'wishlist/wishlistService.ts',
];

for (const relPath of serviceFiles) {
  const fullPath = path.join(servicesDir, relPath);
  assert(fs.existsSync(fullPath), `Service file must exist: ${relPath}`);
  const content = fs.readFileSync(fullPath, 'utf8');
  assert(
    content.includes('ApiRoute'),
    `Service ${relPath} must import and use ApiRoute`
  );
  console.log(`  ✓ ${relPath} uses ApiRoute`);
}

console.log('\n=======================================');
console.log('🎉 ALL ROUTES, SERVICES & HOOK KEYS TESTS PASSED!');
console.log('=======================================');
