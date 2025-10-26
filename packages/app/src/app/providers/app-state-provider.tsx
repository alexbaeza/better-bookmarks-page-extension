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

export const AppStateProvider: React.FC<AppStateProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appStateReducer, initialAppState);
  const [persistedBookmarks, setPersistedBookmarks] = useAtom(bookmarksAtom);

  useEffect(() => {
    dispatch({ type: 'PROVIDER_INITIALISED' });
    // Hydrate initial state from persisted atom for instant UI
    if (persistedBookmarks?.folders?.length || persistedBookmarks?.uncategorized) {
      dispatch({ data: persistedBookmarks, type: 'LOAD_BOOKMARKS_DATA_SUCCESS' });
    }
  }, [persistedBookmarks]);

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: 'LOAD_BOOKMARKS_DATA_START' });
      try {
        const data = await getBookmarksData();
        setPersistedBookmarks(data);
        dispatch({ data, type: 'LOAD_BOOKMARKS_DATA_SUCCESS' });
      } catch (err: unknown) {
        dispatch({ error: err, type: 'ERROR' });
      } finally {
        dispatch({ type: 'LOAD_BOOKMARKS_DATA_FINISHED' });
      }
    };

    void fetchData();
  }, [setPersistedBookmarks]);

  const contextValues = useMemo(
    () => ({
      bookmarks: state.bookmarks,
      error: state.error,
      isLoading: state.isLoading,
      providerInitialised: state.providerInitialised,
      refreshBookmarks: async () => {
        dispatch({ type: 'LOAD_BOOKMARKS_DATA_START' });
        try {
          const data = await getBookmarksData();
          setPersistedBookmarks(data);
          dispatch({ data, type: 'LOAD_BOOKMARKS_DATA_SUCCESS' });
        } catch (err: unknown) {
          dispatch({ error: err, type: 'ERROR' });
        } finally {
          dispatch({ type: 'LOAD_BOOKMARKS_DATA_FINISHED' });
        }
      },
    }),
    [state, setPersistedBookmarks]
  );

  return <AppStateContext.Provider value={contextValues}>{children}</AppStateContext.Provider>;
};
