'use client';

import React from 'react';
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';

interface RatingStarsProps {
  rating: number;
  count?: number;
  size?: 'sm' | 'md';
  showNumeric?: boolean;
  className?: string;
  readOnly?: boolean;
  onChange?: (val: number | null) => void;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  count,
  size = 'sm',
  showNumeric = true,
  className = '',
  readOnly = true,
  onChange,
}) => {
  return (
    <div className={`inline-flex items-center gap-1.5 ${className}`}>
      <Rating
        value={rating}
        precision={0.1}
        readOnly={readOnly}
        onChange={(_, val) => onChange && onChange(val)}
        size={size === 'sm' ? 'small' : 'medium'}
        icon={<StarIcon fontSize="inherit" style={{ color: '#fd6a49' }} />}
        emptyIcon={<StarIcon fontSize="inherit" style={{ color: '#c7c4d9' }} />}
      />

      {showNumeric && (
        <span className="text-[10px] sm:text-xs font-bold text-[#131b2e] leading-none">
          {rating.toFixed(2)}
        </span>
      )}
      {count !== undefined && (
        <span className="text-[9px] sm:text-xs text-[#777588]">({count})</span>
      )}
    </div>
  );
};
