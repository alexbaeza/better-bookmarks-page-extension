import { useCallback, useDeferredValue, useEffect, useMemo, useRef } from 'react';

import { useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { useBookmarkSearchTerm } from '@/features/bookmarks/contexts/BookmarkSearchContext';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { hasItems } from '@/shared/utils/array-utils';
import { getPageContainers } from '@/shared/utils/bookmark-search-utils';
import { isRootPage } from '@/shared/utils/page-utils';
import { includesIgnoreCase, normalizeString } from '@/shared/utils/string-utils';

interface BookmarkData {
  rawFolders: IBookmarkItem[];
  rawUncategorized?: IBookmarkItem;
}

export const useBookmarkSearch = ({ rawFolders, rawUncategorized }: BookmarkData) => {
  const { searchTerm, setSearchTerm, resetSearch } = useBookmarkSearchTerm();
  const { currentPage } = useBookmarkNavigation();

  const hasMounted = useRef(false);
  useEffect(() => {
    if (hasMounted.current) {
      resetSearch();
    } else {
      hasMounted.current = true;
    }
  }, [resetSearch]);

  const normalizedSearchTerm = useMemo(() => normalizeString(searchTerm), [searchTerm]);

  const deferredSearchTerm = useDeferredValue(normalizedSearchTerm);

  const filteredChildrenByFolderId = useMemo(
    () => buildFilteredChildrenByFolderId(rawFolders, rawUncategorized, deferredSearchTerm),
    [rawFolders, rawUncategorized, deferredSearchTerm]
  );

  const filterChildren = useCallback(
    (container?: IBookmarkItem) => {
      if (!container) return [];
      const cached = filteredChildrenByFolderId.get(container.id);
      if (cached) return cached;
      return container.children ?? [];
    },
    [filteredChildrenByFolderId]
  );

  const pageContainers = useMemo(() => {
    const containers = getPageContainers(currentPage, rawFolders, rawUncategorized);
    return containers
      .map((container) => ({
        ...container,
        children: filterChildren(container),
      }))
      .filter((container) => hasItems(container.children));
  }, [rawFolders, rawUncategorized, currentPage, filterChildren]);

  const items = useMemo(() => {
    if (isRootPage(currentPage)) {
      return [];
    }
    return pageContainers[0]?.children || [];
  }, [currentPage, pageContainers]);

  const counts = useMemo(() => {
    const all = rawFolders.reduce((sum, folder) => sum + filterChildren(folder).length, 0);
    const unc = rawUncategorized ? filterChildren(rawUncategorized).length : 0;
    return { all, uncategorized: unc };
  }, [rawFolders, rawUncategorized, filterChildren]);

  return { counts, items, pageContainers, searchTerm, setSearchTerm };
};

const buildFilteredChildrenByFolderId = (
  rawFolders: IBookmarkItem[],
  rawUncategorized: IBookmarkItem | undefined,
  term: string
): Map<string, IBookmarkItem[]> => {
  const map = new Map<string, IBookmarkItem[]>();
  const foldersToProcess: IBookmarkItem[] = [...rawFolders];

  if (rawUncategorized) {
    foldersToProcess.push(rawUncategorized);
  }

  const lowerTerm = term;

  while (foldersToProcess.length > 0) {
    const folder = foldersToProcess.pop();
    if (!folder) continue;

    const children = folder.children ?? [];
    const shouldIncludeAllChildren = !lowerTerm || includesIgnoreCase(folder.title, lowerTerm);

    const filteredChildren = shouldIncludeAllChildren
      ? children
      : children.filter((child) => includesIgnoreCase(child.title, lowerTerm));

    map.set(folder.id, filteredChildren);

    for (const child of children) {
      if (hasItems(child.children)) {
        foldersToProcess.push(child);
      }
    }
  }

  return map;
};
