import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { findFolderById } from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';
import { useTranslation } from '@/i18n/hooks';
import { SearchInput } from '@/shared/ui/SearchInput';
import { isAllPage, isRootPage, isUncategorizedPage } from '@/shared/utils/page-utils';

export const SearchBar: React.FC = () => {
  const { t } = useTranslation();
  const { currentPage, searchTerm, setSearchTerm, rawFolders } = useBookmarks();
  const inputRef = useRef<HTMLInputElement>(null);
  const [inputValue, setInputValue] = useState(searchTerm);
  const debounceTimeoutRef = useRef<number | null>(null);

  // Keep local input state in sync when search term is reset externally
  useEffect(() => {
    setInputValue(searchTerm);
  }, [searchTerm]);

  const pageName = isRootPage(currentPage)
    ? isAllPage(currentPage)
      ? t('sidebar.allItems')
      : isUncategorizedPage(currentPage)
        ? t('sidebar.uncategorized')
        : currentPage
    : (findFolderById(rawFolders, currentPage)?.title ?? currentPage);

  const placeholder = t('searchBar.placeholderWithin', { pageName });

  const handleChange = useCallback(
    (value: string) => {
      setInputValue(value);

      if (debounceTimeoutRef.current !== null) {
        window.clearTimeout(debounceTimeoutRef.current);
      }

      debounceTimeoutRef.current = window.setTimeout(() => {
        setSearchTerm(value);
      }, 150);
    },
    [setSearchTerm]
  );

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
    <div className="w-full p-6">
      <SearchInput
        data-testid="search-input"
        onChange={handleChange}
        placeholder={placeholder}
        ref={inputRef}
        showShortcut
        value={inputValue}
      />
    </div>
  );
};
