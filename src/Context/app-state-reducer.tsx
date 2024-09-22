import { AppState } from './app-state';
import { BookmarksData } from '../Data/bookmarks';
import { IBookmarkItem } from '../Components/Bookmark/BookmarkFolderRoot';

export type AppStateAction =
  | { type: 'PROVIDER_INITIALISED' }
  | { type: 'LOAD_BOOKMARKS_DATA_START' }
  | { type: 'LOAD_BOOKMARKS_DATA_SUCCESS'; data: BookmarksData }
  | { type: 'LOAD_BOOKMARKS_DATA_FINISHED' }
  | { type: 'SET_CURRENT_PAGE'; data: string }
  | { type: 'SET_FILTERED_DATA'; data: IBookmarkItem[] }
  | { type: 'ERROR'; error: Error };

export const appStateReducer = (state: AppState, action: AppStateAction) => {
  switch (action.type) {
    case 'PROVIDER_INITIALISED': {
      return {
        ...state,
        providerInitialised: true
      };
    }
    case 'LOAD_BOOKMARKS_DATA_START': {
      return {
        ...state,
        isLoading: true
      };
    }
    case 'LOAD_BOOKMARKS_DATA_SUCCESS': {
      return {
        ...state,
        bookmarks: action.data
      };
    }
    case 'LOAD_BOOKMARKS_DATA_FINISHED': {
      return {
        ...state,
        isLoading: false
      };
    }
    case 'SET_CURRENT_PAGE': {
      return {
        ...state,
        currentPage: action.data
      };
    }
    case 'SET_FILTERED_DATA': {
      return {
        ...state,
        filteredData: action.data
      };
    }
    case 'ERROR': {
      return {
        ...state,
        error: action.error
      };
    }
  }
};
