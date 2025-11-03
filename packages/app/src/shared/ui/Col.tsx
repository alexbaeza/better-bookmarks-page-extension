import type React from 'react';

export interface ColProps {
  children: React.ReactNode;
  className?: string;
  span?: number | 'auto' | 'full';
  sm?: number | 'auto' | 'full';
  md?: number | 'auto' | 'full';
  lg?: number | 'auto' | 'full';
  xl?: number | 'auto' | 'full';
  '2xl'?: number | 'auto' | 'full';
  order?: number;
  'data-testid'?: string;
}

const getSpanClass = (breakpoint: string, span: number | 'auto' | 'full' | undefined): string => {
  if (!span) return '';
  if (span === 'auto') return breakpoint === '' ? 'flex-1' : `${breakpoint}:flex-1`;
  if (span === 'full') return breakpoint === '' ? 'w-full' : `${breakpoint}:w-full`;
  // Use inline style for percentage widths since Tailwind doesn't support arbitrary values well
  return '';
};

const getSpanStyle = (span: number | 'auto' | 'full' | undefined): React.CSSProperties => {
  if (!span || span === 'auto' || span === 'full') return {};
  return {
    flex: `0 0 ${(span / 12) * 100}%`,
    maxWidth: `${(span / 12) * 100}%`,
  };
};

export const Col: React.FC<ColProps> = ({
  children,
  className = '',
  span,
  sm,
  md,
  lg,
  xl,
  '2xl': xl2,
  order,
  'data-testid': dataTestId,
}) => {
  const spanClasses = [
    getSpanClass('', span),
    getSpanClass('sm:', sm),
    getSpanClass('md:', md),
    getSpanClass('lg:', lg),
    getSpanClass('xl:', xl),
    getSpanClass('2xl:', xl2),
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Determine which span to use for default style (use first defined)
  const defaultSpan = span || sm || md || lg || xl || xl2;

  const style: React.CSSProperties = {
    ...getSpanStyle(defaultSpan),
    ...(order !== undefined ? { order } : {}),
  };

  return (
    <div className={spanClasses || 'flex-1'} data-testid={dataTestId} style={style}>
      {children}
    </div>
  );
};
