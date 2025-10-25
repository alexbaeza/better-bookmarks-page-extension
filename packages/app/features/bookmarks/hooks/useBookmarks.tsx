import { useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';

import { useBookmarkActions } from './useBookmarkActions';
import { useBookmarkSearch } from './useBookmarkSearch';
import { useRawBookmarkData } from './useRawBookmarkData';

export function useBookmarks() {
  const data = useRawBookmarkData();
  const { currentPage, setCurrentPage } = useBookmarkNavigation();
  const { searchTerm, setSearchTerm, pageContainers, items, counts } = useBookmarkSearch({
    rawFolders: data.rawFolders,
    rawUncategorized: data.rawUncategorized,
  });
  const actions = useBookmarkActions();

  return {
    rawFolders: data.rawFolders,
    isLoading: data.isLoading,
    error: data.error,
    currentPage,
    setCurrentPage,
    searchTerm,
    setSearchTerm,
    items,
    counts,
    pageContainers,
    ...actions,
  };
}
