import { forwardRef } from 'react';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  icon: ReactNode;
  dataTestId?: string;
  positionClassName?: string; // optional positioning classes (e.g., absolute top-3 right-2)
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ dataTestId, className, onClick, icon, disabled, positionClassName = '', type = 'button', ...rest }, ref) => {
    return (
      <button
        ref={ref}
        data-testid={dataTestId}
        type={type}
        className={`${positionClassName} inline-flex items-center rounded-lg bg-bgColor-secondary p-1.5 text-sm text-fgColor-primary hover:bg-fgColor-hover hover:text-white disabled:opacity-50 ${className || ''}`}
        disabled={disabled}
        onClick={onClick}
        {...rest}
      >
        {icon}
      </button>
    );
  }
);
