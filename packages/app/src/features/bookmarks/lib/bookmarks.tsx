import type { IBookmarkItem } from '@/shared/types/bookmarks';

import { createBookmarkAPI } from './browser/factory';
import type { BookmarkTree, BrowserBookmarkAPI } from './browser/types';
import { faviconFromUrl } from './favicon';
import { orderingService } from './ordering-service';

export interface BookmarksData {
  folders: IBookmarkItem[];
  uncategorized: IBookmarkItem | undefined;
}

/**
 * Bookmarks service class - provides a clean interface for bookmark operations
 * Uses singleton pattern internally for browser API access
 */
export class BookmarksService {
  private api: BrowserBookmarkAPI | null = null;

  /**
   * Get the browser API instance (singleton pattern)
   */
  private getAPI(): BrowserBookmarkAPI {
    if (!this.api) {
      this.api = createBookmarkAPI();
    }
    return this.api;
  }

  /**
   * Check if we're using mock API (for dev/test environments)
   */
  private isUsingMockAPI(): boolean {
    const isTest = import.meta.env.MODE === 'test';

    type MaybeGlobals = typeof globalThis & {
      Cypress?: unknown;
      chrome?: { bookmarks?: unknown };
      browser?: { bookmarks?: unknown };
    };
    const g = globalThis as MaybeGlobals;
    const isCypressTest = Boolean(g.Cypress);
    const hasChromeAPI = Boolean(g.chrome?.bookmarks);
    const hasBrowserAPI = Boolean(g.browser?.bookmarks);

    // Using mock API if in test or if browser APIs are not available
    return isTest || isCypressTest || !(hasChromeAPI || hasBrowserAPI);
  }

  async loadBookmarksTree(): Promise<BookmarksData> {
    const browserAPI = this.getAPI();
    // Fetch fresh data from browser API (syncs with browser's bookmark state)
    const tree: BookmarkTree = await browserAPI.getBookmarksTree();

    const folders = tree.folders;
    const uncategorized = tree.uncategorized ?? undefined;

    const usingMock = this.isUsingMockAPI();

    if (usingMock) {
      // For mock API in dev/test: simple initialization only
      // Mock API manages its own state, so we just initialize ordering for new folders
      // and apply existing ordering
      orderingService.initializeOrdering(folders);
      if (uncategorized) {
        orderingService.initializeOrdering([uncategorized]);
      }

      const orderedFolders = orderingService.applyOrdering(folders);
      const orderedUncategorized = uncategorized ? orderingService.applyOrdering([uncategorized])[0] : undefined;

      return {
        folders: orderedFolders,
        uncategorized: orderedUncategorized,
      };
    }

    // For real Chrome/Firefox APIs: full reconciliation
    // Reconcile ordering with current bookmark structure:
    // - Initialize ordering for new folders
    // - Clean up stale ordering entries for deleted items
    // - Add new items to ordering (maintains existing order, adds new items at end)
    orderingService.initializeOrdering(folders);
    if (uncategorized) {
      orderingService.initializeOrdering([uncategorized]);
    }

    // Apply stored ordering to folders (new items will appear at end)
    const orderedFolders = orderingService.applyOrdering(folders);
    const orderedUncategorized = uncategorized ? orderingService.applyOrdering([uncategorized])[0] : undefined;

    return {
      folders: orderedFolders,
      uncategorized: orderedUncategorized,
    };
  }

  async createBookmark(parentId: string | null, details: { title: string; url?: string }): Promise<IBookmarkItem> {
    const browserAPI = this.getAPI();
    const created = await browserAPI.createBookmark(parentId, details);
    return created;
  }

  async removeBookmark(id: string): Promise<void> {
    const browserAPI = this.getAPI();
    await browserAPI.removeBookmark(id);
  }

  async updateBookmark(id: string, changes: { title?: string; url?: string }): Promise<IBookmarkItem> {
    const browserAPI = this.getAPI();
    const updated = await browserAPI.updateBookmark(id, changes);
    return updated;
  }

  async moveBookmark(id: string, dest: { parentId: string; index?: number }): Promise<void> {
    const browserAPI = this.getAPI();

    const current = await browserAPI.getBookmark(id);
    const fromFolderId = current?.parentId ?? '';
    const toIndex = dest.index ?? Number.MAX_SAFE_INTEGER;

    // Update overlay ordering for cross-folder moves (append when index is not specified)
    orderingService.moveItem(id, fromFolderId, dest.parentId, toIndex);

    await browserAPI.moveBookmark(id, dest.parentId, dest.index);
  }

