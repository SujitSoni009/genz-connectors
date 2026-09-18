import React, { useState, MouseEvent } from 'react';
import { cn } from '@/src/lib/utils';
import { Loader2 } from 'lucide-react';
import { Slot } from '@radix-ui/react-slot';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  isLoading?: boolean;
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', isLoading, asChild = false, children, onClick, disabled, ...props }, ref) => {
    const variants = {
      default: 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm',
      secondary: 'bg-secondary-500 text-white hover:bg-secondary-600 shadow-sm',
      outline: 'border border-stone-200 bg-white hover:bg-stone-50 text-stone-900',
      ghost: 'hover:bg-stone-100 text-stone-900',
      link: 'text-primary-600 underline-offset-4 hover:underline',
    };

    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-12 rounded-lg px-8 text-lg',
      icon: 'h-10 w-10',
    };

    const [ripples, setRipples] = useState<{ x: number; y: number; size: number; key: number }[]>([]);

    const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
      if (disabled || isLoading) return;
      const rect = e.currentTarget.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const newRipple = { x, y, size, key: Date.now() };
      setRipples((prev) => [...prev, newRipple]);
      
      setTimeout(() => {
        setRipples((prev) => prev.filter(r => r.key !== newRipple.key));
      }, 600);
      
      if (onClick) onClick(e);
    };

    const baseStyles = 'relative overflow-hidden inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-200 hover:shadow-md active:scale-[0.97] focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-primary-500/50 disabled:pointer-events-none disabled:opacity-50';

    if (asChild) {
      return (
        <Slot
          ref={ref as any}
          className={cn(baseStyles, variants[variant], sizes[size], className)}
          onClick={onClick}
          {...props}
        >
          {children}
        </Slot>
      );
    }

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        onClick={handleClick}
        {...props}
      >
        {ripples.map(r => (
          <span
            key={r.key}
            className="absolute rounded-full animate-ripple pointer-events-none bg-current opacity-10"
            style={{ left: r.x, top: r.y, width: r.size, height: r.size }}
          />
        ))}
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin relative z-10" />}
        <span className="relative z-10 flex items-center">{children}</span>
      </button>
    );
  }
);
Button.displayName = 'Button';
