import type { CollisionDetection } from '@dnd-kit/core';
import { pointerWithin } from '@dnd-kit/core';

import { DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX, DROPPABLE_ROOT_FOLDER_PREFIX, DROPPABLE_SIDEBAR_FOLDER_PREFIX } from '@/config/dnd-constants';
import { findItemById, findParentOfItem } from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

export const createConstrainedCollisionDetection = (rawFolders: IBookmarkItem[]): CollisionDetection => {
  return ({ active, collisionRect, droppableRects, droppableContainers, pointerCoordinates }) => {
    const activeItem = active.id ? findItemById(rawFolders, active.id as string) : null;
    const isFolder = activeItem && !activeItem.url;
    const srcParent = active.id ? findParentOfItem(rawFolders, active.id as string) : null;

    // Allow both folder and bookmark operations
    const allowedContainers = droppableContainers.filter((c) => {
      const id = String(c.id);

      if (isFolder) {
        // Folders can be reordered within the layout or moved to sidebar
        const fromFolderId = srcParent?.id || 'root';

        // Check if this droppable container represents the same folder
        let isSameFolder = false;
        if (id.startsWith(DROPPABLE_ROOT_FOLDER_PREFIX)) {
          const destFolderId = id.slice(DROPPABLE_ROOT_FOLDER_PREFIX.length);
          isSameFolder = destFolderId === fromFolderId;
        } else if (id.startsWith(DROPPABLE_SIDEBAR_FOLDER_PREFIX)) {
          const destFolderId = id.slice(DROPPABLE_SIDEBAR_FOLDER_PREFIX.length);
          isSameFolder = destFolderId === fromFolderId;
        } else if (id.startsWith(DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX)) {
          const destFolderId = id.slice(DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX.length);
          isSameFolder = destFolderId === fromFolderId;
        }

        return (
          (id.startsWith(DROPPABLE_ROOT_FOLDER_PREFIX) && !isSameFolder) ||
          (id.startsWith(DROPPABLE_SIDEBAR_FOLDER_PREFIX) && !isSameFolder) ||
          (id.startsWith(DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX) && !isSameFolder) ||
          // Allow reordering within same level
          (srcParent?.children?.map((c) => c.id) ?? []).includes(id)
        );
      }
      // Bookmarks can be dropped in folders or reordered within same folder
      const fromFolderId = srcParent?.id || 'root';
      const ownItems = srcParent?.children?.map((c) => c.id) ?? [];

      // Check if this droppable container represents the same folder
      let isSameFolder = false;
      if (id.startsWith(DROPPABLE_ROOT_FOLDER_PREFIX)) {
        const destFolderId = id.slice(DROPPABLE_ROOT_FOLDER_PREFIX.length);
        isSameFolder = destFolderId === fromFolderId;
      } else if (id.startsWith(DROPPABLE_SIDEBAR_FOLDER_PREFIX)) {
        const destFolderId = id.slice(DROPPABLE_SIDEBAR_FOLDER_PREFIX.length);
        isSameFolder = destFolderId === fromFolderId;
      } else if (id.startsWith(DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX)) {
        const destFolderId = id.slice(DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX.length);
        isSameFolder = destFolderId === fromFolderId;
      }

      return (
        (id.startsWith(DROPPABLE_ROOT_FOLDER_PREFIX) && !isSameFolder) ||
        (id.startsWith(DROPPABLE_SIDEBAR_FOLDER_PREFIX) && !isSameFolder) ||
        (id.startsWith(DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX) && !isSameFolder) ||
        ownItems.includes(id)
      );
    });

    return pointerWithin({
      active,
      collisionRect,
      droppableRects,
      droppableContainers: allowedContainers,
      pointerCoordinates,
    });
  };
};
