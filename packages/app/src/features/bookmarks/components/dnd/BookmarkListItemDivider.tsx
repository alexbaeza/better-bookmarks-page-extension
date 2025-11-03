import type React from 'react';
import { useDrop } from 'react-dnd';

import { DND_ITEM_TYPES } from '@/config/dnd-constants';
import type { DraggableBookmarkItem } from '@/features/bookmarks/types/dnd';

export interface BookmarkListItemDividerProps {
  folderId: string;
  insertIndex: number;
  onReorder: (fromIndex: number, toIndex: number) => void;
  className?: string;
  dataTestId?: string;
  minHeight?: string;
}

export const BookmarkListItemDivider: React.FC<BookmarkListItemDividerProps> = ({
  folderId,
  insertIndex,
  onReorder,
  className = '',
  dataTestId,
  minHeight = '1rem',
}) => {
  const [{ isOver, draggingItem }, drop] = useDrop<
    DraggableBookmarkItem,
    unknown,
    { isOver: boolean; draggingItem: DraggableBookmarkItem | null }
  >({
    accept: DND_ITEM_TYPES.BOOKMARK,
    drop: (item) => {
      // Handle reordering within the same folder (both bookmarks and folders)
      if (item.folderId === folderId) {
        // The divider represents inserting at `insertIndex`
        // After removing item at item.index, adjust target index if needed
        let targetIndex = insertIndex;
        if (item.index < insertIndex) {
          // Dragging down: after removing item at item.index, items shift up
          // So the insertIndex needs to be adjusted
          targetIndex = insertIndex - 1;
        }

        // Ensure valid index and different from source
        if (targetIndex >= 0 && targetIndex !== item.index) {
          onReorder(item.index, targetIndex);
        }
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver() && monitor.getItem<DraggableBookmarkItem>()?.folderId === folderId,
      draggingItem: monitor.getItem<DraggableBookmarkItem>() ?? null,
    }),
    canDrop: (item) => {
      // Allow dropping if it's the same folder (for reordering) and not the same position
      // Both bookmarks and folders can be reordered
      return item.folderId === folderId && item.index !== insertIndex && item.index !== insertIndex - 1;
    },
  });

  // Show indicator when dragging over for reordering (both bookmarks and folders)
  const showIndicator = isOver && draggingItem?.folderId === folderId;

  return (
    <div
      className={`relative flex items-center justify-center z-50 w-full ${className}`}
      data-testid={dataTestId}
      ref={drop as unknown as (node: HTMLDivElement | null) => void}
      style={{ minHeight }}
    >
      {showIndicator && (
        <div
          className="absolute inset-x-0 w-full h-1 border-t-4 border-fgColor-accent rounded-full pointer-events-none"
          data-testid="reorder-divider-indicator-list"
        />
      )}
    </div>
  );
};
