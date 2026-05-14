import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  children?: ReactNode;
  key?: string | number;
  variant?: 'default' | 'outline' | 'success' | 'warning' | 'neutral' | 'blue';
  className?: string;
  icon?: ReactNode;
  onClick?: (e: any) => void;
}

export function Badge({ children, variant = 'default', className, icon, ...props }: BadgeProps) {
  const baseClasses = "inline-flex items-center gap-1.5 rounded tracking-wide px-2 py-0.5 text-[12.5px] font-bold transition-colors";
  const variants = {
    default: "bg-gray-100 text-[#111827]",
    outline: "border border-gray-200 text-black bg-white",
    success: "bg-indigo-50 text-indigo-700",
    warning: "bg-gray-800 text-white",
    neutral: "bg-gray-100 text-black",
    blue: "bg-indigo-50 text-indigo-700",
  };

  return (
    <span className={cn(baseClasses, variants[variant], className)} {...props}>
      {icon && <span className="h-3 w-3">{icon}</span>}
      {children}
    </span>
  );
}