  async getBookmarkById(id: string): Promise<IBookmarkItem | null> {
    const browserAPI = this.getAPI();
    const bookmark = await browserAPI.getBookmark(id);
    if (!bookmark) {
      return null;
    }

    // Apply ordering to ensure children are in the correct order
    const ordered = orderingService.applyOrdering([bookmark as IBookmarkItem])[0];

    return ordered;
  }

  async searchBookmarks(query: string): Promise<IBookmarkItem[]> {
    const browserAPI = this.getAPI();
    const results = await browserAPI.searchBookmarks(query);
    return results as IBookmarkItem[];
  }

  /**
   * Get favicon URL for a given URL
   */
  getFaviconUrl(url: string): string {
    return faviconFromUrl(url);
  }

  /**
   * Move an item within a folder or between folders
   */
  async moveItem(itemId: string, fromFolderId: string, toFolderId: string, toIndex: number): Promise<void> {
    // Persist overlay order first so UI reflects change immediately
    orderingService.moveItem(itemId, fromFolderId, toFolderId, toIndex);
    // Then perform the actual browser move to trigger sync on next import
    const browserAPI = this.getAPI();
    await browserAPI.moveBookmark(itemId, toFolderId, toIndex);
  }

  /**
   * Reorder items within the same folder
   */
  async reorderItemsById(folderId: string, itemId: string, toIndex: number): Promise<void> {
    const order = orderingService.getOrder(folderId);
    if (order.length === 0) {
      // No existing ordering for this folder; nothing to reorder yet
      return;
    }

    const currentFromIndex = order.indexOf(itemId);
    if (currentFromIndex === -1) {
      // Item is not tracked in ordering for this folder; avoid throwing to keep UX smooth
      console.warn(`reorderItemsById: item ${itemId} not found in ordering for folder ${folderId}`);
      return;
    }

    // Adjust target index when dragging right (removing item shifts indices left)
    const adjustedToIndex = currentFromIndex < toIndex ? toIndex - 1 : toIndex;

    if (currentFromIndex === adjustedToIndex) {
      return;
    }

    orderingService.reorderItems(folderId, currentFromIndex, adjustedToIndex);
  }

  /**
   * Get ordering for a specific folder
   */
  getOrder(folderId: string): string[] {
    return orderingService.getOrder(folderId);
  }
}

/**
 * Singleton instance for use throughout the application
 */
export const bookmarksService = new BookmarksService();

// Export convenience functions that delegate to the singleton instance
// This maintains backward compatibility with existing imports
export const loadBookmarksTree = (): Promise<BookmarksData> => bookmarksService.loadBookmarksTree();
export const createBookmark = (
  parentId: string | null,
  details: { title: string; url?: string }
): Promise<IBookmarkItem> => bookmarksService.createBookmark(parentId, details);
export const removeBookmark = (id: string): Promise<void> => bookmarksService.removeBookmark(id);
export const updateBookmark = (id: string, changes: { title?: string; url?: string }): Promise<IBookmarkItem> =>
  bookmarksService.updateBookmark(id, changes);
export const moveBookmark = (id: string, dest: { parentId: string; index?: number }): Promise<void> =>
  bookmarksService.moveBookmark(id, dest);
export const getBookmarkById = (id: string): Promise<IBookmarkItem | null> => bookmarksService.getBookmarkById(id);
export const searchBookmarks = (query: string): Promise<IBookmarkItem[]> => bookmarksService.searchBookmarks(query);
export const getFaviconUrl = (url: string): string => bookmarksService.getFaviconUrl(url);
export const moveItem = (itemId: string, fromFolderId: string, toFolderId: string, toIndex: number): Promise<void> =>
  bookmarksService.moveItem(itemId, fromFolderId, toFolderId, toIndex);
export const reorderItemsById = (folderId: string, itemId: string, toIndex: number): Promise<void> =>
  bookmarksService.reorderItemsById(folderId, itemId, toIndex);
export const getOrder = (folderId: string): string[] => bookmarksService.getOrder(folderId);
