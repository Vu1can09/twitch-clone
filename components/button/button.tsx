import * as React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'cursor-pointer transition-all duration-150 ease-in-out',
  {
    variants: {
      variant: {
        icon: 'p-2 rounded-full hover:bg-slate-200',
        primary:
          'bg-twitch-purple text-white py-2 px-3 font-semibold text-sm rounded-md',
        secondary:
          'bg-slate-200 text-black py-2 px-3 font-semibold text-sm rounded-md hover:bg-slate-300',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';

export { Button, buttonVariants };