import React from 'react';
import { cn } from '@/lib/utils';

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { glowing?: boolean; hoverLift?: boolean }
>(({ className, glowing, hoverLift, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-2xl border border-zinc-800 bg-zinc-900/60 text-zinc-100 shadow-xl backdrop-blur-xl relative overflow-hidden transition-all duration-300',
      glowing && 'border-emerald-500/40 shadow-emerald-500/5 glow-emerald',
      hoverLift && 'hover:border-zinc-700/80 hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-emerald-500/2',
      className
    )}
    {...props}
  >
    {/* Optional ambient background glow */}
    {glowing && (
      <div className="absolute -right-20 -top-20 w-40 h-40 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
    )}
  </div>
));
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3 ref={ref} className={cn('text-base font-bold leading-none tracking-tight text-white', className)} {...props} />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p ref={ref} className={cn('text-xs text-zinc-400 mt-1', className)} {...props} />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
));
CardFooter.displayName = 'CardFooter';
export default Card;
