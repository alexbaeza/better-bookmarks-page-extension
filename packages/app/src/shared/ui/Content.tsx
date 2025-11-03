import type React from 'react';

export interface ContentProps {
  children: React.ReactNode;
  className?: string;
  padding?: boolean;
  'data-testid'?: string;
}

export const Content: React.FC<ContentProps> = ({
  children,
  className = '',
  padding = true,
  'data-testid': dataTestId,
}) => {
  return (
    <div className={`${padding ? 'p-2' : ''} ${className}`} data-testid={dataTestId}>
      {children}
    </div>
  );
};
