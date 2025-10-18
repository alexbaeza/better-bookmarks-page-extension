import type React from 'react';
import { type ReactNode, createContext, useCallback, useContext, useMemo, useState } from 'react';

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  resetSearch: () => void;
}

const BookmarkSearchContext = createContext<SearchContextType | undefined>(undefined);

export const BookmarkSearchProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const resetSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  const value = useMemo(() => ({ searchTerm, setSearchTerm, resetSearch }), [searchTerm, resetSearch]);

  return <BookmarkSearchContext.Provider value={value}>{children}</BookmarkSearchContext.Provider>;
};

export function useBookmarkSearchTerm(): SearchContextType {
  const ctx = useContext(BookmarkSearchContext);
  if (!ctx) {
    throw new Error('useBookmarkSearchTerm must be used within BookmarkSearchProvider');
  }
  return ctx;
}
