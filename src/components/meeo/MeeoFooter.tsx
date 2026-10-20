'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useToast } from '@/context/ToastContext';

export const MeeoFooter: React.FC = () => {
  const { showToast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      showToast('Please enter a valid email address');
      return;
    }
    showToast('Thank you for subscribing to Meeo private drops!');
    setEmail('');
  };

  return (
    <footer className="w-full bg-[#1A1614] text-[#FAF8F5] pt-16 sm:pt-20 pb-12 border-t border-[#2D2621]">
      <div className="max-w-[88rem] mx-auto px-4 sm:px-6 lg:px-10">
        
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-16 border-b border-[#2D2621]">
          
          {/* Brand Column */}
          <div className="lg:col-span-4 flex flex-col items-start">
            <Link
              href="/"
              className="font-serif text-3xl font-bold tracking-tight text-[#FAF8F5] mb-4 hover:opacity-90 transition-opacity"
            >
              Meeo
            </Link>
            <p className="text-sm text-[#E8E2DA]/70 leading-relaxed max-w-sm mb-6 font-sans">
              Meeo creates refined footwear and lifestyle essentials. Thoughtfully designed with premium materials, engineered for comfort, and crafted for your everyday journey.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#2D2621] hover:bg-[#8C5338] text-[#FAF8F5] flex items-center justify-center transition-colors"
                aria-label="Meeo on Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#2D2621] hover:bg-[#8C5338] text-[#FAF8F5] flex items-center justify-center transition-colors"
                aria-label="Meeo on Twitter"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#2D2621] hover:bg-[#8C5338] text-[#FAF8F5] flex items-center justify-center transition-colors"
                aria-label="Meeo on Facebook"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.667 5H18V0h-3.833C10.5 0 9 1.5 9 4.667V8z"/>
                </svg>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-9 h-9 rounded-full bg-[#2D2621] hover:bg-[#8C5338] text-[#FAF8F5] flex items-center justify-center transition-colors"
                aria-label="Meeo on YouTube"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div className="lg:col-span-2">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#C27838] mb-4">
              Shop
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-[#E8E2DA]/80">
              <li>
                <Link href="/category?cat=sneakers" className="hover:text-white transition-colors">
                  Sneakers
                </Link>
              </li>
              <li>
                <Link href="/category?cat=men" className="hover:text-white transition-colors">
                  Men&apos;s Collection
                </Link>
              </li>
              <li>
                <Link href="/category?cat=women" className="hover:text-white transition-colors">
                  Women&apos;s Collection
                </Link>
              </li>
              <li>
                <Link href="/category?cat=apparel" className="hover:text-white transition-colors">
                  Apparel
                </Link>
              </li>
              <li>
                <Link href="/category?cat=accessories" className="hover:text-white transition-colors">
                  Accessories
                </Link>
              </li>
              <li>
                <Link href="/category?cat=lifestyle" className="hover:text-white transition-colors">
                  Lifestyle
                </Link>
              </li>
            </ul>
          </div>

          {/* Support Links */}
          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#C27838] mb-4">
              Customer Support
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-[#E8E2DA]/80">
              <li>
                <Link href="/track" className="hover:text-white transition-colors">
                  Track Order
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-white transition-colors">
                  Shipping &amp; Delivery
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-white transition-colors">
                  7-Day Returns &amp; Exchanges
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-white transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="lg:col-span-3">
            <h4 className="text-xs uppercase tracking-wider font-semibold text-[#C27838] mb-4">
              Stay in the Loop
            </h4>
            <p className="text-xs text-[#E8E2DA]/70 leading-relaxed mb-4">
              Subscribe to get exclusive access to limited drops, archival releases, and 10% off your first order.
            </p>
            <form onSubmit={handleSubscribe} className="flex items-center gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 bg-[#2D2621] border border-[#E8E2DA]/20 rounded-full px-4 py-2.5 text-xs text-[#FAF8F5] placeholder:text-[#E8E2DA]/40 focus:outline-hidden focus:border-[#C27838] transition-colors"
              />
              <button
                type="submit"
                className="w-10 h-10 rounded-full bg-[#8C5338] hover:bg-[#6E3F29] text-white flex items-center justify-center shrink-0 transition-colors cursor-pointer shadow-xs"
                aria-label="Subscribe to newsletter"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Bottom Legal & Copyright Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#E8E2DA]/60">
          <p>© 2026 Meeo E-Commerce Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-white transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-white transition-colors">
              Terms of Service
            </Link>
            <Link href="/cookies" className="hover:text-white transition-colors">
              Cookie Settings
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
