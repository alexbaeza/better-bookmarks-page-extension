import { useEffect } from 'react';

import { useAppStateContext } from '@/app/providers/app-state-context';

export const useRawBookmarkData = () => {
  const { providerInitialised, bookmarks, isLoading, error, refreshBookmarks } = useAppStateContext();

  useEffect(() => {
    if (!providerInitialised) {
      refreshBookmarks();
    }
  }, [providerInitialised, refreshBookmarks]);

  return {
    error,
    isLoading,
    rawFolders: bookmarks.folders,
    rawUncategorized: bookmarks.uncategorized,
    refresh: refreshBookmarks,
  };
};
