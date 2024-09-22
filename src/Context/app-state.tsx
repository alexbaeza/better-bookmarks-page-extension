import { BookmarksData } from '../Data/bookmarks';
import { IBookmarkItem } from '../Components/Bookmark/BookmarkFolderRoot';

export interface AppState {
  currentPage: string;
  providerInitialised: boolean;
  bookmarks: BookmarksData;
  filteredData: IBookmarkItem[];
  isLoading: boolean;
  error?: Error;
}

export const initialAppState: AppState = {
  currentPage: 'All',
  providerInitialised: false,
  bookmarks: { folders: [], uncategorized: undefined },
  filteredData: [],
  isLoading: false
};
