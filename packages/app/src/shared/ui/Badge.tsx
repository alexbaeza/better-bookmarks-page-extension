import type React from 'react';

export interface BadgeProps {
  children: React.ReactNode;
  className?: string;
  dataTestId?: string;
  size?: 'xs' | 'sm' | 'base';
  variant?: 'primary' | 'secondary' | 'accent';
}

const sizeClasses = {
  xs: 'text-xs px-1.5 py-0.5 min-w-[1.25rem]',
  sm: 'text-xs px-2 py-0.5 min-w-[1.5rem]',
  base: 'text-xs px-2.5 py-1 min-w-[2rem]',
};

const variantClasses = {
  primary: 'bg-bgColor-primary/40 text-fgColor-primary',
  secondary: 'bg-bgColor-secondary/60 text-fgColor-primary',
  accent: 'bg-fgColor-primary text-fgColor-accent',
};

export const Badge: React.FC<BadgeProps> = ({
  children,
  className = '',
  dataTestId,
  size = 'sm',
  variant = 'primary',
}) => {
  return (
    <span
      className={`flex items-center justify-center rounded-full font-bold text-center ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      data-testid={dataTestId}
    >
      {children}
    </span>
  );
};
