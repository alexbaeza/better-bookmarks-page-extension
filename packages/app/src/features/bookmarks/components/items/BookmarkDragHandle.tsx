import { GripVertical } from 'lucide-react';
import type React from 'react';

import { useBookmarkDragHandleProps } from '@/features/bookmarks/contexts/BookmarkDragContext';

export interface BookmarkDragHandleProps {
  hovered?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
  size?: number;
  className?: string;
  variant?: 'grid' | 'list';
}

export const BookmarkDragHandle: React.FC<BookmarkDragHandleProps> = ({ hovered = false, dragHandleProps, size = 16, className = '', variant = 'grid' }) => {
  const ctx = useBookmarkDragHandleProps();
  const mergedDragHandleProps = dragHandleProps ?? ctx?.dragHandleProps;

  const handleElement = (
    <div
      {...mergedDragHandleProps}
      aria-label="Drag handle"
      className={`cursor-grab flex items-center justify-center focus:outline-none ${hovered ? 'text-fgColor-primary' : 'text-fgColor-secondary'} ${className}`}
      data-testid="drag-handle-button"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          e.stopPropagation();
        }
      }}
      role="button"
      tabIndex={0}
    >
      <GripVertical size={size} />
    </div>
  );

  // List variant wraps in a styled container
  if (variant === 'list') {
    return <div className="bg-bgColor-secondary-contrast flex h-full w-8 flex-none items-center justify-center rounded-l-lg">{handleElement}</div>;
  }

  return handleElement;
};
