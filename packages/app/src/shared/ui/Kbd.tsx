import type React from 'react';

export interface KbdProps {
  children: React.ReactNode;
  className?: string;
  active?: boolean;
}

/**
 * Keyboard key component for displaying keyboard shortcuts
 * @param active - Whether the key is currently pressed (for visual feedback)
 */
export const Kbd: React.FC<KbdProps> = ({ children, className = '', active = false }) => {
  return (
    <kbd
      className={`inline-flex items-center justify-center px-2 py-1.5 text-xs font-semibold rounded-lg border transition-all duration-150 ${
        active
          ? 'bg-fgColor-accent text-fgColor-primary border-fgColor-accent shadow-lg shadow-fgColor-accent/50 scale-105'
          : 'bg-bgColor-secondary text-fgColor-secondary border-bgColor-tertiary'
      } ${className}`}
    >
      {children}
    </kbd>
  );
};
