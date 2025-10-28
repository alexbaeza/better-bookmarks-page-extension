import type React from 'react';

export interface TextProps extends React.HTMLAttributes<HTMLElement> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
  color?: 'primary' | 'secondary' | 'tertiary' | 'hover' | 'danger' | 'accent';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  align?: 'left' | 'center' | 'right' | 'justify';
  lineClamp?: 1 | 2 | 3;
  truncate?: boolean;
  className?: string;
  children: React.ReactNode;
}

const sizeClasses = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
};

const colorClasses = {
  primary: 'text-fgColor-primary',
  secondary: 'text-fgColor-secondary',
  tertiary: 'text-fgColor-tertiary',
  hover: 'text-fgColor-hover',
  danger: 'text-fgColor-danger',
  accent: 'text-fgColor-accent',
};

const weightClasses = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
};

const alignClasses = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
};

export const Text: React.FC<TextProps> = ({
  as = 'p',
  size = 'base',
  color = 'primary',
  weight = 'normal',
  align,
  lineClamp,
  truncate = false,
  className = '',
  children,
  ...props
}) => {
  const Component = as;

  const classes = [
    sizeClasses[size],
    colorClasses[color],
    weightClasses[weight],
    align && alignClasses[align],
    truncate && 'truncate',
    lineClamp && `line-clamp-${lineClamp}`,
    'break-words',
    'hyphens-auto',
    'whitespace-normal',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Component className={classes} {...props}>
      {children}
    </Component>
  );
};
