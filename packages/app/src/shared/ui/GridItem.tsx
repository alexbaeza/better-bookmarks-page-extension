import type React from 'react';

export interface GridItemProps {
  children: React.ReactNode;
  className?: string;
  colSpan?: number | 'full';
  rowSpan?: number | 'full';
  sm?: { colSpan?: number | 'full'; rowSpan?: number | 'full' };
  md?: { colSpan?: number | 'full'; rowSpan?: number | 'full' };
  lg?: { colSpan?: number | 'full'; rowSpan?: number | 'full' };
  xl?: { colSpan?: number | 'full'; rowSpan?: number | 'full' };
  '2xl'?: { colSpan?: number | 'full'; rowSpan?: number | 'full' };
  'data-testid'?: string;
}

const spanMap: Record<number, string> = {
  1: '1',
  2: '2',
  3: '3',
  4: '4',
  5: '5',
  6: '6',
  7: '7',
  8: '8',
  9: '9',
  10: '10',
  11: '11',
  12: '12',
};

const getSpanClass = (breakpoint: string, span: number | 'full' | undefined, type: 'col' | 'row'): string => {
  if (!span) return '';
  if (span === 'full') {
    const baseClass = type === 'col' ? 'col-span-full' : 'row-span-full';
    return breakpoint === '' ? baseClass : `${breakpoint}:${baseClass}`;
  }
  // Only use Tailwind classes for known values (1-12)
  if (span <= 12 && spanMap[span]) {
    const baseClass = type === 'col' ? `col-span-${span}` : `row-span-${span}`;
    return breakpoint === '' ? baseClass : `${breakpoint}:${baseClass}`;
  }
  // For values > 12, we'll use inline styles
  return '';
};

export const GridItem: React.FC<GridItemProps> = ({
  children,
  className = '',
  colSpan,
  rowSpan,
  sm,
  md,
  lg,
  xl,
  '2xl': xl2,
  'data-testid': dataTestId,
}) => {
  const classes = [
    getSpanClass('', colSpan, 'col'),
    getSpanClass('', rowSpan, 'row'),
    sm && getSpanClass('sm:', sm.colSpan, 'col'),
    sm && getSpanClass('sm:', sm.rowSpan, 'row'),
    md && getSpanClass('md:', md.colSpan, 'col'),
    md && getSpanClass('md:', md.rowSpan, 'row'),
    lg && getSpanClass('lg:', lg.colSpan, 'col'),
    lg && getSpanClass('lg:', lg.rowSpan, 'row'),
    xl && getSpanClass('xl:', xl.colSpan, 'col'),
    xl && getSpanClass('xl:', xl.rowSpan, 'row'),
    xl2 && getSpanClass('2xl:', xl2.colSpan, 'col'),
    xl2 && getSpanClass('2xl:', xl2.rowSpan, 'row'),
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Use inline styles for values > 12 or when classes aren't available
  const needsInlineStyle =
    (colSpan && typeof colSpan === 'number' && colSpan > 12) ||
    (rowSpan && typeof rowSpan === 'number' && rowSpan > 12);

  const style: React.CSSProperties = needsInlineStyle
    ? {
        gridColumn: colSpan && typeof colSpan === 'number' && colSpan > 12 ? `span ${colSpan}` : undefined,
        gridRow: rowSpan && typeof rowSpan === 'number' && rowSpan > 12 ? `span ${rowSpan}` : undefined,
      }
    : {};

  return (
    <div className={classes || ''} data-testid={dataTestId} style={style}>
      {children}
    </div>
  );
};
