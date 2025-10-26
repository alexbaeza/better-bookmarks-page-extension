import type React from 'react';
import { useCallback } from 'react';

import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { findFolderById } from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';
import { SearchInput } from '@/shared/ui/SearchInput';

export const SearchBar: React.FC = () => {
  const { currentPage, searchTerm, setSearchTerm, rawFolders } = useBookmarks();

  const getPageName = useCallback(() => {
    if (currentPage === 'All' || currentPage === 'Uncategorized') return currentPage;
    const folder = findFolderById(rawFolders, currentPage);
    return folder?.title ?? currentPage;
  }, [currentPage, rawFolders]);

  const placeholder = currentPage === 'All' ? `Search "All" items…` : `Search within "${getPageName()}"`;

  return (
    <div className="mt-4 w-full">
      <SearchInput data-testid="search-input" onChange={setSearchTerm} placeholder={placeholder} value={searchTerm} />
    </div>
  );
};
