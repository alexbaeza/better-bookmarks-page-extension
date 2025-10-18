import { createContext, useContext } from 'react';

import type { BookmarksData } from '@/features/bookmarks/lib/bookmarks';

import { initialAppState } from './app-state';

interface AppStateContextProps {
  bookmarks: BookmarksData;
  isLoading: boolean;
  error?: Error;
  providerInitialised: boolean;
  refreshBookmarks: () => Promise<void>;
  updateBookmarkLayout: (folders: BookmarksData['folders']) => void;
}

const stub = (): never => {
  throw new Error('App must be wrapped with <AppStateProvider> to access AppStateContext');
};

export const initialContext: AppStateContextProps = {
  bookmarks: initialAppState.bookmarks,
  isLoading: initialAppState.isLoading,
  error: initialAppState.error,
  providerInitialised: initialAppState.providerInitialised,
  refreshBookmarks: stub,
  updateBookmarkLayout: stub,
};

export const AppStateContext = createContext<AppStateContextProps>(initialContext);

export const useAppStateContext = (): AppStateContextProps => {
  const ctx = useContext(AppStateContext);
  if (!ctx) stub();
  return ctx;
};
