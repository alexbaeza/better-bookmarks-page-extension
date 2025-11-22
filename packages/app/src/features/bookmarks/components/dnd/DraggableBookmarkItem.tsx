import type React from 'react';
import { useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { DND_ITEM_TYPES } from '@/config/dnd-constants';
import { BookmarkItem } from '@/features/bookmarks/components/BookmarkItem';
import { useBookmarkActions } from '@/features/bookmarks/hooks/useBookmarkActions';
import type { DraggableBookmarkItem as DraggableBookmarkItemType } from '@/features/bookmarks/types/dnd';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { isBookmarkFolder } from '@/shared/utils/bookmark-utils';
import { isValidCrossFolderDrop } from '@/shared/utils/dnd-utils';

export interface DraggableBookmarkItemProps {
  item: IBookmarkItem;
  folderId: string;
  index: number;
  dataTestId?: string;
  onFolderClick?: (item: IBookmarkItem) => void;
}

export const DraggableBookmarkItem: React.FC<DraggableBookmarkItemProps> = ({
  item,
  folderId,
  index,
  dataTestId,
  onFolderClick,
}) => {
  const { move } = useBookmarkActions();
  const isFolder = isBookmarkFolder(item);

  // Make item draggable
  const [{ isDragging }, drag] = useDrag<DraggableBookmarkItemType, unknown, { isDragging: boolean }>({
    type: DND_ITEM_TYPES.BOOKMARK,
    item: {
      id: item.id,
      folderId,
      index,
      item,
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  // Make folders droppable (so we can drag items onto them)
  const handleDrop = useCallback(
    async (draggedItemId: string, _fromFolderId: string, _fromIndex: number) => {
      // Don't drop onto itself
      if (draggedItemId === item.id) return;
      // Move bookmark to this folder
      await move(draggedItemId, { parentId: item.id });
    },
    [item.id, move]
  );

  const [{ isOver }, drop] = useDrop<DraggableBookmarkItemType, unknown, { isOver: boolean }>({
    accept: DND_ITEM_TYPES.BOOKMARK,
    drop: (droppedItem, monitor) => {
      // Only handle drops for cross-folder moves, not reordering within same folder
      // Reordering is handled by dividers
      if (isValidCrossFolderDrop(droppedItem, folderId, item.id, isFolder)) {
        // If a nested child drop target (another folder) already handled this drop, don't process it here
        // This ensures nested folders win over parent containers for cross-folder moves
        // Note: We don't check didDrop() for same-folder drops because dividers handle those
        if (monitor.didDrop()) {
          return;
        }
        void handleDrop(droppedItem.id, droppedItem.folderId, droppedItem.index);
      }
    },
    collect: (monitor) => {
      const draggedItem = monitor.getItem<DraggableBookmarkItemType>();
      // Use shallow isOver to only show visual feedback when this folder is the direct target
      // Only show ring for cross-folder moves, not same-folder reordering
      return {
        isOver:
          monitor.isOver({ shallow: true }) &&
          draggedItem !== null &&
          isValidCrossFolderDrop(draggedItem, folderId, item.id, isFolder),
      };
    },
    canDrop: (droppedItem) => {
      // Only folders can be drop targets
      // Prevent dropping into the same folder (reordering is handled by dividers)
      // Prevent dropping the item onto itself
      return isValidCrossFolderDrop(droppedItem, folderId, item.id, isFolder);
    },
  });

  // Combine drag and drop refs if it's a folder
  const combinedRef = (node: HTMLDivElement | null) => {
    if (isFolder) {
      drag(node);
      drop(node);
    } else {
      drag(node);
    }
  };

  // Build className for visual states
  const classNameParts = ['transition-all duration-200'];
  if (isOver) {
    classNameParts.push('ring-4 ring-fgColor-accent rounded-lg scale-[1.02]');
  }
  if (isDragging) {
    classNameParts.push('opacity-40');
  }

  return (
    <div
      className={classNameParts.join(' ')}
      data-testid={`draggable-${dataTestId || item.id}`}
      ref={combinedRef}
      style={{
        opacity: isDragging ? 0.4 : 1,
        cursor: isDragging ? 'grabbing' : 'grab',
        transition: 'opacity 200ms ease-in-out, transform 200ms ease-in-out',
      }}
    >
      <BookmarkItem dataTestId={dataTestId} item={item} onFolderClick={onFolderClick} />
    </div>
  );
};
