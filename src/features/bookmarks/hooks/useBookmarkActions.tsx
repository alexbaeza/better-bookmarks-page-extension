import { useCallback } from 'react';

import { useAppStateContext } from '@/app/providers/app-state-context';
import { create, move, remove, update } from '@/features/bookmarks/lib/bookmarks';

export function useBookmarkActions() {
  const { refreshBookmarks } = useAppStateContext();

  const createBookmark = useCallback(
    async (parentId: string, details: { title: string; url?: string }) => {
      await create(parentId, details);
      await refreshBookmarks();
    },
    [refreshBookmarks]
  );
  const updateBookmark = useCallback(
    async (id: string, changes: { title?: string; url?: string }) => {
      await update(id, changes);
      await refreshBookmarks();
    },
    [refreshBookmarks]
  );
  const removeBookmark = useCallback(
    async (id: string) => {
      await remove(id);
      await refreshBookmarks();
    },
    [refreshBookmarks]
  );
  const moveBookmark = useCallback(
    async (id: string, dest: { parentId: string; index?: number }) => {
      await move(id, dest);
      await refreshBookmarks();
    },
    [refreshBookmarks]
  );

  return {
    create: createBookmark,
    update: updateBookmark,
    remove: removeBookmark,
    move: moveBookmark,
  };
}
