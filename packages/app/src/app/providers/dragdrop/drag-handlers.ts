import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';

import { DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX, DROPPABLE_ROOT_FOLDER_PREFIX, DROPPABLE_SIDEBAR_FOLDER_PREFIX } from '@/config/dnd-constants';
import { moveItem, reorderItems } from '@/features/bookmarks/lib/bookmarks';
import { findItemById, findParentOfItem } from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

export const createDragHandlers = (rawFolders: IBookmarkItem[], refreshBookmarks: () => Promise<void>, setActiveId: (id: string | null) => void) => {
  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (!active || !over) {
      return;
    }

    const fromId = active.id as string;
    const overId = String(over.id);
    const srcParent = findParentOfItem(rawFolders, fromId);
    const activeItem = findItemById(rawFolders, fromId);

    // Determine if we're dragging a folder or a bookmark
    const isFolder = activeItem && !activeItem.url;

    if (isFolder) {
      // Handle folder operations

      // Handle folder drops on droppable containers
      let destFolderId: string | null = null;
      if (overId.startsWith(DROPPABLE_SIDEBAR_FOLDER_PREFIX)) {
        destFolderId = overId.slice(DROPPABLE_SIDEBAR_FOLDER_PREFIX.length);
      } else if (overId.startsWith(DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX)) {
        destFolderId = overId.slice(DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX.length);
      } else if (overId.startsWith(DROPPABLE_ROOT_FOLDER_PREFIX)) {
        destFolderId = overId.slice(DROPPABLE_ROOT_FOLDER_PREFIX.length);
      }

      if (destFolderId) {
        // If destination is different from source, move the folder
        const fromFolderId = srcParent?.id || 'root';
        if (destFolderId !== fromFolderId) {
          await moveItem(fromId, fromFolderId, destFolderId, 0);
          await refreshBookmarks();
          return;
        }
        // Same-folder container drop: prevent this operation
        return;
      }

      // Handle reordering folders within same level
      if (srcParent?.children) {
        const fromIndex = srcParent.children.findIndex((c) => c.id === fromId);
        let toIndex = srcParent.children.findIndex((c) => c.id === overId);

        // If overId is a droppable container (same folder), default to last position
        if (toIndex === -1 && destFolderId === srcParent.id) {
          toIndex = srcParent.children.length - 1;
        }

        if (fromIndex >= 0 && toIndex >= 0) {
          // Only reorder if the position actually changes
          if (fromIndex !== toIndex) {
            await reorderItems(srcParent.id, fromIndex, toIndex);
            await refreshBookmarks();
          }
        }
      }
    } else {
      // Handle bookmark operations
      let destFolderId: string | null = null;
      if (overId.startsWith(DROPPABLE_SIDEBAR_FOLDER_PREFIX)) {
        destFolderId = overId.slice(DROPPABLE_SIDEBAR_FOLDER_PREFIX.length);
      } else if (overId.startsWith(DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX)) {
        destFolderId = overId.slice(DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX.length);
      } else if (overId.startsWith(DROPPABLE_ROOT_FOLDER_PREFIX)) {
        destFolderId = overId.slice(DROPPABLE_ROOT_FOLDER_PREFIX.length);
      }

      if (destFolderId) {
        // If destination is different from source, move the bookmark
        const fromFolderId = srcParent?.id || 'root';
        if (destFolderId !== fromFolderId) {
          await moveItem(fromId, fromFolderId, destFolderId, 0);
          await refreshBookmarks();
          return;
        }
        // Same-folder container drop: prevent this operation
        return;
      }

      // Handle reordering within same folder (bookmarks only)
      if (srcParent?.children) {
        const fromIndex = srcParent.children.findIndex((c) => c.id === fromId);
        let toIndex = srcParent.children.findIndex((c) => c.id === overId);

        // If overId is a droppable container (same folder), default to last position
        if (toIndex === -1 && destFolderId === srcParent.id) {
          toIndex = srcParent.children.length - 1;
        }

        if (fromIndex >= 0 && toIndex >= 0) {
          // Only reorder if the position actually changes
          if (fromIndex !== toIndex) {
            await reorderItems(srcParent.id, fromIndex, toIndex);
            await refreshBookmarks();
          }
        }
      }
    }
  };

  return { handleDragEnd, handleDragStart };
};
