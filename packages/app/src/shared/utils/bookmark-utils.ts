import type { IBookmarkItem } from '@/shared/types/bookmarks';

/**
 * Bookmark-specific utility functions
 */

/**
 * Checks if a bookmark item is a folder (has children array)
 * @example
 * isBookmarkFolder({ id: '1', title: 'Folder', children: [] }) // true
 * isBookmarkFolder({ id: '2', title: 'Bookmark', url: 'https://...' }) // false
 */
export const isBookmarkFolder = (item: IBookmarkItem): boolean => {
  return Array.isArray(item.children);
};

/**
 * Checks if a bookmark item is a bookmark (has URL)
 * @example
 * isBookmark({ id: '1', title: 'Bookmark', url: 'https://...' }) // true
 * isBookmark({ id: '2', title: 'Folder', children: [] }) // false
 */
export const isBookmark = (item: IBookmarkItem): boolean => {
  return item.url !== undefined && item.url !== null;
};
