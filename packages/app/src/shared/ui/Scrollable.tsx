import type React from 'react';

export interface ScrollableProps {
  children: React.ReactNode;
  className?: string;
  'data-testid'?: string;
}

export const Scrollable: React.FC<ScrollableProps> = ({ children, className = '', 'data-testid': dataTestId }) => {
  return (
    <div className={`min-h-0 flex-1 overflow-y-auto ${className}`} data-testid={dataTestId}>
      {children}
    </div>
  );
};
