import { useCallback, useEffect, useMemo, useRef } from 'react';

import { useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { useBookmarkSearchTerm } from '@/features/bookmarks/contexts/BookmarkSearchContext';
import { findFolderById } from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

interface BookmarkData {
  rawFolders: IBookmarkItem[];
  rawUncategorized?: IBookmarkItem;
}

export function useBookmarkSearch({ rawFolders, rawUncategorized }: BookmarkData) {
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

  const filterChildren = useCallback(
    (container?: IBookmarkItem) => {
      const children = container?.children || [];
      const term = searchTerm.trim().toLowerCase();
      if (!term) return children;
      if (container?.title.toLowerCase().includes(term)) {
        return children;
      }
      return children.filter((i) => i.title.toLowerCase().includes(term));
    },
    [searchTerm]
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

  return { searchTerm, setSearchTerm, pageContainers, items, counts };
}
