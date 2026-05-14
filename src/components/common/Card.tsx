import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '../../lib/utils';

export function Card({ children, className, onClick, ...props }: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "rounded-xl border border-gray-200 bg-white shadow-sm",
        onClick && "cursor-pointer transition-colors hover:border-cyan-300",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
