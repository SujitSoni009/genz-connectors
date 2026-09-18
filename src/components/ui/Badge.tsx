import React from 'react';
import { cn } from '@/src/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const variants = {
    default: 'border-transparent hover:border-primary-300 bg-primary-100 text-primary-700 hover:bg-primary-200 hover:text-primary-800',
    secondary: 'border-transparent bg-secondary-100 text-secondary-700 hover:bg-secondary-200',
    outline: 'text-stone-950 hover:bg-stone-50',
    success: 'border-transparent bg-emerald-100 text-emerald-800 hover:bg-emerald-200',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-all duration-200 hover:scale-[1.03] focus:outline-none focus:ring-2 focus:ring-stone-950 focus:ring-offset-2',
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
