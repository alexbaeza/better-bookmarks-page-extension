import { useDroppable } from '@dnd-kit/core';
import { Folder } from 'lucide-react';
import type React from 'react';
import { useMemo } from 'react';

import { useDragDrop } from '@/app/providers/dragdrop-provider';
import { DROPPABLE_ROOT_FOLDER_PREFIX } from '@/config/dnd-constants';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { useHover } from '@/features/bookmarks/hooks/useHover';
import { findParentOfItem } from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';
import { BookmarkDragHandle } from './BookmarkDragHandle';
import { BookmarkGridItemContent } from './BookmarkGridItemContent';
import { ItemActionsMenu } from './options/ItemActionsMenu';

interface BookmarkFolderGridItemProps {
  title: string;
  folderId: string;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  dataTestId?: string;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}

export const BookmarkFolderGridItem: React.FC<BookmarkFolderGridItemProps> = ({
  title,
  folderId,
  onClick,
  onEdit,
  onDelete,
  dataTestId = 'bookmark-folder-grid-item',
  dragHandleProps,
}) => {
  const { activeId } = useDragDrop();
  const { rawFolders } = useBookmarks();

  // Disable droppable if the dragged item is from the same folder
  const isDisabled = useMemo(() => {
    if (!activeId) return false;
    const srcParent = findParentOfItem(rawFolders, activeId);
    const fromFolderId = srcParent?.id || 'root';
    return folderId === fromFolderId;
  }, [activeId, folderId, rawFolders]);

  const { setNodeRef, isOver } = useDroppable({
    id: `${DROPPABLE_ROOT_FOLDER_PREFIX}${folderId}`,
    disabled: isDisabled,
  });

  const { hovered, onMouseEnter, onMouseLeave } = useHover();

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  const wrapperClassName = [isOver && !isDisabled && 'ring-2 ring-fgColor-accent rounded-lg', isDisabled && 'opacity-50'].filter(Boolean).join(' ');

  return (
    <div className={wrapperClassName || undefined} ref={setNodeRef}>
      <div data-testid={dataTestId} onKeyDown={handleKeyDown} role="group">
        <BookmarkGridItemContent
          actions={<ItemActionsMenu iconSize={12} onDelete={onDelete} onEdit={onEdit} visible={true} />}
          dragHandle={<BookmarkDragHandle className="p-2 min-w-[24px] min-h-[24px] text-xs" hovered={hovered} size={12} variant="grid" />}
          dragHandleProps={dragHandleProps}
          icon={<Folder className="text-fgColor-secondary hover:text-fgColor-primary" data-testid="folder-icon" fill="currentColor" size={28} />}
          onClick={onClick}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {title}
        </BookmarkGridItemContent>
      </div>
    </div>
  );
};
