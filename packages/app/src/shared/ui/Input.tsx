import type React from 'react';
import type { InputHTMLAttributes } from 'react';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  disabled?: boolean;
  dataTestId?: string;
}

export const Input: React.FC<InputProps> = ({ disabled = false, className = '', dataTestId, ...rest }) => {
  const base = `
    w-full rounded-lg px-3 py-2
    text-fgColor-primary placeholder:text-fgColor-secondary
    focus:outline-none focus:ring-2 focus:ring-fgColor-accent
  `;

  const enabledStyles = `
    bg-bgColor-tertiary border border-fgColor-muted
    cursor-text
  `;
  const disabledStyles = `
    bg-bgColor-muted border border-fgColor-muted
    cursor-not-allowed opacity-50
  `;

  return <input {...rest} className={`${base} ${disabled ? disabledStyles : enabledStyles} ${className}`} data-testid={dataTestId} disabled={disabled} />;
};
