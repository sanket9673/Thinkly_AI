import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'emerald' | 'violet' | 'amber' | 'zinc' | 'outline' | 'danger';
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'zinc',
  ...props
}) => {
  const variantStyles = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    zinc: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    outline: 'bg-transparent text-zinc-300 border-zinc-700',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
  };

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
};
