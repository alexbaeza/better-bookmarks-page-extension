import type React from 'react';

import { BookmarkDragProvider } from '@/features/bookmarks/contexts/BookmarkDragContext';
import { Text } from '@/shared/ui/Text';

export interface BookmarkGridItemContentProps {
  dataTestId?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  onKeyActivate?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  dragHandle?: React.ReactNode;
  actions?: React.ReactNode;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}

export const BookmarkGridItemContent: React.FC<BookmarkGridItemContentProps> = ({
  dataTestId,
  icon,
  children,
  href,
  onClick,
  onKeyActivate,
  onMouseEnter,
  onMouseLeave,
  dragHandle,
  actions,
  dragHandleProps,
}) => {
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onKeyActivate ? onKeyActivate() : onClick?.();
    }
  };

  const handleTileClick = () => {
    if (href) {
      window.open(href, '_blank', 'noopener,noreferrer');
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <BookmarkDragProvider dragHandleProps={dragHandleProps}>
      <div
        className="
          relative flex w-24 flex-col items-center gap-1
          rounded-lg bg-bgColor-secondary p-2 transition
          hover:bg-bgColor-tertiary
        "
        data-testid={dataTestId}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        role="group"
      >
        <div className="flex w-full flex-end justify-between">
          {dragHandle}
          {actions}
        </div>

        <div
          className="z-0 -mt-4 flex flex-col items-center cursor-pointer flex-1 w-full"
          data-testid="grid-item-main-button"
          onClick={handleTileClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
        >
          <div className="bg-bgColor-tertiary-contrast flex size-14 items-center justify-center rounded-lg" data-testid="favicon">
            {icon}
          </div>
          <Text align="center" as="p" className="h-8 w-full max-w-full overflow-hidden" color="primary" lineClamp={2} size="xs">
            {children}
          </Text>
        </div>
      </div>
    </BookmarkDragProvider>
  );
};
