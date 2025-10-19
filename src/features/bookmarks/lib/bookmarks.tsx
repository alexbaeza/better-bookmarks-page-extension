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
    id: item.id,
    parentId: item.parentId,
    title: item.title,
    url: item.url,
    children: item.children?.map(normalizeToAppFormat),
    dateAdded: item.dateAdded,
    dateGroupModified: item.dateGroupModified,
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

export async function getBookmarksData(): Promise<BookmarksData> {
  const browserAPI = getAPI();
  const tree: NormalizedBookmarkTree = await browserAPI.getBookmarksTree();

  const folders = tree.folders.map(normalizeToAppFormat);
  const uncategorized = tree.uncategorized ? normalizeToAppFormat(tree.uncategorized) : undefined;

  // Initialize ordering for all folders
  orderingService.initializeOrdering(folders);
  if (uncategorized) {
    orderingService.initializeOrdering([uncategorized]);
  }

  // Apply ordering to folders
  const orderedFolders = orderingService.applyOrdering(folders);
  const orderedUncategorized = uncategorized ? orderingService.applyOrdering([uncategorized])[0] : undefined;

  const result = {
    folders: orderedFolders,
    uncategorized: orderedUncategorized,
  };
  return result;
}

export async function create(parentId: string | null, details: { title: string; url?: string }): Promise<IBookmarkItem> {
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
export async function moveItem(itemId: string, fromFolderId: string, toFolderId: string, toIndex: number): Promise<void> {
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
