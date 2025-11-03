import type { IBookmarkItem } from '@/shared/types/bookmarks';

/**
 * Type for items being dragged in the DnD system
 */
export interface DraggableBookmarkItem {
  id: string;
  folderId: string;
  index: number;
  item: IBookmarkItem;
}
