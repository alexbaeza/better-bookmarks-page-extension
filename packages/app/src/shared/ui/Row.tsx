import type React from 'react';

export interface RowProps {
  children: React.ReactNode;
  className?: string;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  alignItems?: 'start' | 'center' | 'end' | 'stretch' | 'baseline';
  justifyContent?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
  wrap?: boolean;
  'data-testid'?: string;
}

const gapClasses = {
  none: '',
  sm: 'gap-1',
  md: 'gap-2',
  lg: 'gap-4',
  xl: 'gap-6',
};

const alignItemsClasses = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
  baseline: 'items-baseline',
};

const justifyContentClasses = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
};

export const Row: React.FC<RowProps> = ({
  children,
  className = '',
  gap = 'md',
  alignItems = 'start',
  justifyContent = 'start',
  wrap = false,
  'data-testid': dataTestId,
}) => {
  const classes = [
    'flex',
    'flex-row',
    gapClasses[gap],
    alignItemsClasses[alignItems],
    justifyContentClasses[justifyContent],
    wrap && 'flex-wrap',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes} data-testid={dataTestId}>
      {children}
    </div>
  );
};
