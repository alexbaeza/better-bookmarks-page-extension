import type { IBookmarkItem } from '@/shared/types/bookmarks';
import type { BookmarkTree, BrowserBookmarkAPI } from '../types';
import type { MockBookmarksAPI } from './mock-bookmarks-api';

const BUILT_IN_FOLDER_IDS = new Set([
  'root________', // Root Folder
  'menu________', // Bookmarks Menu
  'toolbar_____', // Bookmarks Toolbar
  'unfiled_____', // Other Bookmarks
  'mobile______', // Mobile Bookmarks
]);

export type FirefoxBookmarks = browser.bookmarks.BookmarkTreeNode;
/**
 * Firefox-specific implementation of the browser bookmark API
 * Accepts an optional mock bookmarks API for testing/development
 */
export class FirefoxBookmarkAPI implements BrowserBookmarkAPI {
  private browser: typeof window.browser;

  constructor(mockBookmarks?: MockBookmarksAPI) {
    if (mockBookmarks) {
      // Use mock API (for dev/test environments)
      this.browser = { bookmarks: mockBookmarks } as unknown as typeof window.browser;
    } else {
      // Use real Firefox API
      this.browser = (window as typeof window & { browser: typeof window.browser }).browser;
      if (!this.browser?.bookmarks) {
        throw new Error('Firefox bookmarks API not available');
      }
    }
  }

  async getBookmarksTree(): Promise<BookmarkTree> {
    const rootTree = await this.browser.bookmarks.getTree();
    const root = rootTree[0];

    const isBuiltInFolder = (node: browser.bookmarks.BookmarkTreeNode): boolean => BUILT_IN_FOLDER_IDS.has(node.id);

    // Get built-in folders (direct children of root)
    const builtInFolders = (root.children ?? []).filter(isBuiltInFolder);

    // Get direct children of built-in folders
    const nodesUnderBuiltIn = builtInFolders.flatMap((folder) => folder.children ?? []);

    // Separate folders and bookmarks
    const allFolders = nodesUnderBuiltIn
      .filter((node) => node.children)
      .map((node) => this.normalizeBookmarkItem(node));

    const allBookmarks = nodesUnderBuiltIn.filter((node) => node.url).map((node) => this.normalizeBookmarkItem(node));

    const tree: BookmarkTree = {
      folders: allFolders,
      uncategorized:
        allBookmarks.length > 0
          ? {
              id: 'uncategorized',
              title: 'Uncategorized',
              children: allBookmarks,
            }
          : undefined,
    };

    return tree;
  }

  async createBookmark(parentId: string | null, details: { title: string; url?: string }): Promise<IBookmarkItem> {
    const targetParent = parentId && parentId !== '' ? parentId : 'Uncategorized';

    const created = await this.browser.bookmarks.create({
      parentId: targetParent,
      title: details.title,
      url: details.url,
    });

    // Show notification if added to Uncategorized
    if (targetParent === 'Uncategorized' && this.browser.notifications) {
      this.browser.notifications.create({
        iconUrl: 'icons/logo48.png',
        message: 'Your bookmark was added to Uncategorized',
        title: 'Bookmark Added',
        type: 'basic',
      });
    }

    return this.normalizeBookmarkItem(created);
  }

  async removeBookmark(id: string): Promise<void> {
    await this.browser.bookmarks.removeTree(id);
  }

  async updateBookmark(id: string, changes: { title?: string; url?: string }): Promise<IBookmarkItem> {
    const updated = await this.browser.bookmarks.update(id, changes);
    return this.normalizeBookmarkItem(updated);
  }

  async moveBookmark(id: string, destinationParentId: string, index?: number): Promise<void> {
    await this.browser.bookmarks.move(id, {
      parentId: destinationParentId,
      ...(index !== undefined && { index }),
    });
  }

  async getBookmark(id: string): Promise<IBookmarkItem | null> {
    try {
      const bookmarks = await this.browser.bookmarks.get(id);
      return bookmarks.length > 0 ? this.normalizeBookmarkItem(bookmarks[0]) : null;
    } catch {
      return null;
    }
  }

  async searchBookmarks(query: string): Promise<IBookmarkItem[]> {
    const results = await this.browser.bookmarks.search({ query });
    return results.map(this.normalizeBookmarkItem);
  }

  /**
   * Reorder items within a folder using moveBookmark
   */
  async reorderItems(folderId: string, fromIndex: number, toIndex: number): Promise<void> {
    // Get the folder to find the item to move
    const folder = await this.browser.bookmarks.getSubTree(folderId);
    if (!folder[0]?.children || fromIndex >= folder[0].children.length) {
      throw new Error(`Invalid folder or index: ${folderId}, ${fromIndex}`);
    }

    const itemToMove = folder[0].children[fromIndex];
    if (!itemToMove) {
      throw new Error(`Item not found at index ${fromIndex}`);
    }

    // Move the item to the new position
    await this.browser.bookmarks.move(itemToMove.id, { index: toIndex });
  }

  /**
   * Normalize Firefox bookmark item to our standard format
   */
  private normalizeBookmarkItem = (item: browser.bookmarks.BookmarkTreeNode): IBookmarkItem => {
    return {
      children: item.children?.map(this.normalizeBookmarkItem),
      dateAdded: item.dateAdded,
      dateGroupModified: item.dateGroupModified,
      id: item.id,
      parentId: item.parentId,
      title: item.title,
      url: item.url,
    };
  };
}
