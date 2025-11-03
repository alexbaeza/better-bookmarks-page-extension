import type React from 'react';

export interface StackProps {
  children: React.ReactNode;
  className?: string;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  'data-testid'?: string;
}

const gapClasses = {
  none: '',
  xs: 'space-y-1',
  sm: 'space-y-2',
  md: 'space-y-3',
  lg: 'space-y-4',
  xl: 'space-y-6',
};

export const Stack: React.FC<StackProps> = ({ children, className = '', gap = 'md', 'data-testid': dataTestId }) => {
  const classes = ['flex flex-col', gapClasses[gap], className].filter(Boolean).join(' ');

  return (
    <div className={classes} data-testid={dataTestId}>
      {children}
    </div>
  );
};
