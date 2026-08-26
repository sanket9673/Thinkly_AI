import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'emerald' | 'violet' | 'amber' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading = false, children, disabled, ...props }, ref) => {
    const variantStyles = {
      primary: 'bg-zinc-100 text-zinc-900 hover:bg-white font-medium',
      secondary: 'bg-zinc-800 text-zinc-100 hover:bg-zinc-700 font-medium',
      outline: 'border border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800/60 font-medium',
      ghost: 'bg-transparent text-zinc-300 hover:bg-zinc-800/50 hover:text-white',
      emerald: 'bg-emerald-600 text-white hover:bg-emerald-500 font-medium shadow-md shadow-emerald-950/40',
      violet: 'bg-violet-600 text-white hover:bg-violet-500 font-medium shadow-md shadow-violet-950/40',
      amber: 'bg-amber-600 text-white hover:bg-amber-500 font-medium shadow-md shadow-amber-950/40',
      danger: 'bg-rose-600 text-white hover:bg-rose-500 font-medium shadow-md shadow-rose-950/40',
    };

    const sizeStyles = {
      sm: 'h-8 px-3 text-xs rounded-md',
      md: 'h-10 px-4 text-sm rounded-lg',
      lg: 'h-12 px-6 text-base rounded-lg',
      icon: 'h-9 w-9 p-0 rounded-lg justify-center',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-sans transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current" />}
        {children}
      </button>
    );
  }
);
Button.displayName = 'Button';
