import type { ReactNode } from 'react';
import { createContext, use, useCallback, useMemo, useState } from 'react';

interface SearchContextType {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  resetSearch: () => void;
}

const BookmarkSearchContext = createContext<SearchContextType | undefined>(undefined);

export const BookmarkSearchProvider = ({ children }: { children: ReactNode }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const resetSearch = useCallback(() => {
    setSearchTerm('');
  }, []);

  const value = useMemo(() => ({ resetSearch, searchTerm, setSearchTerm }), [searchTerm, resetSearch]);

  return <BookmarkSearchContext.Provider value={value}>{children}</BookmarkSearchContext.Provider>;
};

export const useBookmarkSearchTerm = (): SearchContextType => {
  // use() throws if context is undefined, so this is safe
  return use(BookmarkSearchContext) as SearchContextType;
};
