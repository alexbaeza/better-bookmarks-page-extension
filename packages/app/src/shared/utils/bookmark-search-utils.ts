import type { PageId } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { findFolderById } from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { isAllPage, isUncategorizedPage } from './page-utils';

/**
 * Gets containers for the current page based on page type
 * Returns appropriate folders/bookmarks based on whether it's All, Uncategorized, or a specific folder
 */
export const getPageContainers = (
  currentPage: PageId,
  rawFolders: IBookmarkItem[],
  rawUncategorized?: IBookmarkItem
): IBookmarkItem[] => {
  if (isAllPage(currentPage)) {
    return rawFolders;
  }
  if (isUncategorizedPage(currentPage)) {
    return rawUncategorized ? [rawUncategorized] : [];
  }
  const folder = findFolderById(rawFolders, currentPage);
  return folder ? [folder] : [];
};
