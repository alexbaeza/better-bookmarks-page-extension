import type React from 'react';
import { type ReactNode, createContext, useContext, useState } from 'react';

export type PageId = 'All' | 'Uncategorized' | string;

interface NavigationContextType {
  currentPage: PageId;
  setCurrentPage: (page: PageId) => void;
}

const BookmarkNavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const BookmarkNavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageId>('All');
  return <BookmarkNavigationContext.Provider value={{ currentPage, setCurrentPage }}>{children}</BookmarkNavigationContext.Provider>;
};

export function useBookmarkNavigation() {
  const ctx = useContext(BookmarkNavigationContext);
  if (!ctx) {
    throw new Error('useBookmarkNavigation must be used within BookmarkNavigationProvider');
  }
  return ctx;
}
