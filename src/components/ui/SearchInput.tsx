'use client';

import React from 'react';
import { Search } from 'lucide-react';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
  onClick?: () => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
  autoFocus?: boolean;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  onClear,
  onClick,
  placeholder = 'Search products, brands and categories',
  readOnly = false,
  className = '',
  autoFocus = false,
}) => {
  return (
    <div
      onClick={onClick}
      className={`relative flex items-center w-full bg-[#ffffff] rounded-xl shadow-[0_1px_4px_rgba(19,27,46,0.04)] border border-[#c7c4d9]/50 hover:border-[#412ce7]/40 focus-within:border-[#412ce7] focus-within:ring-2 focus-within:ring-[#412ce7]/15 transition-all px-3.5 py-2.5 ${
        onClick ? 'cursor-pointer' : ''
      } ${className}`}
    >
      <Search className="w-4 h-4 text-[#777588] shrink-0 mr-2.5" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        readOnly={readOnly}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className="w-full bg-transparent text-[#131b2e] placeholder:text-[#777588] text-sm outline-none cursor-inherit font-medium"
      />
      {value && onClear ? (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClear();
          }}
          className="p-1 rounded-full text-[#777588] hover:text-[#131b2e] hover:bg-[#f2f3ff] transition-colors shrink-0"
        >
          ✕
        </button>
      ) : (
        <div className="flex items-center gap-1 bg-[#f2f3ff] px-2 py-0.5 rounded text-[#777588] text-[11px] font-bold tracking-wider shrink-0 pointer-events-none">
          <span>⌘</span>
          <span>K</span>
        </div>
      )}
    </div>
  );
};
