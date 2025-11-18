import type React from 'react';
import { useDrop } from 'react-dnd';

import { DND_ITEM_TYPES } from '@/config/dnd-constants';
import type { DraggableBookmarkItem } from '@/features/bookmarks/types/dnd';

export interface DroppableFolderProps {
  folderId: string;
  children: React.ReactNode;
  onDrop: (draggedItemId: string, fromFolderId: string, fromIndex: number) => void;
  className?: string;
  dataTestId?: string;
}

export const DroppableFolder: React.FC<DroppableFolderProps> = ({
  folderId,
  children,
  onDrop,
  className = '',
  dataTestId,
}) => {
  const [{ isOver, canDrop }, drop] = useDrop<DraggableBookmarkItem, unknown, { isOver: boolean; canDrop: boolean }>({
    accept: DND_ITEM_TYPES.BOOKMARK,
    drop: (item, monitor) => {
      // Only handle drops for cross-folder moves (reordering within same folder is handled by dividers)
      if (item.folderId !== folderId && item.id !== folderId) {
        // If a nested child drop target (another folder) already handled this drop, don't process it here
        // This ensures nested folders win over parent containers for cross-folder moves
        // Note: We don't check didDrop() for same-folder drops because dividers handle those
        if (monitor.didDrop()) {
          return;
        }
        onDrop(item.id, item.folderId, item.index);
      }
    },
    canDrop: (item) => {
      // Prevent dropping into the same folder and prevent dropping a folder onto itself
      return item.folderId !== folderId && item.id !== folderId;
    },
    collect: (monitor) => ({
      // Use shallow isOver to only show visual feedback when this folder is the direct target
      // This prevents parent containers from showing highlights when hovering nested children
      isOver: monitor.isOver({ shallow: true }),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;

  return (
    <div
      className={`transition-all duration-200 ${className} ${isActive ? 'ring-4 ring-fgColor-accent rounded-lg' : ''}`}
      data-testid={dataTestId}
      // @ts-expect-error - react-dnd's ConnectDropTarget is compatible but TS doesn't recognize it directly
      ref={drop}
      style={{
        transition: 'all 200ms ease-in-out',
      }}
    >
      {children}
    </div>
  );
};
