import type React from 'react';
import { useDrop } from 'react-dnd';

import { DND_ITEM_TYPES } from '@/config/dnd-constants';
import type { DraggableBookmarkItem } from '@/features/bookmarks/types/dnd';

export interface BookmarkGridItemDividerProps {
  folderId: string;
  insertIndex: number;
  onReorder: (fromIndex: number, toIndex: number) => void;
  className?: string;
  dataTestId?: string;
  position?: 'left' | 'right';
}

export const BookmarkGridItemDivider: React.FC<BookmarkGridItemDividerProps> = ({
  folderId,
  insertIndex,
  onReorder,
  className = '',
  dataTestId,
  position = 'right',
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
          // Dragging right: after removing item at item.index, items shift left
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

  const isLeft = position === 'left';

  return (
    <div
      className={`absolute inset-y-0 flex items-center justify-center z-50 ${className}`}
      data-testid={dataTestId}
      ref={drop as unknown as (node: HTMLDivElement | null) => void}
      style={
        isLeft
          ? {
              right: 'calc(100% + 0.5rem)', // Start at item start + half gap
              top: 0,
              bottom: 0,
              width: '1rem',
              transform: 'translateX(50%)', // Center horizontally
              pointerEvents: 'auto',
            }
          : {
              left: 'calc(100% + 0.5rem)', // Start at item end + half gap
              top: 0,
              bottom: 0,
              width: '1rem',
              transform: 'translateX(-50%)', // Center horizontally
              pointerEvents: 'auto',
            }
      }
    >
      {showIndicator && (
        <div
          className="h-[calc(100%-2rem)] w-1 border-l-4 border-fgColor-accent rounded-full pointer-events-none py-4"
          data-testid="reorder-divider-indicator-grid"
        />
      )}
    </div>
  );
};
