import type { IBookmarkItem } from '@/shared/types/bookmarks';

export interface BookmarkTree {
  folders: IBookmarkItem[];
  uncategorized?: IBookmarkItem;
}

/**
 * Interface for browser-specific bookmark API implementations
 */
export interface BrowserBookmarkAPI {
  /**
   * Get the complete bookmark tree
   */
  getBookmarksTree(): Promise<BookmarkTree>;

  /**
   * Create a new bookmark
   */
  createBookmark(parentId: string | null, details: { title: string; url?: string }): Promise<IBookmarkItem>;

  /**
   * Remove a bookmark by ID
   */
  removeBookmark(id: string): Promise<void>;

  /**
   * Update a bookmark
   */
  updateBookmark(id: string, changes: { title?: string; url?: string }): Promise<IBookmarkItem>;

  /**
   * Move a bookmark to a different parent with optional index
   */
  moveBookmark(id: string, destinationParentId: string, index?: number): Promise<void>;

  /**
   * Get bookmark by ID
   */
  getBookmark(id: string): Promise<IBookmarkItem | null>;

  /**
   * Search bookmarks
   */
  searchBookmarks(query: string): Promise<IBookmarkItem[]>;

  /**
   * Reorder items within a folder
   */
  reorderItems(folderId: string, fromIndex: number, toIndex: number): Promise<void>;
}
