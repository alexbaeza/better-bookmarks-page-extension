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
    drop: (item) => {
      if (item.folderId !== folderId && item.id !== folderId) {
        onDrop(item.id, item.folderId, item.index);
      }
    },
    canDrop: (item) => {
      // Prevent dropping into the same folder and prevent dropping a folder onto itself
      return item.folderId !== folderId && item.id !== folderId;
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  });

  const isActive = isOver && canDrop;

  return (
    <div
      className={`transition-all duration-200 ${className} ${isActive ? 'ring-4 ring-fgColor-accent rounded-lg' : ''}`}
      data-testid={dataTestId}
      ref={drop as unknown as React.Ref<HTMLDivElement>}
      style={{
        transition: 'all 200ms ease-in-out',
      }}
    >
      {children}
    </div>
  );
};
