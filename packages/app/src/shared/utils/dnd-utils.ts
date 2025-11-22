import type { DraggableBookmarkItem } from '@/features/bookmarks/types/dnd';

/**
 * Drag and drop utility functions
 */

/**
 * Checks if a drop is valid for cross-folder moves
 * Prevents dropping into the same folder or onto itself
 */
export const isValidCrossFolderDrop = (
  droppedItem: DraggableBookmarkItem,
  targetFolderId: string,
  targetItemId: string,
  isFolder: boolean
): boolean => {
  return (
    isFolder &&
    droppedItem.folderId !== targetFolderId &&
    droppedItem.id !== targetItemId &&
    droppedItem.folderId !== targetItemId
  );
};

/**
 * Checks if a drop is valid for same-folder reordering
 */
export const isValidSameFolderDrop = (droppedItem: DraggableBookmarkItem, targetFolderId: string): boolean => {
  return droppedItem.folderId === targetFolderId;
};
