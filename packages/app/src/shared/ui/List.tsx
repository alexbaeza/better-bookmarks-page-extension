import React from 'react';

export interface ListDividerProps {
  index: number;
  position: 'top' | 'bottom';
  insertIndex: number;
}

export interface ListProps {
  children: React.ReactNode;
  className?: string;
  gap?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  renderDivider?: (props: ListDividerProps) => React.ReactNode;
  'data-testid'?: string;
}

const gapClasses = {
  none: '',
  xs: 'gap-px',
  sm: 'gap-1',
  md: 'gap-2',
  lg: 'gap-4',
  xl: 'gap-6',
};

export const List: React.FC<ListProps> = ({
  children,
  className = '',
  gap = 'md',
  renderDivider,
  'data-testid': dataTestId,
}) => {
  const classes = ['flex flex-col', gapClasses[gap], className].filter(Boolean).join(' ');

  // Wrap children with dividers if renderDivider is provided
  const childrenWithDividers = renderDivider
    ? React.Children.map(children, (child, index) => {
        return (
          <React.Fragment key={child && typeof child === 'object' && 'key' in child ? child.key : index}>
            {/* Divider before first item for edge reordering */}
            {index === 0 && renderDivider({ index: 0, position: 'top', insertIndex: 0 })}
            <div
              className="relative transition-all duration-300 ease-in-out"
              data-item-index={index}
              style={{
                transition: 'transform 300ms ease-in-out, opacity 200ms ease-in-out',
              }}
            >
              {child}
            </div>
            {/* Divider after each item (including last for edge reordering) */}
            {renderDivider({ index, position: 'bottom', insertIndex: index + 1 })}
          </React.Fragment>
        );
      })
    : children;

  return (
    <div className={classes} data-testid={dataTestId}>
      {childrenWithDividers}
    </div>
  );
};
