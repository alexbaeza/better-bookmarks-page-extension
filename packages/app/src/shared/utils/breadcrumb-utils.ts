import type { PageId } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { findItemById } from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { isAllPage, isUncategorizedPage } from './page-utils';

export type BreadcrumbItem = { id: string; title: string };

/**
 * Builds breadcrumb path from navigation stack
 * Converts page IDs to breadcrumb items with titles
 */
export const buildBreadcrumbPath = (navigationStack: PageId[], rawFolders: IBookmarkItem[]): BreadcrumbItem[] => {
  const path: BreadcrumbItem[] = [];

  for (const pageId of navigationStack) {
    if (isAllPage(pageId)) {
      path.push({ id: 'All', title: 'All Bookmarks' });
    } else if (isUncategorizedPage(pageId)) {
      path.push({ id: 'Uncategorized', title: 'Uncategorized' });
    } else {
      const folder = findItemById(rawFolders, pageId);
      if (folder) {
        path.push({ id: folder.id, title: folder.title || 'Untitled' });
      }
    }
  }

  return path;
};
