import { useAtom } from 'jotai';
import type React from 'react';
import { useEffect, useMemo, useReducer } from 'react';

import { initialAppState } from '@/app/providers/app-state';
import { AppStateContext } from '@/app/providers/app-state-context';
import { appStateReducer } from '@/app/providers/app-state-reducer';
import { bookmarksAtom } from '@/app/providers/atoms';
import { getBookmarksData } from '@/features/bookmarks/lib/bookmarks';

interface AppStateProviderProps {
  children?: React.ReactNode;
}

// Deprecated: previous local layout persistence conflicted with ordering service

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appStateReducer, initialAppState);
  const [persistedBookmarks, setPersistedBookmarks] = useAtom(bookmarksAtom);

  useEffect(() => {
    dispatch({ type: 'PROVIDER_INITIALISED' });
    // Hydrate initial state from persisted atom for instant UI
    if (persistedBookmarks?.folders?.length || persistedBookmarks?.uncategorized) {
      dispatch({ type: 'LOAD_BOOKMARKS_DATA_SUCCESS', data: persistedBookmarks });
    }
  }, [persistedBookmarks]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'LOAD_BOOKMARKS_DATA_START' });
      try {
        const data = await getBookmarksData();
        setPersistedBookmarks(data);
        dispatch({ type: 'LOAD_BOOKMARKS_DATA_SUCCESS', data });
      } catch (err: unknown) {
        dispatch({ type: 'ERROR', error: err });
      } finally {
        dispatch({ type: 'LOAD_BOOKMARKS_DATA_FINISHED' });
      }
    };

    fetchData();
  }, [setPersistedBookmarks]);

  const contextValues = useMemo(
    () => ({
      bookmarks: state.bookmarks,
      isLoading: state.isLoading,
      error: state.error,
      providerInitialised: state.providerInitialised,
      refreshBookmarks: async () => {
        dispatch({ type: 'LOAD_BOOKMARKS_DATA_START' });
        try {
          const data = await getBookmarksData();
          setPersistedBookmarks(data);
          dispatch({ type: 'LOAD_BOOKMARKS_DATA_SUCCESS', data });
        } catch (err: unknown) {
          dispatch({ type: 'ERROR', error: err });
        } finally {
          dispatch({ type: 'LOAD_BOOKMARKS_DATA_FINISHED' });
        }
      },
    }),
    [state, setPersistedBookmarks]
  );

  return <AppStateContext.Provider value={contextValues}>{children}</AppStateContext.Provider>;
};
