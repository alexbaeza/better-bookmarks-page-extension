import { Search as SearchIcon, X } from 'lucide-react';
import type React from 'react';
import { useCallback } from 'react';

import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

export const SearchBar: React.FC = () => {
  const { currentPage, searchTerm, setSearchTerm, rawFolders } = useBookmarks();

  const findFolderById = useCallback((folders: IBookmarkItem[], id: string): IBookmarkItem | undefined => {
    for (const folder of folders) {
      if (folder.id === id) {
        return folder;
      }
      if (folder.children) {
        const found = findFolderById(folder.children, id);
        if (found) return found;
      }
    }
    return undefined;
  }, []);

  const getPageName = useCallback(() => {
    if (currentPage === 'All' || currentPage === 'Uncategorized') {
      return currentPage;
    }
    const folder = findFolderById(rawFolders, currentPage);
    return folder?.title ?? currentPage;
  }, [currentPage, rawFolders, findFolderById]);

  const placeholder = currentPage === 'All' ? `Search "All" items…` : `Search within "${getPageName()}"`;

  return (
    <div className="mt-8 flex size-full items-center justify-center">
      <div className="relative w-full max-w-xl">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-fgColor-secondary">
          <SearchIcon size={24} />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={placeholder}
          className="
            w-full rounded-xl bg-bgColor-secondary
            px-12 py-5 text-xl text-fgColor-primary transition-shadow
            placeholder:text-fgColor-secondary focus:outline-none
            focus:ring-4 focus:ring-fgColor-accent
          "
        />
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            className="absolute inset-y-0 right-0 flex items-center pr-4 text-fgColor-secondary hover:text-fgColor-primary"
            aria-label="Clear search"
          >
            <X size={24} />
          </button>
        )}
      </div>
    </div>
  );
};
