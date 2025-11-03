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
  bookmarks: { folders: [], uncategorized: undefined },
  currentPage: 'All',
  filteredData: [],
  isLoading: false,
  providerInitialised: false,
};
