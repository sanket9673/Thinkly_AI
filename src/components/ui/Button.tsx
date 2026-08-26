import React from 'react';
import { motion } from 'framer-motion';
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
      primary: 'bg-gradient-to-r from-emerald-500 to-teal-600 text-zinc-950 font-bold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 hover:brightness-110 border border-emerald-400/20',
      secondary: 'bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 shadow-md',
      outline: 'border border-zinc-700 bg-transparent text-zinc-200 hover:bg-zinc-800/60 font-medium',
      ghost: 'bg-transparent text-zinc-300 hover:bg-zinc-800/50 hover:text-white',
      emerald: 'bg-emerald-600 text-white hover:bg-emerald-500 font-medium shadow-md shadow-emerald-950/40',
      violet: 'bg-violet-600 text-white hover:bg-violet-500 font-medium shadow-md shadow-violet-950/40',
      amber: 'bg-amber-600 text-white hover:bg-amber-500 font-medium shadow-md shadow-amber-950/40',
      danger: 'bg-rose-600 text-white hover:bg-rose-500 font-medium shadow-md shadow-rose-950/40',
    };

    const sizeStyles = {
      sm: 'h-8.5 px-3 text-xs rounded-md',
      md: 'h-10 px-4 text-sm rounded-lg',
      lg: 'h-12 px-6 text-base rounded-lg',
      icon: 'h-9.5 w-9.5 p-0 rounded-lg justify-center',
    };

    return (
      <motion.button
        ref={ref as any}
        disabled={disabled || isLoading}
        whileHover={disabled || isLoading ? {} : { scale: 1.02 }}
        whileTap={disabled || isLoading ? {} : { scale: 0.98 }}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-sans transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
          variantStyles[variant],
          sizeStyles[size],
          className
        )}
        {...(props as any)}
      >
        {isLoading && <Loader2 className="h-4 w-4 animate-spin text-current" />}
        {children}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';
export default Button;
