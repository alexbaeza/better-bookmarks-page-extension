import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent, PointerSensor, pointerWithin, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useAtomValue } from 'jotai';
import type React from 'react';
import { createContext, type ReactNode, useContext, useState } from 'react';

import { useAppStateContext } from '@/app/providers/app-state-context';
import { viewModeAtom } from '@/app/providers/atoms';
import { DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX, DROPPABLE_ROOT_FOLDER_PREFIX, DROPPABLE_SIDEBAR_FOLDER_PREFIX } from '@/config/dnd-constants';
import { SkeletonBookmarkItem } from '@/features/bookmarks/components/items/SkeletonBookmarkItem';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { move, moveItem } from '@/features/bookmarks/lib/bookmarks';
import { findItemById, findParentOfItem } from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';
import { orderingService } from '@/features/bookmarks/lib/ordering-service';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

// Utility function to extract destination folder ID from droppable container ID
const extractDestinationFolderId = (overId: string): string | null => {
  const prefixes = [DROPPABLE_SIDEBAR_FOLDER_PREFIX, DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX, DROPPABLE_ROOT_FOLDER_PREFIX];

  for (const prefix of prefixes) {
    if (overId.startsWith(prefix)) {
      return overId.slice(prefix.length);
    }
  }
  return null;
};

const DragDropContext = createContext<DragDropContextValue | null>(null);

export const DragDropProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { rawFolders } = useBookmarks();
  const { refreshBookmarks } = useAppStateContext();
  const [activeId, setActiveId] = useState<string | null>(null);
  const viewMode = useAtomValue(viewModeAtom);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const activeItem = activeId ? findItemById(rawFolders, activeId) : null;

  const handleDragStart = ({ active }: DragStartEvent) => {
    setActiveId(active.id as string);
  };

  // Unified handler for item moves (folders and bookmarks)
  const handleItemMove = async (fromId: string, overId: string, srcParent: IBookmarkItem | null): Promise<boolean> => {
    const destFolderId = extractDestinationFolderId(overId);

    if (destFolderId) {
      const fromFolderId = srcParent?.id || 'root';

      // Prevent dropping into same folder
      if (destFolderId !== fromFolderId) {
        await moveItem(fromId, fromFolderId, destFolderId, 0);
        refreshBookmarks();
        return true; // Move handled
      }
      return false; // Same folder, no move
    }

    return false; // Not a folder drop target
  };

  // Handle reordering within the same folder (using optimized logic from useBookmarkReorder)
  const handleItemReorder = async (fromId: string, overId: string, srcParent: IBookmarkItem | null): Promise<boolean> => {
    if (!srcParent?.children) return false;

    // Check if overId is another item in the same folder
    const activeIndex = srcParent.children.findIndex((c) => c.id === fromId);
    const overIndex = srcParent.children.findIndex((c) => c.id === overId);

    // Only reorder if both items are in the same folder and positions changed
    if (activeIndex < 0 || overIndex < 0 || activeIndex === overIndex) {
      return false; // Not a reorder operation
    }

    // 1. Calculate new order using arrayMove
    const currentItems = [...srcParent.children];
    const reorderedItems = arrayMove(currentItems, activeIndex, overIndex);

    // 2. Update localStorage order immediately (for immediate persistence)
    // getBookmarksData() applies this order via orderingService.applyOrdering()
    const orderedIds = reorderedItems.map((item) => item.id);
    orderingService.setOrder(srcParent.id, orderedIds);

    // 3. Compare old and new order to find items that moved
    const currentOrder = currentItems.map((item) => item.id);
    const newOrder = reorderedItems.map((item) => item.id);

    // Check if order actually changed
    const orderChanged = currentOrder.some((id, index) => id !== newOrder[index]);

    // 4. Refresh UI immediately with new order from localStorage
    // This prevents the visual glitch where items snap back to old positions
    // getBookmarksData() will apply orderingService order even if browser API hasn't updated yet
    await refreshBookmarks();

    if (!orderChanged) {
      return true; // No change, already refreshed
    }

    // 5. Apply to browser bookmarks API in the background
    // Move items in reverse order to avoid index shifting issues
    // Don't await - let this happen in background while UI already shows correct order
    const updatePromises: Promise<void>[] = [];
    for (let targetIndex = newOrder.length - 1; targetIndex >= 0; targetIndex--) {
      const itemId = newOrder[targetIndex];
      const currentIdx = currentOrder.indexOf(itemId);

      // Only move if position actually changed
      if (currentIdx !== targetIndex) {
        updatePromises.push(
          move(itemId, {
            parentId: srcParent.id,
            index: targetIndex,
          })
        );

        // Update current order after move to reflect new positions
        currentOrder.splice(currentIdx, 1);
        currentOrder.splice(targetIndex, 0, itemId);
      }
    }

    // 6. Wait for all API calls to complete, then refresh once more to ensure sync
    await Promise.all(updatePromises);
    await refreshBookmarks();
    return true; // Reorder handled
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (!active || !over) return;

    const fromId = active.id as string;
    const overId = String(over.id);
    const srcParent = findParentOfItem(rawFolders, fromId);

    // First try folder-to-folder moves (sidebar, etc.)
    const moveHandled = await handleItemMove(fromId, overId, srcParent);

    // If not a folder move, try reordering within same folder
    if (!moveHandled) {
      await handleItemReorder(fromId, overId, srcParent);
    }
  };

  return (
    <DragDropContext.Provider value={{ activeId }}>
      <DndContext
        collisionDetection={pointerWithin}
        onDragCancel={() => setActiveId(null)}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        sensors={sensors}
      >
        {children}
        <DragOverlay>
          {activeItem && !activeItem.url ? null : activeItem && <SkeletonBookmarkItem dataTestId="drag-overlay-skeleton" viewMode={viewMode} />}
        </DragOverlay>
      </DndContext>
    </DragDropContext.Provider>
  );
};

interface DragDropContextValue {
  activeId: string | null;
}

export const useDragDrop = () => {
  const context = useContext(DragDropContext);
  if (!context) {
    throw new Error('useDragDrop must be used within a DragDropProvider');
  }
  return context;
};
