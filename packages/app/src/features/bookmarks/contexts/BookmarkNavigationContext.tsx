import type React from 'react';
import { createContext, type ReactNode, useContext, useState } from 'react';

export enum BookmarkPage {
  All = 'All',
  Uncategorized = 'Uncategorized',
}

export type PageId = BookmarkPage | string;

interface NavigationContextType {
  currentPage: PageId;
  navigationStack: PageId[];
  setCurrentPage: (page: PageId) => void;
  navigateToFolder: (folderId: string) => void;
  navigateBack: () => void;
  navigateToPage: (pageId: PageId) => void;
  canGoBack: boolean;
}

const BookmarkNavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const BookmarkNavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState<PageId>(BookmarkPage.All);
  const [navigationStack, setNavigationStack] = useState<PageId[]>(['All']);

  const navigateToFolder = (folderId: string) => {
    setNavigationStack((prev) => [...prev, folderId]);
    setCurrentPage(folderId);
  };

  const navigateBack = () => {
    if (navigationStack.length > 1) {
      const newStack = navigationStack.slice(0, -1);
      setNavigationStack(newStack);
      setCurrentPage(newStack[newStack.length - 1]);
    }
  };

  const navigateToPage = (pageId: PageId) => {
    // If navigating to a root page, reset stack
    if (pageId === BookmarkPage.All || pageId === BookmarkPage.Uncategorized) {
      setNavigationStack([pageId]);
    } else {
      // For folder navigation, find the index in current stack or add it
      const existingIndex = navigationStack.indexOf(pageId);
      if (existingIndex >= 0) {
        // Navigate to existing position in stack
        const newStack = navigationStack.slice(0, existingIndex + 1);
        setNavigationStack(newStack);
      } else {
        // Add to stack if not found
        setNavigationStack((prev) => [...prev, pageId]);
      }
    }
    setCurrentPage(pageId);
  };

  const canGoBack = navigationStack.length > 1;

  return (
    <BookmarkNavigationContext.Provider
      value={{
        currentPage,
        navigationStack,
        setCurrentPage,
        navigateToFolder,
        navigateBack,
        navigateToPage,
        canGoBack,
      }}
    >
      {children}
    </BookmarkNavigationContext.Provider>
  );
};

export function useBookmarkNavigation() {
  const ctx = useContext(BookmarkNavigationContext);
  if (!ctx) {
    throw new Error('useBookmarkNavigation must be used within BookmarkNavigationProvider');
  }
  return ctx;
}
