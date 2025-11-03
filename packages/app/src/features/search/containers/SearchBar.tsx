import type React from 'react';
import { useCallback, useEffect, useRef } from 'react';

import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { findFolderById } from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';
import { SearchInput } from '@/shared/ui/SearchInput';

export const SearchBar: React.FC = () => {
  const { currentPage, searchTerm, setSearchTerm, rawFolders } = useBookmarks();
  const inputRef = useRef<HTMLInputElement>(null);

  const getPageName = useCallback(() => {
    if (currentPage === 'All' || currentPage === 'Uncategorized') return currentPage;
    const folder = findFolderById(rawFolders, currentPage);
    return folder?.title ?? currentPage;
  }, [currentPage, rawFolders]);

  const placeholder = currentPage === 'All' ? `Search "All" items…` : `Search within "${getPageName()}"`;

  // Handle keyboard shortcut to focus search bar
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Check if user is typing in an input, textarea, or contenteditable element
      const isTypingTarget =
        event.target instanceof HTMLElement &&
        (event.target.tagName === 'INPUT' ||
          event.target.tagName === 'TEXTAREA' ||
          event.target.isContentEditable ||
          event.target.tagName === 'SELECT');

      // Don't trigger if user is already typing
      if (isTypingTarget) return;

      // Check for Cmd+Shift+K (Mac) or Ctrl+Shift+K (Windows/Linux)
      const isK = event.key.toLowerCase() === 'k';
      const isShift = event.shiftKey;
      const isMetaOrCtrl = event.metaKey || event.ctrlKey;

      if (isK && isShift && isMetaOrCtrl) {
        event.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="mt-4 w-full">
      <SearchInput
        data-testid="search-input"
        onChange={setSearchTerm}
        placeholder={placeholder}
        ref={inputRef}
        showShortcut
        value={searchTerm}
      />
    </div>
  );
};
