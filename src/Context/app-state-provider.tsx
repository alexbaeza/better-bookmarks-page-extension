import React, { useEffect, useMemo, useReducer, useRef } from 'react';
import { appStateReducer } from './app-state-reducer';
import { AppStateContext } from './app-state-context';
import { initialAppState } from './app-state';
import { Bookmarks } from '../Data/bookmarks';
import { IBookmarkItem } from '../Components/Bookmark/BookmarkFolderRoot';

interface AppStateProviderProps {
  children?: React.ReactNode;
}

// Creating a context provider component
const AppStateProvider = (opts: AppStateProviderProps): React.JSX.Element => {
  const { children } = opts;
  const [state, dispatch] = useReducer(appStateReducer, initialAppState);

  const didInitialise = useRef(false);
  useEffect(() => {
    didInitialise.current = true;
    dispatch({ type: 'PROVIDER_INITIALISED' });
  }, []);

  useEffect(() => {
    filterData(state.currentPage);
    // eslint-disable-next-line
  }, [state.bookmarks, state.currentPage]);

  const getBookmarks = async () => {
    dispatch({ type: 'LOAD_BOOKMARKS_DATA_START' });
    return Bookmarks.getBookmarksData()
      .then((bookmarks) => {
        dispatch({ type: 'LOAD_BOOKMARKS_DATA_SUCCESS', data: bookmarks });
      })
      .catch((err) => {
        console.error(err);
        dispatch({ type: 'ERROR', error: err });
      })
      .finally(() => {
        dispatch({ type: 'LOAD_BOOKMARKS_DATA_FINISHED' });
      });
  };

  const setCurrentPage = (id: string) => {
    dispatch({ type: 'SET_CURRENT_PAGE', data: id });
  };

  const filterData = (id: string) => {
    const filteredBookmarks: IBookmarkItem[] = filterBookmarks(id);
    dispatch({ type: 'SET_FILTERED_DATA', data: filteredBookmarks });
  };

  const filterBookmarks = (id: string): IBookmarkItem[] => {
    if (state.currentPage === 'All') {
      return state.bookmarks.folders;
    } else if (state.currentPage === 'Uncategorized') {
      return state.bookmarks.uncategorized
        ? [state.bookmarks.uncategorized]
        : [];
    } else {
      return state.bookmarks.folders.filter((folder: IBookmarkItem) => {
        return folder.id === id;
      });
    }
  };
  const contextValues = useMemo(
    () => ({
      ...state,
      didInitialise,
      getBookmarks,
      setCurrentPage
    }),
    [state]
  );

  return (
    <AppStateContext.Provider value={contextValues}>
      {children}
    </AppStateContext.Provider>
  );
};

export { AppStateProvider };
export type { AppStateProviderProps };
