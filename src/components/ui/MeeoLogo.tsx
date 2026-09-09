import React from 'react';
import Link from 'next/link';

interface MeeoLogoProps {
  className?: string;
  iconOnly?: boolean;
  size?: 'sm' | 'md' | 'lg';
  href?: string;
}

export const MeeoLogo: React.FC<MeeoLogoProps> = ({
  className = '',
  iconOnly = false,
  size = 'md',
  href = '/',
}) => {
  const iconHeight = size === 'sm' ? 24 : size === 'lg' ? 40 : 30;
  const textSize =
    size === 'sm' ? 'text-lg font-bold' : size === 'lg' ? 'text-3xl font-extrabold' : 'text-2xl font-bold';

  const logoGraphic = (
    <div className={`inline-flex items-center gap-2 select-none group cursor-pointer ${className}`}>
      {/* Meeo Geometric Icon Mark */}
      <svg
        width={iconHeight}
        height={iconHeight}
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0 transition-transform duration-300 group-hover:scale-105"
      >
        <defs>
          <linearGradient id="meeoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#6355FF" />
            <stop offset="100%" stopColor="#412ce7" />
          </linearGradient>
          <linearGradient id="handleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#fd6a49" />
            <stop offset="100%" stopColor="#FF8F73" />
          </linearGradient>
        </defs>

        {/* Shopping Bag Handle */}
        <path
          d="M196 150 C196 114, 304 114, 304 150"
          fill="none"
          stroke="url(#handleGrad)"
          strokeWidth="28"
          strokeLinecap="round"
        />

        {/* Architectural Meeo M bag body */}
        <path
          d="M 120 376 
             L 120 206 
             C 120 184, 142 168, 164 178 
             L 250 256 
             L 336 178 
             C 358 168, 380 184, 380 206 
             L 380 376 
             C 380 388, 370 398, 356 398 
             L 342 398 
             C 328 398, 318 388, 318 376 
             L 318 268 
             L 266 314 
             C 256 322, 244 322, 234 314 
             L 182 268 
             L 182 376 
             C 182 388, 172 398, 158 398 
             L 144 398 
             C 130 398, 120 388, 120 376 Z"
          fill="url(#meeoGrad)"
        />
      </svg>

      {!iconOnly && (
        <span className={`tracking-tight text-[#131b2e] leading-none ${textSize}`}>
          meeo<span className="text-[#fd6a49] font-black">.</span>
        </span>
      )}
    </div>
  );

  if (href) {
    return <Link href={href}>{logoGraphic}</Link>;
  }

  return logoGraphic;
};
