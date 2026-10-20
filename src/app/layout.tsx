import type { Metadata, Viewport } from 'next';
import { Plus_Jakarta_Sans, Playfair_Display } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/context/ThemeContext';
import { MuiThemeRegistry } from '@/components/theme/MuiThemeRegistry';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { NotificationProvider } from '@/context/NotificationContext';
import { SearchFilterProvider } from '@/context/SearchFilterContext';
import { ToastProvider } from '@/context/ToastContext';
import { QueryProvider } from '@/context/QueryProvider';
import { AuthProvider } from '@/context/AuthContext';
import { Header } from '@/components/navigation/Header';
import { MobileNav } from '@/components/navigation/MobileNav';
import { QuickSearchModal } from '@/components/navigation/QuickSearchModal';
import { CartDrawer } from '@/components/navigation/CartDrawer';
import { Footer } from '@/components/navigation/Footer';
import { SITE_CONFIG, generateOrganizationSchema, generateWebSiteSchema } from '@/config/seo';
import { JsonLd } from '@/components/seo/JsonLd';

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-plus-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800', '900'],
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#FAF8F5' },
    { media: '(prefers-color-scheme: dark)', color: '#120F0D' },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: 'Meeo E-Commerce · Modern Lifestyle, Apparel & Curated Essentials',
    template: '%s | Meeo',
  },
  description: 'Meeo: Curated collections of premium apparel, lifestyle goods, electronics, and home essentials.',
  keywords: SITE_CONFIG.keywords,
  authors: SITE_CONFIG.authors,
  creator: SITE_CONFIG.creator,
  publisher: SITE_CONFIG.publisher,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.locale,
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: 'Meeo · Mindful Tech-Commerce & Tactile Objects',
    description: SITE_CONFIG.description,
    images: [
      {
        url: '/assets/meeo-icon.svg',
        width: 1200,
        height: 630,
        alt: 'Meeo Tactile Commerce',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Meeo · Mindful Tech-Commerce & Tactile Objects',
    description: SITE_CONFIG.description,
    creator: SITE_CONFIG.twitterHandle,
    images: ['/assets/meeo-icon.svg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: [
      { url: '/assets/meeo-icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/assets/meeo-icon.svg',
    apple: '/assets/meeo-icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${playfair.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* Global JSON-LD Structured Data */}
        <JsonLd schema={[generateOrganizationSchema(), generateWebSiteSchema()]} />

        {/* Browser Tab Icon / Favicon */}
        <link rel="icon" type="image/svg+xml" href="/assets/meeo-icon.svg" />
        <link rel="apple-touch-icon" href="/assets/meeo-icon.svg" />

        {/* Material Symbols Outlined font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
        />
        {/* Instant Theme Initializer to prevent visual flash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var t = localStorage.getItem('meeo_theme');
                  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  var isDark = t === 'dark' || (t === 'system' && prefersDark) || (!t && prefersDark);
                  var root = document.documentElement;
                  if (isDark) {
                    root.classList.add('dark');
                    root.setAttribute('data-theme', 'dark');
                    root.style.colorScheme = 'dark';
                  } else {
                    root.classList.remove('dark');
                    root.setAttribute('data-theme', 'light');
                    root.style.colorScheme = 'light';
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-[#FAF8F5] text-[#2D2621] overflow-x-hidden w-full font-sans">
        <ThemeProvider>
          <MuiThemeRegistry>
            <ToastProvider>
              <QueryProvider>
                <AuthProvider>
                  <CartProvider>
                    <WishlistProvider>
                      <NotificationProvider>
                        <SearchFilterProvider>
                          {/* Global Fixed Navigation Header */}
                          <Header />

                          {/* Main Viewport Container */}
                          <main className="flex-1 w-full pb-16 md:pb-0 overflow-x-hidden">
                            {children}
                          </main>

                          {/* Global Footer */}
                          <Footer />

                          {/* Overlays & Drawers */}
                          <QuickSearchModal />
                          <CartDrawer />
                          <MobileNav />
                        </SearchFilterProvider>
                      </NotificationProvider>
                    </WishlistProvider>
                  </CartProvider>
                </AuthProvider>
              </QueryProvider>
            </ToastProvider>
          </MuiThemeRegistry>
        </ThemeProvider>
      </body>
    </html>
  );
}
