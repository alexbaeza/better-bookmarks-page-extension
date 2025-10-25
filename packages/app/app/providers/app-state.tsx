import type { BookmarksData } from '@/features/bookmarks/lib/bookmarks';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

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
  isLoading: false,
};
