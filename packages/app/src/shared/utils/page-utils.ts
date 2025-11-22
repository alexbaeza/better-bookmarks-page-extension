import { BookmarkPage, type PageId } from '@/features/bookmarks/contexts/BookmarkNavigationContext';

/**
 * Page type checking utilities
 */

/**
 * Checks if a page ID is a root page (All or Uncategorized)
 * @example
 * isRootPage('All') // true
 * isRootPage('Uncategorized') // true
 * isRootPage('folder-123') // false
 */
export const isRootPage = (pageId: PageId): boolean => {
  return pageId === BookmarkPage.All || pageId === BookmarkPage.Uncategorized;
};

/**
 * Checks if a page ID is the "All" page
 * @example
 * isAllPage('All') // true
 * isAllPage('Uncategorized') // false
 */
export const isAllPage = (pageId: PageId): boolean => {
  return pageId === BookmarkPage.All;
};

/**
 * Checks if a page ID is the "Uncategorized" page
 * @example
 * isUncategorizedPage('Uncategorized') // true
 * isUncategorizedPage('All') // false
 */
export const isUncategorizedPage = (pageId: PageId): boolean => {
  return pageId === BookmarkPage.Uncategorized;
};

/**
 * Checks if a page ID is a folder (not a root page)
 * @example
 * isFolderPage('folder-123') // true
 * isFolderPage('All') // false
 * isFolderPage('') // false
 */
export const isFolderPage = (pageId: PageId): boolean => {
  return !isRootPage(pageId) && pageId !== '' && pageId != null;
};
