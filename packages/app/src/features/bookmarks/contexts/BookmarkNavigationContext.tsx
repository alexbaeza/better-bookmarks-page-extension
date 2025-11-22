import type { ReactNode } from 'react';
import { createContext, use, useCallback, useMemo, useState } from 'react';

import { getLast, removeLast, takeUntil } from '@/shared/utils/array-utils';
import { isRootPage } from '@/shared/utils/page-utils';

export enum BookmarkPage {
  All = 'All',
  Uncategorized = 'Uncategorized',
}

export type PageId = BookmarkPage | string;

export interface NavigationContextType {
  currentPage: PageId;
  navigationStack: PageId[];
  setCurrentPage: (page: PageId) => void;
  navigateToFolder: (folderId: string) => void;
  navigateBack: () => void;
  navigateToPage: (pageId: PageId) => void;
  navigateToFolderWithPath: (folderId: string, path: PageId[]) => void;
  canGoBack: boolean;
}

const BookmarkNavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const BookmarkNavigationProvider = ({ children }: { children: ReactNode }) => {
  const [currentPage, setCurrentPage] = useState<PageId>(BookmarkPage.All);
  const [navigationStack, setNavigationStack] = useState<PageId[]>(['All']);

  const navigateToFolder = useCallback((folderId: string) => {
    setNavigationStack((prev) => [...prev, folderId]);
    setCurrentPage(folderId);
  }, []);

  const navigateBack = useCallback(() => {
    setNavigationStack((prev) => {
      if (prev.length > 1) {
        const newStack = removeLast(prev);
        const lastPage = getLast(newStack);
        if (lastPage) {
          setCurrentPage(lastPage);
        }
        return newStack;
      }
      return prev;
    });
  }, []);

  const navigateToPage = useCallback((pageId: PageId) => {
    // If navigating to a root page, reset stack
    if (isRootPage(pageId)) {
      setNavigationStack([pageId]);
    } else {
      // For folder navigation, find the index in current stack or add it
      setNavigationStack((prev) => {
        const existingIndex = prev.indexOf(pageId);
        if (existingIndex >= 0) {
          // Navigate to existing position in stack
          return takeUntil(prev, existingIndex);
        }
        // Add to stack if not found
        return [...prev, pageId];
      });
    }
    setCurrentPage(pageId);
  }, []);

  const navigateToFolderWithPath = useCallback((folderId: string, path: PageId[]) => {
    setNavigationStack(path);
    setCurrentPage(folderId);
  }, []);

  const canGoBack = navigationStack.length > 1;

  const value = useMemo(
    () => ({
      canGoBack,
      currentPage,
      navigateBack,
      navigateToFolder,
      navigateToFolderWithPath,
      navigateToPage,
      navigationStack,
      setCurrentPage,
    }),
    [canGoBack, currentPage, navigateBack, navigateToFolder, navigateToFolderWithPath, navigateToPage, navigationStack]
  );

  return <BookmarkNavigationContext.Provider value={value}>{children}</BookmarkNavigationContext.Provider>;
};

export const useBookmarkNavigation = (): NavigationContextType => {
  // use() throws if context is undefined, so this is safe
  return use(BookmarkNavigationContext) as NavigationContextType;
};
