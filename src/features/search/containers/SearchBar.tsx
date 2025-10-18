import type React from 'react';
import { useCallback } from 'react';

import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { SearchInput } from '@/shared/ui/SearchInput';

export const SearchBar: React.FC = () => {
  const { currentPage, searchTerm, setSearchTerm, rawFolders } = useBookmarks();

  const findFolderById = useCallback((folders: IBookmarkItem[], id: string): IBookmarkItem | undefined => {
    for (const folder of folders) {
      if (folder.id === id) return folder;
      if (folder.children) {
        const found = findFolderById(folder.children, id);
        if (found) return found;
      }
    }
    return undefined;
  }, []);

  const getPageName = useCallback(() => {
    if (currentPage === 'All' || currentPage === 'Uncategorized') return currentPage;
    const folder = findFolderById(rawFolders, currentPage);
    return folder?.title ?? currentPage;
  }, [currentPage, rawFolders, findFolderById]);

  const placeholder = currentPage === 'All' ? `Search "All" items…` : `Search within "${getPageName()}"`;

  return (
    <div className="mt-4 w-full">
      <SearchInput value={searchTerm} onChange={setSearchTerm} placeholder={placeholder} />
    </div>
  );
};
