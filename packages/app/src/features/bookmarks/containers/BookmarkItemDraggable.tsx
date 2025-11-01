import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type React from 'react';
import { BookmarkItemView } from '@/features/bookmarks/containers/BookmarkItemView';

import type { IBookmarkItem } from '@/shared/types/bookmarks';

export interface BookmarkItemDraggableProps {
  item: IBookmarkItem;
  isDragging?: boolean;
}

export const BookmarkItemDraggable: React.FC<BookmarkItemDraggableProps> = ({ item, isDragging = false }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: item.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  // Only apply drag listeners to the handle, not the entire container
  // This allows clicking on the item itself
  const dragHandleProps = {
    ...attributes,
    ...listeners,
  };

  const isFolder = Boolean(item.children);
  const testId = isFolder ? `bookmark-folder-item-${item.id}` : `bookmark-item-${item.id}`;

  return (
    <div className="focus:outline-none" data-testid={testId} ref={setNodeRef} style={style}>
      <BookmarkItemView dataTestId={testId} dragHandleProps={dragHandleProps} item={item} />
    </div>
  );
};
