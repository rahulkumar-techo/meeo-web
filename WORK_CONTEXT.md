# UrbanNest Web — Development Context & Progress Handoff
**Date:** October 13, 2026  
**Project:** Meeo-Web / UrbanNest Premium Footwear & Lifestyle Store  
**Framework:** Next.js 16 (App Router) • React 19 • TypeScript • Tailwind CSS • TanStack Query • Zustand  

---

## 1. Executive Summary & Today's Milestones

Today, we accomplished major end-to-end features across UI design, Authentication, and Live Backend API integration:

1. **UrbanNest Luxury Design System**:
   - Recreated the editorial design system matching the reference aesthetic: `#FAF8F5` (background), `#2D2621` (primary text), `#8C5338` (warm terracotta accent), `#E8E2DA` (subtle borders).
   - Preserved the interactive 3D sneaker hero banner (`UrbanNestHero.tsx`).
   - Built editorial storefront sections: Hero, Service Badges, Image-led Categories, Trending Products, Sale Banner, and Quick Search.

2. **Authentication Flow & Google OAuth Integration**:
   - Resolved type mismatches and import paths in `src/hooks/auth/useAuth.ts`, `src/services/auth/authService.ts`, and `src/services/auth/auth.type.ts`.
   - Wired up **Password Login** (`POST /auth/login`) with device identification and redirect preservation.
   - Integrated **Google Sign-In** using `@react-oauth/google`:
     - Wrapped auth layout with `<GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>`.
     - Embedded Google's GSI component (`GoogleLogin`) styled in pill outline mode.
     - Connected returned ID token to `useSignInWithGoogle` invoking `POST /auth/google`.
   - Added **Unavailable Service Notifications**: When Apple or Passkey is clicked, an informational banner and toast prompt:
     > *"This service is not available at this moment. Please sign in with Email or Google."*
   - Fixed backend schema validation error: Backend restricts `deviceName` to `<= 100` characters. Created `src/lib/device.ts` with `getDeviceInfo()` (e.g. `"Chrome on Windows"`, < 80 chars) and `formatApiErrorMessage()` to defensively handle nested backend validation errors.

3. **Live Product API Integration**:
   - Backend URL: `https://meeo-server.onrender.com/api/v1` (with Next.js rewrite configured in `next.config.ts`).
   - Enabled Next.js remote image optimization for `ik.imagekit.io` and `images.unsplash.com`.
   - Built [`src/services/product/productAdapter.ts`](src/services/product/productAdapter.ts) to transform backend `{ data: { items: [...] } }` into UI models.
   - Connected **Homepage Trending Section** (`UrbanNestTrending.tsx`) to fetch actual live products (`boAt Airdopes 141`, `Sonus Pro Wireless Headphones`, `Apple AirPods Pro`, etc.) while **leaving the hero 3D banner completely untouched**.
   - Connected **Catalog / Product List Page** (`/category` via `CatalogView.tsx`) to display live products, with dynamic brand filters automatically extracted from the API items.
   - Connected **Product Details Page** (`/product/[id]`) to dynamically fetch product details, description, real pricing, and ImageKit gallery.
   - Connected **Header Search** (`UrbanNestHeader.tsx`) to offer live product suggestions in dropdown search.

---

## 2. Key Architecture & File Directory

### Authentication & Sessions
- [`src/services/auth/authService.ts`](src/services/auth/authService.ts): API client calls (`login`, `SignInWithGoogle`, `register`, `verifyOtp`, `resendOtp`, `forgotPassword`, `resetPassword`, `getMe`, `getSessions`). Includes defensive character capping for `deviceName` and `deviceId`.
- [`src/services/auth/auth.type.ts`](src/services/auth/auth.type.ts): Core TypeScript types for payloads, users, sessions, and tokens.
- [`src/hooks/auth/useAuth.ts`](src/hooks/auth/useAuth.ts): TanStack Query mutation hooks (`useLoginMutation`, `useSignInWithGoogle`, `useRegisterMutation`, `useVerifyOtpMutation`, etc.).
- [`src/store/user.store.ts`](src/store/user.store.ts): Zustand store (`useUserStore`) managing authenticated user, access/refresh tokens, and hydration.
- [`src/lib/device.ts`](src/lib/device.ts): Generates concise `deviceName` (e.g. `"Chrome on Windows"` < 80 chars) and parses nested API validation errors.
- [`src/app/(auth)/layout.tsx`](src/app/(auth)/layout.tsx): Wraps auth routes with `GoogleOAuthProvider`.
- [`src/features/auth/SocialAuthButtons.tsx`](src/features/auth/SocialAuthButtons.tsx): Google Sign-In and Apple/Passkey buttons with unavailable notices.
- [`src/app/(auth)/login/page.tsx`](src/app/(auth)/login/page.tsx): Password & Google login form with demo autofill and redirect logic.
- [`src/app/(auth)/register/page.tsx`](src/app/(auth)/register/page.tsx): Registration form with Google Sign-in.

