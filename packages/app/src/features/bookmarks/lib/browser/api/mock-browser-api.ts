import type { IBookmarkItem } from '@/shared/types/bookmarks';

import type { BrowserBookmarkAPI, NormalizedBookmarkItem, NormalizedBookmarkTree } from '../types';
import { mockDataService } from './mock-data-service';

/**
 * Convert IBookmarkItem to NormalizedBookmarkItem
 */
function normalizeBookmarkItem(item: IBookmarkItem): NormalizedBookmarkItem {
  return {
    children: item.children?.map(normalizeBookmarkItem),
    dateAdded: item.dateAdded,
    dateGroupModified: item.dateGroupModified,
    id: item.id,
    parentId: item.parentId,
    title: item.title,
    url: item.url,
  };
}

/**
 * Convert IBookmarkItem[] to NormalizedBookmarkTree
 * This mimics the exact behavior of Chrome and Firefox APIs
 */
function normalizeBookmarkTree(items: IBookmarkItem[]): NormalizedBookmarkTree {
  const root = items[0]; // Root folder

  // Flatten all bookmarks from default browser folders
  const allBookmarks: NormalizedBookmarkItem[] = [];
  const allFolders: NormalizedBookmarkItem[] = [];

  const processNode = (node: IBookmarkItem) => {
    // Skip the root node and default browser folders
    if (node.id === root.id || node.title === 'Bookmarks Menu' || node.title === 'Bookmarks Toolbar' || node.title === 'Other Bookmarks') {
      // Process children of these folders
      if (node.children) {
        node.children.forEach(processNode);
      }
      return;
    }

    const normalized = normalizeBookmarkItem(node);

    if (node.children) {
      // It's a folder - only add direct children of browser folders to root level
      // Check if this folder is a direct child of a browser folder
      const isDirectChildOfBrowserFolder = node.parentId === '1' || node.parentId === '2' || node.parentId === '3';

      if (isDirectChildOfBrowserFolder) {
        allFolders.push(normalized);
      }

      // Process children to extract nested folders and bookmarks
      node.children.forEach(processNode);
    } else if (node.url) {
      // It's a bookmark - only add loose bookmarks (not nested in folders) to uncategorized
      // Check if this bookmark is directly under a browser folder (loose bookmark)
      const isLooseBookmark = node.parentId === '1' || node.parentId === '2' || node.parentId === '3';

      if (isLooseBookmark) {
        allBookmarks.push(normalized);
      }
      // Don't add nested bookmarks to uncategorized - they should stay in their folders
    }
  };

  // Process the entire tree
  if (root.children) {
    root.children.forEach(processNode);
  }

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

/**
 * Mock browser API that simulates real browser behavior
 * Uses mock data service as the source of truth and triggers re-renders
 */
export class MockBrowserAPI implements BrowserBookmarkAPI {
  /**
   * Get the complete bookmark tree
   */
  async getBookmarksTree(): Promise<NormalizedBookmarkTree> {
    const data = mockDataService.getData();
    return normalizeBookmarkTree(data);
  }

  /**
   * Create a new bookmark
   */
  async createBookmark(parentId: string | null, details: { title: string; url?: string }): Promise<NormalizedBookmarkItem> {
    const bookmark = await mockDataService.createBookmark(parentId, details);
    return normalizeBookmarkItem(bookmark);
  }

  /**
   * Remove a bookmark by ID
   */
  async removeBookmark(id: string): Promise<void> {
    await mockDataService.removeBookmark(id);
  }

  /**
   * Update a bookmark
   */
  async updateBookmark(id: string, changes: { title?: string; url?: string }): Promise<NormalizedBookmarkItem> {
    const bookmark = await mockDataService.updateBookmark(id, changes);
    return normalizeBookmarkItem(bookmark);
  }

  /**
   * Move a bookmark to a different parent with optional index
   */
  async moveBookmark(id: string, destinationParentId: string, index?: number): Promise<void> {
    await mockDataService.moveBookmark(id, destinationParentId, index);
  }

  /**
   * Get bookmark by ID
   */
  async getBookmark(id: string): Promise<NormalizedBookmarkItem | null> {
    const bookmark = await mockDataService.getBookmark(id);
    return bookmark ? normalizeBookmarkItem(bookmark) : null;
  }

  /**
   * Search bookmarks
   */
  async searchBookmarks(query: string): Promise<NormalizedBookmarkItem[]> {
    const results = await mockDataService.searchBookmarks(query);
    return results.map(normalizeBookmarkItem);
  }

  /**
   * Reorder items within a folder
   */
  async reorderItems(folderId: string, fromIndex: number, toIndex: number): Promise<void> {
    await mockDataService.reorderItems(folderId, fromIndex, toIndex);
  }
}
