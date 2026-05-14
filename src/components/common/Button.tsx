import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    const baseClass = "inline-flex items-center justify-center rounded font-bold transition-colors shadow-sm disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      primary: "bg-cyan-600 text-white hover:bg-cyan-700",
      secondary: "bg-[#111827] text-white hover:bg-gray-900",
      outline: "border border-cyan-600 text-cyan-600 bg-transparent hover:bg-cyan-50",
      ghost: "bg-transparent text-gray-900 hover:bg-gray-100 shadow-none",
      danger: "bg-red-50 text-red-700 hover:bg-red-100 shadow-none"
    };

    const sizes = {
      sm: "h-7 px-3 text-[12.5px]",
      md: "h-8 px-3.5 py-1 text-[13.8px]",
      lg: "h-[38px] px-4 text-[16.2px]"
    };

    return (
      <button
        ref={ref}
        className={cn(baseClass, variants[variant], sizes[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";
