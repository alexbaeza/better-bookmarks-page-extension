/**
 * Normalized bookmark data structure that works consistently across browsers
 */
export interface NormalizedBookmarkItem {
  id: string;
  parentId?: string;
  title: string;
  url?: string;
  children?: NormalizedBookmarkItem[];
  dateAdded?: number;
  dateGroupModified?: number;
}

/**
 * Normalized bookmark tree structure
 */
export interface NormalizedBookmarkTree {
  folders: NormalizedBookmarkItem[];
  uncategorized?: NormalizedBookmarkItem;
}

/**
 * Interface for browser-specific bookmark API implementations
 */
export interface BrowserBookmarkAPI {
  /**
   * Get the complete bookmark tree
   */
  getBookmarksTree(): Promise<NormalizedBookmarkTree>;

  /**
   * Create a new bookmark
   */
  createBookmark(parentId: string | null, details: { title: string; url?: string }): Promise<NormalizedBookmarkItem>;

  /**
   * Remove a bookmark by ID
   */
  removeBookmark(id: string): Promise<void>;

  /**
   * Update a bookmark
   */
  updateBookmark(id: string, changes: { title?: string; url?: string }): Promise<NormalizedBookmarkItem>;

  /**
   * Move a bookmark to a different parent with optional index
   */
  moveBookmark(id: string, destinationParentId: string, index?: number): Promise<void>;

  /**
   * Get bookmark by ID
   */
  getBookmark(id: string): Promise<NormalizedBookmarkItem | null>;

  /**
   * Search bookmarks
   */
  searchBookmarks(query: string): Promise<NormalizedBookmarkItem[]>;

  /**
   * Reorder items within a folder
   */
  reorderItems(folderId: string, fromIndex: number, toIndex: number): Promise<void>;
}
