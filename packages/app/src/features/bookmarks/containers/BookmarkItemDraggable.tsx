import type React from 'react';
import { BookmarkItemView } from '@/features/bookmarks/containers/BookmarkItemView';

import { useBookmarkDrag } from '@/features/bookmarks/hooks/useBookmarkDrag';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

export interface BookmarkItemDraggableProps {
  item: IBookmarkItem;
  isGhost?: boolean;
}

export const BookmarkItemDraggable: React.FC<BookmarkItemDraggableProps> = ({ item, isGhost = false }) => {
  const { dragProps, dragHandleProps, renderDragOverlay } = useBookmarkDrag({ item, isGhost });

  if (isGhost) {
    return renderDragOverlay();
  }

  return (
    <div {...dragProps}>
      <BookmarkItemView dragHandleProps={dragHandleProps} item={item} />
    </div>
  );
};
