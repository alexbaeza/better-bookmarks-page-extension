import { useDraggable, useDroppable } from '@dnd-kit/core';
import { useCallback, useMemo } from 'react';

import { useDragDrop } from '@/app/providers/dragdrop-provider';
import { DROPPABLE_ROOT_FOLDER_PREFIX } from '@/config/dnd-constants';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { findParentOfItem } from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';

export const useDragDroppable = (id: string, disabled = false) => {
  const { activeId } = useDragDrop();
  const { rawFolders } = useBookmarks();

  // Extract folder ID from droppable ID
  const folderId = id.startsWith(DROPPABLE_ROOT_FOLDER_PREFIX) ? id.slice(DROPPABLE_ROOT_FOLDER_PREFIX.length) : null;

  // Disable droppable if the dragged item is from the same folder
  const isDropDisabled = useMemo(() => {
    if (disabled || !activeId || !folderId) return disabled;
    const srcParent = findParentOfItem(rawFolders, activeId);
    const fromFolderId = srcParent?.id || 'root';
    return folderId === fromFolderId;
  }, [disabled, activeId, folderId, rawFolders]);

  const { setNodeRef: setDropRef, isOver } = useDroppable({ disabled: isDropDisabled, id });
  const { setNodeRef: setDragRef, isDragging } = useDraggable({ disabled, id });

  const setNodeRef = useCallback(
    (node: HTMLElement | null) => {
      setDropRef(node);
      setDragRef(node);
    },
    [setDropRef, setDragRef]
  );

  return { isDragging, isOver: isOver && !isDropDisabled, setNodeRef };
};
