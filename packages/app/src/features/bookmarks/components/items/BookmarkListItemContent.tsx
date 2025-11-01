import { useDroppable } from '@dnd-kit/core';
import type React from 'react';

import { DROPPABLE_ROOT_FOLDER_PREFIX } from '@/config/dnd-constants';
import { BookmarkDragProvider } from '@/features/bookmarks/contexts/BookmarkDragContext';
import { Text } from '@/shared/ui/Text';

export interface BookmarkListItemContentProps {
  dataTestId?: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  hovered?: boolean;
  dragHandle?: React.ReactNode;
  // actions should be the menu element; we'll position it here
  actions?: React.ReactNode;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
  folderId?: string;
}

export const BookmarkListItemContent: React.FC<BookmarkListItemContentProps> = ({
  dataTestId,
  icon,
  children,
  href,
  onClick,
  onMouseEnter,
  onMouseLeave,
  hovered,
  dragHandle,
  actions,
  dragHandleProps,
  folderId,
}) => {
  const ContentWrapper: React.ElementType = href ? 'a' : 'button';

  // Only use droppable for folders
  const { setNodeRef, isOver } = useDroppable({
    id: folderId ? `${DROPPABLE_ROOT_FOLDER_PREFIX}${folderId}` : '',
    disabled: !folderId,
  });

  return (
    <BookmarkDragProvider dragHandleProps={dragHandleProps}>
      <div
        className={`
          relative flex h-12 w-full
          overflow-visible rounded-lg
          bg-bgColor-tertiary transition
          hover:bg-fgColor-hover
          ${isOver ? 'ring-2 ring-fgColor-accent' : ''}
        `}
        data-testid={dataTestId}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        ref={setNodeRef}
        role="group"
      >
        {dragHandle}

        <ContentWrapper
          className="flex h-full flex-1 items-center focus:outline-none"
          data-testid={href ? 'list-item-link' : 'list-item-button'}
          href={href}
          onClick={onClick}
        >
          <div className="flex h-full w-12 flex-none items-center justify-center">
            <div className={hovered ? 'text-fgColor-primary' : 'text-fgColor-secondary'}>{icon}</div>
          </div>
          <div className="overflow-hidden px-2 min-w-0 flex-1 text-left py-1 flex flex-col justify-center">
            <Text align="left" color={hovered ? 'primary' : 'secondary'} lineClamp={2} size="xs">
              {children}
            </Text>
          </div>
        </ContentWrapper>

        {/* Inline overlay placement to avoid extra wrapper component */}
        <div
          aria-label="Item actions"
          className="
            absolute inset-y-0 right-0 z-20
            flex h-full items-center space-x-1
            rounded-r-lg p-1
          "
          role="toolbar"
        >
          {actions}
        </div>
      </div>
    </BookmarkDragProvider>
  );
};
