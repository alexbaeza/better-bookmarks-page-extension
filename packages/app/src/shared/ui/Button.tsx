import type { ButtonHTMLAttributes } from 'react';
import { memo } from 'react';

export type ButtonVariant = 'primary' | 'secondary';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  dataTestId?: string;
}

export const Button = memo<ButtonProps>(
  ({ variant = 'primary', disabled = false, className = '', dataTestId, children, ...rest }) => {
    const base = `
    px-4 py-2 rounded
    font-medium focus:outline-none focus:ring-2 focus:ring-fgColor-accent
    transition-colors
  `;

    const variants: Record<ButtonVariant, string> = {
      primary: `
      bg-bgColor-accent text-fgColor-primary
      hover:bg-bgColor-accent/90
      disabled:bg-bgColor-secondary/50 disabled:text-fgColor-secondary
    `,
      secondary: `
      bg-bgColor-secondary text-fgColor-secondary
      hover:text-fgColor-primary hover:bg-bgColor-secondary/60
      disabled:text-fgColor-secondary/50 disabled:bg-transparent
    `,
    };

    return (
      <button
        className={`${base} ${variants[variant]} ${className}`}
        data-testid={dataTestId}
        disabled={disabled}
        {...rest}
      >
        {children}
      </button>
    );
  }
);
