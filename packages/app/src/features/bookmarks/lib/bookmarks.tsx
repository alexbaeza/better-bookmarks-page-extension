import type { IBookmarkItem } from '@/shared/types/bookmarks';

import { createBookmarkAPI } from './browser/factory';
import type { BrowserBookmarkAPI, NormalizedBookmarkItem, NormalizedBookmarkTree } from './browser/types';
import { faviconFromUrl } from './favicon';
import { orderingService } from './ordering-service';

// Create browser API instance
const browserAPI: BrowserBookmarkAPI = createBookmarkAPI();

/**
 * Convert normalized bookmark item to our app's bookmark interface
 */
function normalizeToAppFormat(item: NormalizedBookmarkItem): IBookmarkItem {
  return {
    children: item.children?.map(normalizeToAppFormat),
    dateAdded: item.dateAdded,
    dateGroupModified: item.dateGroupModified,
    id: item.id,
    parentId: item.parentId,
    title: item.title,
    url: item.url,
  };
}

export interface BookmarksData {
  folders: IBookmarkItem[];
  uncategorized: IBookmarkItem | undefined;
}

// Browser API singleton
let api: BrowserBookmarkAPI | null = null;

/**
 * Get the browser API instance (singleton pattern)
 */
function getAPI(): BrowserBookmarkAPI {
  if (!api) {
    api = createBookmarkAPI();
  }
  return api;
}

/**
 * Check if we're using mock API (for dev/test environments)
 */
function isUsingMockAPI(): boolean {
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

export async function getBookmarksData(): Promise<BookmarksData> {
  const browserAPI = getAPI();
  // Fetch fresh data from browser API (syncs with browser's bookmark state)
  const tree: NormalizedBookmarkTree = await browserAPI.getBookmarksTree();

  const folders = tree.folders.map(normalizeToAppFormat);
  const uncategorized = tree.uncategorized ? normalizeToAppFormat(tree.uncategorized) : undefined;

  const usingMock = isUsingMockAPI();

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

export async function create(
  parentId: string | null,
  details: { title: string; url?: string }
): Promise<IBookmarkItem> {
  const browserAPI = getAPI();
  const created: NormalizedBookmarkItem = await browserAPI.createBookmark(parentId, details);
  return normalizeToAppFormat(created);
}

export async function remove(id: string): Promise<void> {
  const browserAPI = getAPI();
  await browserAPI.removeBookmark(id);
}

export async function update(id: string, changes: { title?: string; url?: string }): Promise<IBookmarkItem> {
  const browserAPI = getAPI();
  const updated: NormalizedBookmarkItem = await browserAPI.updateBookmark(id, changes);
  return normalizeToAppFormat(updated);
}

export async function move(id: string, dest: { parentId: string; index?: number }): Promise<void> {
  const browserAPI = getAPI();
  await browserAPI.moveBookmark(id, dest.parentId, dest.index);
}

export async function get(id: string): Promise<IBookmarkItem | null> {
  const browserAPI = getAPI();
  const bookmark = await browserAPI.getBookmark(id);
  return bookmark ? normalizeToAppFormat(bookmark) : null;
}

export async function search(query: string): Promise<IBookmarkItem[]> {
  const browserAPI = getAPI();
  const results = await browserAPI.searchBookmarks(query);
  return results.map(normalizeToAppFormat);
}

/**
 * Get favicon URL for a given URL
 */
export function getFaviconUrl(url: string): string {
  return faviconFromUrl(url);
}

/**
 * Move an item within a folder or between folders
 */
export async function moveItem(
  itemId: string,
  fromFolderId: string,
  toFolderId: string,
  toIndex: number
): Promise<void> {
  // Persist overlay order first so UI reflects change immediately
  orderingService.moveItem(itemId, fromFolderId, toFolderId, toIndex);
  // Then perform the actual browser move to trigger sync on next import
  const browserAPI = getAPI();
  await browserAPI.moveBookmark(itemId, toFolderId, toIndex);
}

/**
 * Reorder items within the same folder
 */
export async function reorderItems(folderId: string, fromIndex: number, toIndex: number): Promise<void> {
  // Update the ordering service first for immediate UI feedback
  orderingService.reorderItems(folderId, fromIndex, toIndex);

  // Then update the browser API
  await browserAPI.reorderItems(folderId, fromIndex, toIndex);
}

/**
 * Get ordering for a specific folder
 */
export function getOrder(folderId: string): string[] {
  return orderingService.getOrder(folderId);
}