### Products & Catalog
- [`src/services/product/productService.ts`](src/services/product/productService.ts): `getProducts()`, `getProductById()`, `getProductBySlug()`.
- [`src/services/product/productAdapter.ts`](src/services/product/productAdapter.ts): Normalizes API items to `UrbanNestProduct`, `CatalogItem`, and `UrbanNestProductDetail`.
- [`src/services/catalog/catalogService.ts`](src/services/catalog/catalogService.ts): Multi-attribute filtering, category trees, brand summaries.
- [`src/components/urbannest/UrbanNestTrending.tsx`](src/components/urbannest/UrbanNestTrending.tsx): Homepage live product grid (Hero banner untouched).
- [`src/components/urbannest/catalog/CatalogView.tsx`](src/components/urbannest/catalog/CatalogView.tsx): Catalog view with dynamic brand filtering, search, sorting, and price brackets.
- [`src/app/product/[id]/page.tsx`](src/app/product/[id]/page.tsx): Server-side product details loader pulling live API data with local fallback.
- [`src/components/urbannest/pdp/ProductDetailsView.tsx`](src/components/urbannest/pdp/ProductDetailsView.tsx): Editorial luxury product details view.

### Configuration & Networking
- [`.env`](.env):
  ```env
  NEXT_PUBLIC_API_URL=/api/v1
  BACKEND_INTERNAL_URL=https://meeo-server.onrender.com/api/v1
  GOOGLE_CLIENT_ID=144276962057-4bvnhi2femp4rv8ddh0t8h437rht5e5t.apps.googleusercontent.com
  NEXT_PUBLIC_GOOGLE_CLIENT_ID=144276962057-4bvnhi2femp4rv8ddh0t8h437rht5e5t.apps.googleusercontent.com
  ```
- [`next.config.ts`](next.config.ts): Rewrites `/api/v1/:path*` to `https://meeo-server.onrender.com/api/v1/:path*` and configures `images.remotePatterns` for `ik.imagekit.io` and `images.unsplash.com`.

---

## 3. Active Endpoints & Data Contracts

### 1. `POST /auth/login`
- **Payload**: `{ email: string, password: string, deviceName?: string, deviceId?: string }`
- **Constraint**: `deviceName` must NOT exceed 100 characters.

### 2. `POST /auth/google`
- **Payload**: `{ idToken: string, deviceName: string, deviceId: string }`
- **Returns**: `{ success: true, data: { user: AuthUser, accessToken: string, refreshToken: string } }`

### 3. `GET /products`
- **Query params**: `{ limit?: number, page?: number, search?: string, sort?: string }`
- **Returns**: `{ success: true, message: "...", data: { items: [...], total: number, page: number, limit: number, totalPages: number } }`

### 4. `GET /products/:id` & `GET /products/slug/:slug`
- **Returns**: `{ success: true, data: { id, name, slug, description, variants: [{ price, compareAtPrice, images: [{ url }] }] } }`

---

## 5. Current State & Verification

- **TypeScript Compilation**: `npx tsc --noEmit` exits with **0 errors**.
- **Dev Server**: Running on `http://localhost:3000`.
- **Pages Verified in Browser**:
  - `http://localhost:3000/` (Homepage with intact Hero & live trending products)
  - `http://localhost:3000/category` (Catalog page with live products and dynamic brand filters)
  - `http://localhost:3000/product/292b67de-7490-4c6e-9aa4-da78b56d3fd0` (Live PDP with real boAt Airdopes data)
  - `http://localhost:3000/login?redirect=%2Fproduct%2Fnike-af1-07` (Password login, Google button, unavailable alert)
  - `http://localhost:3000/register` (Registration with Google Sign-In)
  - `http://localhost:3000/wishlist` (Wishlist collection)
  - `http://localhost:3000/account` (Account dashboard with address book)

---

## 6. Recommended Tasks for Tomorrow

1. **Cart & Checkout Sync with Backend**:
   - Check `cartService.ts` to sync local guest cart items with the backend cart API upon user login.
2. **Order Placement Flow**:
   - Integrate `orderService.ts` and checkout summary page with real cart variants.
3. **User Profile & Address Management**:
   - Connect `src/app/account/addresses/page.tsx` and profile edits to backend user endpoints (`/users/me/addresses`).
4. **Reviews Integration**:
   - Connect PDP reviews section with `reviewService.ts` (`GET /reviews/product/:id`).
