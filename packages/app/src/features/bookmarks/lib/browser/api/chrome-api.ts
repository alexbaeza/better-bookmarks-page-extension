import type { BrowserBookmarkAPI, NormalizedBookmarkItem, NormalizedBookmarkTree } from '../types';

const DEFAULT_FOLDER_TYPE_IDS = new Set([
  'other', // Other bookmarks
  'bookmarks-bar', // Bookmarks bar
]);

/**
 * Chrome-specific implementation of the browser bookmark API
 * Accepts an optional mock bookmarks API for testing/development
 */
export class ChromeBookmarkAPI implements BrowserBookmarkAPI {
  private chrome: typeof window.chrome;

  constructor(mockBookmarks?: typeof window.chrome.bookmarks) {
    if (mockBookmarks) {
      // Use mock API (for dev/test environments)
      this.chrome = { bookmarks: mockBookmarks } as typeof window.chrome;
    } else {
      // Use real Chrome API
      this.chrome = (window as typeof window & { chrome: typeof window.chrome }).chrome;
      if (!this.chrome?.bookmarks) {
        throw new Error('Chrome bookmarks API not available');
      }
    }
  }

  async getBookmarksTree(): Promise<NormalizedBookmarkTree> {
    const tree = await this.chrome.bookmarks.getTree();
    const root = tree[0];

    // Flatten only direct children of browser default folders
    const allBookmarks: NormalizedBookmarkItem[] = [];
    const allFolders: NormalizedBookmarkItem[] = [];

    // The new bookmarks api changes introduced folderType
    // folderType:  allows extensions to identify the "special" folders such as the bookmarks bar.
    // The name and id shouldn't be used for this purpose (name is locale-dependent, and id is not fixed)
    // See: https://developer.chrome.com/blog/bookmarks-sync-changes#detailed_api_changes
    const isDefaultFolder = (node: chrome.bookmarks.BookmarkTreeNode): boolean =>
      node.folderType !== undefined && DEFAULT_FOLDER_TYPE_IDS.has(node.folderType);

    const processNode = (node: chrome.bookmarks.BookmarkTreeNode, parentIsDefault: boolean) => {
      // Skip the root and default containers themselves; mark their children as under default
      if (node.id === root.id || isDefaultFolder(node)) {
        if (node.children) {
          const underDefault = isDefaultFolder(node);
          for (const child of node.children) {
            processNode(child, underDefault);
          }
        }
        return;
      }

      const normalized = this.normalizeBookmarkItem(node);

      if (node.children) {
        // Only expose folders that are direct children of default containers
        if (parentIsDefault) {
          allFolders.push(normalized);
        }
        if (node.children) {
          for (const child of node.children) {
            processNode(child, false);
          }
        }
      } else if (node.url) {
        // Only expose loose bookmarks directly under default containers as uncategorized
        if (parentIsDefault) {
          allBookmarks.push(normalized);
        }
      }
    };

    // Process the entire tree starting at root
    processNode(root, false);

    return {
      folders: allFolders,
      uncategorized:
        allBookmarks.length > 0
          ? {
              children: allBookmarks,
              id: 'uncategorized',
              title: 'Uncategorized',
            }
          : undefined,
    };
  }

  async createBookmark(
    parentId: string | null,
    details: { title: string; url?: string }
  ): Promise<NormalizedBookmarkItem> {
    const targetParent = parentId && parentId !== '' ? parentId : 'Uncategorized';

    const created = await this.chrome.bookmarks.create({
      parentId: targetParent,
      title: details.title,
      url: details.url,
    });

    // Show notification if added to Uncategorized
    if (targetParent === 'Uncategorized' && this.chrome.notifications) {
      this.chrome.notifications.create({
        iconUrl: 'icons/logo48.png',
        message: 'Your bookmark was added to Uncategorized',
        title: 'Bookmark Added',
        type: 'basic',
      });
    }

    return this.normalizeBookmarkItem(created);
  }

  async removeBookmark(id: string): Promise<void> {
    await this.chrome.bookmarks.removeTree(id);
  }

  async updateBookmark(id: string, changes: { title?: string; url?: string }): Promise<NormalizedBookmarkItem> {
    const updated = await this.chrome.bookmarks.update(id, changes);
    return this.normalizeBookmarkItem(updated);
  }

  async moveBookmark(id: string, destinationParentId: string, index?: number): Promise<void> {
    await this.chrome.bookmarks.move(id, {
      parentId: destinationParentId,
      ...(index !== undefined && { index }),
    });
  }

  async getBookmark(id: string): Promise<NormalizedBookmarkItem | null> {
    try {
      const bookmarks = await this.chrome.bookmarks.get(id);
      return bookmarks.length > 0 ? this.normalizeBookmarkItem(bookmarks[0]) : null;
    } catch {
      return null;
    }
  }

  async searchBookmarks(query: string): Promise<NormalizedBookmarkItem[]> {
    const results = await this.chrome.bookmarks.search({ query });
    return results.map(this.normalizeBookmarkItem);
  }

  /**
   * Reorder items within a folder using moveBookmark
   */
  async reorderItems(folderId: string, fromIndex: number, toIndex: number): Promise<void> {
    // Get the folder to find the item to move
    const folder = await this.chrome.bookmarks.getSubTree(folderId);
    if (!folder[0]?.children || fromIndex >= folder[0].children.length) {
      throw new Error(`Invalid folder or index: ${folderId}, ${fromIndex}`);
    }

    const itemToMove = folder[0].children[fromIndex];
    if (!itemToMove) {
      throw new Error(`Item not found at index ${fromIndex}`);
    }

    // Move the item to the new position
    await this.chrome.bookmarks.move(itemToMove.id, { index: toIndex });
  }

  /**
   * Normalize Chrome bookmark item to our standard format
   */
  private normalizeBookmarkItem = (item: chrome.bookmarks.BookmarkTreeNode): NormalizedBookmarkItem => {
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
