import { useCallback, useDeferredValue, useEffect, useMemo, useRef } from 'react';

import { useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { useBookmarkSearchTerm } from '@/features/bookmarks/contexts/BookmarkSearchContext';
import { findFolderById } from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

const includesIgnoreCase = (text: string, lowerTerm: string): boolean => {
  if (!lowerTerm) return true;
  return text.toLowerCase().includes(lowerTerm);
};

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

  const normalizedSearchTerm = useMemo(() => searchTerm.trim().toLowerCase(), [searchTerm]);

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
    let containers: IBookmarkItem[];
    if (currentPage === 'All') {
      containers = rawFolders;
    } else if (currentPage === 'Uncategorized') {
      containers = rawUncategorized ? [rawUncategorized] : [];
    } else {
      const folder = findFolderById(rawFolders, currentPage);
      containers = folder ? [folder] : [];
    }

    return containers
      .map((c) => ({
        ...c,
        children: filterChildren(c),
      }))
      .filter((c) => (c.children?.length ?? 0) > 0);
  }, [rawFolders, rawUncategorized, currentPage, filterChildren]);

  const items = useMemo(() => {
    if (currentPage === 'All' || currentPage === 'Uncategorized') {
      return [];
    }
    return pageContainers[0]?.children || [];
  }, [currentPage, pageContainers]);

  const counts = useMemo(() => {
    const all = rawFolders.reduce((sum, f) => sum + filterChildren(f).length, 0);
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
      if (child.children && child.children.length > 0) {
        foldersToProcess.push(child);
      }
    }
  }

  return map;
};
