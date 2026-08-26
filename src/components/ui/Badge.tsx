import React from 'react';
import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'emerald' | 'success' | 'violet' | 'purple' | 'amber' | 'zinc' | 'outline' | 'danger';
  showDot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'zinc',
  showDot = false,
  children,
  ...props
}) => {
  const variantStyles = {
    emerald: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_2px_10px_rgba(16,185,129,0.05)]',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_2px_10px_rgba(16,185,129,0.05)]',
    violet: 'bg-violet-500/10 text-violet-400 border-violet-500/30 shadow-[0_2px_10px_rgba(139,92,246,0.05)]',
    purple: 'bg-violet-500/10 text-violet-400 border-violet-500/30 shadow-[0_2px_10px_rgba(139,92,246,0.05)]',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_2px_10px_rgba(245,158,11,0.05)]',
    zinc: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    outline: 'bg-transparent text-zinc-400 border-zinc-800/80',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_2px_10px_rgba(244,63,94,0.05)]',
  };

  const getDotColor = () => {
    if (variant === 'emerald' || variant === 'success') return 'bg-emerald-400';
    if (variant === 'violet' || variant === 'purple') return 'bg-violet-400';
    if (variant === 'amber') return 'bg-amber-400';
    if (variant === 'danger') return 'bg-rose-400';
    return 'bg-zinc-400';
  };

  const hasPulsingDot = showDot || variant === 'emerald' || variant === 'success' || variant === 'danger';

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold tracking-wide uppercase transition-colors select-none gap-1.5',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {hasPulsingDot && (
        <span className="relative flex h-1.5 w-1.5 shrink-0">
          <span className={cn('absolute inline-flex h-full w-full animate-ping rounded-full opacity-75', getDotColor())} />
          <span className={cn('relative inline-flex h-1.5 w-1.5 rounded-full', getDotColor())} />
        </span>
      )}
      {children}
    </div>
  );
};
export default Badge;
