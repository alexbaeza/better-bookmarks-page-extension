import { useCallback } from 'react';
import { useAppStateContext } from '@/app/providers/app-state-context';
import { move } from '@/features/bookmarks/lib/bookmarks';
import { orderingService } from '@/features/bookmarks/lib/ordering-service';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

export const useBookmarkReorder = (folderId: string) => {
  const { refreshBookmarks } = useAppStateContext();

  const handleReorder = useCallback(
    async (reorderedItems: IBookmarkItem[], currentItems: IBookmarkItem[]) => {
      // 1. Update localStorage order first (for immediate persistence)
      const orderedIds = reorderedItems.map((item) => item.id);
      orderingService.setOrder(folderId, orderedIds);

      // 2. Compare old and new order to find items that moved
      const currentOrder = currentItems.map((item) => item.id);
      const newOrder = reorderedItems.map((item) => item.id);

      // Check if order actually changed
      const orderChanged = currentOrder.some((id, index) => id !== newOrder[index]);
      if (!orderChanged) {
        return; // No change, skip API calls
      }

      // 3. Apply to browser bookmarks API
      // Move items in reverse order to avoid index shifting issues
      for (let targetIndex = newOrder.length - 1; targetIndex >= 0; targetIndex--) {
        const itemId = newOrder[targetIndex];
        const currentIndex = currentOrder.indexOf(itemId);

        // Only move if position actually changed
        if (currentIndex !== targetIndex) {
          await move(itemId, {
            parentId: folderId,
            index: targetIndex,
          });

          // Update current order after move to reflect new positions
          currentOrder.splice(currentIndex, 1);
          currentOrder.splice(targetIndex, 0, itemId);
        }
      }

      // 4. Refresh UI to ensure sync
      await refreshBookmarks();
    },
    [folderId, refreshBookmarks]
  );

  return { handleReorder };
};
