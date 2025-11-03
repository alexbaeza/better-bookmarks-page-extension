import type { BookmarksData } from '@/features/bookmarks/lib/bookmarks';

import type { AppState } from './app-state';

export type AppStateAction =
  | { type: 'PROVIDER_INITIALISED' }
  | { type: 'LOAD_BOOKMARKS_DATA_START' }
  | { type: 'LOAD_BOOKMARKS_DATA_SUCCESS'; data: BookmarksData }
  | { type: 'LOAD_BOOKMARKS_DATA_FINISHED' }
  | { type: 'ERROR'; error: Error };

export const appStateReducer = (state: AppState, action: AppStateAction): AppState => {
  switch (action.type) {
    case 'PROVIDER_INITIALISED':
      return { ...state, providerInitialised: true };
    case 'LOAD_BOOKMARKS_DATA_START':
      return { ...state, isLoading: true };
    case 'LOAD_BOOKMARKS_DATA_SUCCESS':
      return { ...state, bookmarks: action.data };
    case 'LOAD_BOOKMARKS_DATA_FINISHED':
      return { ...state, isLoading: false };
    case 'ERROR':
      return { ...state, error: action.error };
    default:
      return state;
  }
};
