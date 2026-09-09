import React from 'react';
import Link from 'next/link';
import { PackageOpen, Sparkles } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onActionClick?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel = 'Explore Drops',
  actionHref = '/category',
  onActionClick,
  className = '',
}) => {
  return (
    <div
      className={`w-full bg-white rounded-2xl border border-[#e2e7ff] p-10 sm:p-14 flex flex-col items-center text-center shadow-sm ${className}`}
    >
      <div className="w-16 h-16 rounded-2xl bg-[#eaedff] text-[#412ce7] flex items-center justify-center mb-5 shadow-sm">
        {icon || <PackageOpen className="w-8 h-8 stroke-[1.5]" />}
      </div>
      <h3 className="text-xl font-bold text-[#131b2e] tracking-tight">{title}</h3>
      <p className="text-sm text-[#464556] max-w-md mt-2 mb-6 leading-relaxed">
        {description}
      </p>

      {actionHref ? (
        <Link href={actionHref}>
          <Button variant="primary" size="md" leftIcon={<Sparkles className="w-4 h-4" />}>
            {actionLabel}
          </Button>
        </Link>
      ) : onActionClick ? (
        <Button
          variant="primary"
          size="md"
          onClick={onActionClick}
          leftIcon={<Sparkles className="w-4 h-4" />}
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
};
