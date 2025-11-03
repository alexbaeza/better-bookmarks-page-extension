import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { forwardRef } from 'react';

export type IconButtonSize = 'sm' | 'md' | 'lg';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  size?: IconButtonSize;
  dataTestId?: string;
  positionClassName?: string; // optional positioning classes (e.g., absolute top-3 right-2)
}

const sizeClasses: Record<IconButtonSize, string> = {
  sm: 'p-1 text-xs',
  md: 'p-1.5 text-sm',
  lg: 'p-2 text-base',
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { dataTestId, className, onClick, icon, disabled, size = 'md', positionClassName = '', type = 'button', ...rest },
    ref
  ) => {
    return (
      <button
        className={`${positionClassName} relative z-20 inline-flex items-center justify-center aspect-square rounded-lg bg-bgColor-accent text-fgColor-primary hover:bg-fgColor-hover disabled:opacity-50 ${sizeClasses[size]} ${className || ''}`}
        data-testid={dataTestId}
        disabled={disabled}
        onClick={onClick}
        ref={ref}
        type={type}
        {...rest}
      >
        {icon}
      </button>
    );
  }
);
