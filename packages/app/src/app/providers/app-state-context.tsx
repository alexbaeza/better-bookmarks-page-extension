import { createContext, use } from 'react';

import type { BookmarksData } from '@/features/bookmarks/lib/bookmarks';

import { initialAppState } from './app-state';

interface AppStateContextProps {
  bookmarks: BookmarksData;
  isLoading: boolean;
  error?: Error;
  providerInitialised: boolean;
  refreshBookmarks: () => Promise<void>;
}

const stub = (): never => {
  throw new Error('App must be wrapped with <AppStateProvider> to access AppStateContext');
};

export const initialContext: AppStateContextProps = {
  bookmarks: initialAppState.bookmarks,
  error: initialAppState.error,
  isLoading: initialAppState.isLoading,
  providerInitialised: initialAppState.providerInitialised,
  refreshBookmarks: stub,
};

export const AppStateContext = createContext<AppStateContextProps>(initialContext);

export const useAppStateContext = (): AppStateContextProps => {
  return use(AppStateContext);
};
