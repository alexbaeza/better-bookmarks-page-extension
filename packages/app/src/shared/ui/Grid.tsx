import React from 'react';

import { GRID_MIN_ITEM_WIDTH } from '@/config/constants';

export interface GridDividerProps {
  index: number;
  position: 'left' | 'right';
  insertIndex: number;
}

export interface GridProps {
  children: React.ReactNode;
  className?: string;
  columns?: number | 'auto' | 'auto-fit' | 'auto-fill';
  containerWidth?: number;
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
  '2xl'?: number;
  minItemWidth?: string;
  renderDivider?: (props: GridDividerProps) => React.ReactNode;
  'data-testid'?: string;
}

const gapClasses = {
  none: '',
  sm: 'gap-1',
  md: 'gap-2',
  lg: 'gap-4',
  xl: 'gap-6',
};

const gapValues = {
  none: 0,
  sm: 4,
  md: 8,
  lg: 16,
  xl: 24,
};

const gridColsMap: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  7: 'grid-cols-7',
  8: 'grid-cols-8',
  9: 'grid-cols-9',
  10: 'grid-cols-10',
  11: 'grid-cols-11',
  12: 'grid-cols-12',
};

function getColumnsClass(breakpoint: string, columns: number | undefined): string {
  if (!columns || !gridColsMap[columns]) return '';
  const baseClass = gridColsMap[columns];
  return breakpoint === '' ? baseClass : `${breakpoint}:${baseClass}`;
}

function calculateOptimalColumns(containerWidth: number, minItemWidth: string, gapValue: number): number {
  const minWidth = Number.parseInt(minItemWidth, 10);
  const availableWidth = containerWidth - gapValue;
  return Math.max(1, Math.floor(availableWidth / (minWidth + gapValue)));
}

function getGridTemplateColumns(
  columns: number | 'auto' | 'auto-fit' | 'auto-fill' | undefined,
  minItemWidth: string
): string | undefined {
  if (!columns) return undefined;

  switch (columns) {
    case 'auto':
      return `repeat(auto-fill, minmax(${minItemWidth}, 1fr))`;
    case 'auto-fit':
      return `repeat(auto-fit, minmax(${minItemWidth}, 1fr))`;
    case 'auto-fill':
      return `repeat(auto-fill, minmax(${minItemWidth}, 1fr))`;
    default:
      if (typeof columns === 'number') {
        return `repeat(${columns}, minmax(${minItemWidth}, 1fr))`;
      }
      return undefined;
  }
}

export const Grid: React.FC<GridProps> = ({
  children,
  className = '',
  columns,
  containerWidth,
  gap = 'md',
  sm,
  md,
  lg,
  xl,
  '2xl': xl2,
  minItemWidth = `${GRID_MIN_ITEM_WIDTH}px`,
  renderDivider,
  'data-testid': dataTestId,
}) => {
  // Calculate optimal columns from container width if provided and columns is not set
  let finalColumns = columns;
  if (containerWidth && !columns) {
    const gapValue = gapValues[gap];
    finalColumns = calculateOptimalColumns(containerWidth, minItemWidth, gapValue);
  }

  // Build responsive classes
  const baseColumnsClass = typeof finalColumns === 'number' ? getColumnsClass('', finalColumns) : '';
  const responsiveClasses = [
    'grid',
    baseColumnsClass,
    getColumnsClass('sm:', sm),
    getColumnsClass('md:', md),
    getColumnsClass('lg:', lg),
    getColumnsClass('xl:', xl),
    getColumnsClass('2xl:', xl2),
    gapClasses[gap],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  // Determine if we need inline styles for columns
  const needsInlineStyle =
    (finalColumns && typeof finalColumns !== 'number') ||
    (finalColumns && typeof finalColumns === 'number' && finalColumns > 12);

  const gridStyle: React.CSSProperties = needsInlineStyle
    ? {
        gridTemplateColumns: getGridTemplateColumns(finalColumns, minItemWidth),
      }
    : {};

  const columnCount = typeof finalColumns === 'number' ? finalColumns : undefined;

  // Wrap children with dividers if renderDivider is provided
  let childrenWithDividers = children;
  if (renderDivider && columnCount) {
    const childrenArray = React.Children.toArray(children);
    childrenWithDividers = childrenArray.map((child, index) => {
      if (!React.isValidElement(child)) return child;

      const isLastInRow = (index + 1) % columnCount === 0;
      const hasHorizontalNeighbor = !isLastInRow && index < childrenArray.length - 1;
      const isFirstInRow = index % columnCount === 0;

      return (
        <div
          className="relative overflow-visible transition-all duration-300 ease-in-out"
          data-item-index={index}
          key={child.key || index}
          style={{
            transition: 'transform 300ms ease-in-out, opacity 200ms ease-in-out',
          }}
        >
          {isFirstInRow && renderDivider({ index, position: 'left', insertIndex: index })}
          {child}
          {(hasHorizontalNeighbor || isLastInRow) &&
            renderDivider({ index, position: 'right', insertIndex: index + 1 })}
        </div>
      );
    });
  }

  return (
    <div className={responsiveClasses} data-testid={dataTestId} style={gridStyle}>
      {childrenWithDividers}
    </div>
  );
};
