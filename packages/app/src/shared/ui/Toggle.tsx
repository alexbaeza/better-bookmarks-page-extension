import type React from 'react';
import type { InputHTMLAttributes } from 'react';

export interface ToggleProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, className = '', ...rest }) => (
  <label className={`relative inline-flex cursor-pointer items-center ${className}`}>
    <input
      checked={checked}
      className="peer sr-only"
      data-testid="toggle-input"
      onChange={(e) => onChange(e.target.checked)}
      type="checkbox"
      {...rest}
    />
    <div
      className={[
        'peer h-6 w-11 rounded-full ',
        'bg-bgColor-secondary peer-checked:bg-bgColor-accent',
        'after:absolute after:left-[2px] after:top-0.5',
        'after:h-5 after:w-5 after:rounded-full',
        "after:bg-fgColor-primary after:transition-all after:content-['']",
        'peer-checked:after:translate-x-full peer-checked:after:border-fgColor-primary',
      ]
        .filter(Boolean)
        .join(' ')}
    />
  </label>
);
