import { useCallback } from 'react';

import { useAppStateContext } from '@/app/providers/app-state-context';
import {
  createBookmark,
  moveBookmark,
  removeBookmark as removeBookmarkApi,
  updateBookmark,
} from '@/features/bookmarks/lib/bookmarks';

export function useBookmarkActions() {
  const { refreshBookmarks } = useAppStateContext();

  const createBookmarkAction = useCallback(
    async (parentId: string, details: { title: string; url?: string }) => {
      await createBookmark(parentId, details);
      await refreshBookmarks();
    },
    [refreshBookmarks]
  );
  const updateBookmarkAction = useCallback(
    async (id: string, changes: { title?: string; url?: string }) => {
      await updateBookmark(id, changes);
      await refreshBookmarks();
    },
    [refreshBookmarks]
  );
  const removeBookmarkAction = useCallback(
    async (id: string) => {
      await removeBookmarkApi(id);
      await refreshBookmarks();
    },
    [refreshBookmarks]
  );
  const moveBookmarkAction = useCallback(
    async (id: string, dest: { parentId: string; index?: number }) => {
      await moveBookmark(id, dest);
      await refreshBookmarks();
    },
    [refreshBookmarks]
  );

  return {
    create: createBookmarkAction,
    move: moveBookmarkAction,
    remove: removeBookmarkAction,
    update: updateBookmarkAction,
  };
}
