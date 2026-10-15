'use client';

import React, { useEffect } from 'react';
import { X, Play } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export const VideoModal: React.FC<VideoModalProps> = ({
  isOpen,
  onClose,
  title = 'UrbanNest Craftsmanship & Design Story',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-urban-fadeInUp"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-[#1A1614] rounded-2xl overflow-hidden shadow-2xl border border-[#E8E2DA]/20 text-[#FAF8F5]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8E2DA]/10">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#C27838] animate-pulse" />
            <h3 className="font-serif text-lg font-medium text-[#FAF8F5]">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full flex items-center justify-center text-[#E8E2DA] hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Player Frame / Showcase */}
        <div className="relative aspect-video w-full bg-[#120F0D] flex flex-col items-center justify-center p-8 text-center">
          <div className="relative z-10 max-w-md flex flex-col items-center">
            <div className="w-18 h-18 rounded-full bg-[#8C5338] text-white flex items-center justify-center mb-6 shadow-xl animate-pulse">
              <Play className="w-8 h-8 fill-current translate-x-0.5" />
            </div>
            <h4 className="font-serif text-2xl font-semibold mb-2 text-[#FAF8F5]">
              Every Step A Better You
            </h4>
            <p className="text-sm text-[#E8E2DA]/80 leading-relaxed">
              Step into the artisanal process of Italian full-grain leather selection, sculpted cushioning soles, and thoughtful ergonomic geometry engineered for all-day comfort.
            </p>
          </div>

          {/* Cinematic Background Gradient */}
          <div className="absolute inset-0 bg-radial from-[#8C5338]/20 via-[#1A1614]/80 to-[#120F0D]" />
        </div>
      </div>
    </div>
  );
};
