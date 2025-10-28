import {
  type CollisionDetection,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { useAtomValue } from 'jotai';
import type React from 'react';
import { createContext, type ReactNode, useContext, useState } from 'react';

import { useAppStateContext } from '@/app/providers/app-state-context';
import { viewModeAtom } from '@/app/providers/atoms';
import { DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX, DROPPABLE_ROOT_FOLDER_PREFIX, DROPPABLE_SIDEBAR_FOLDER_PREFIX } from '@/config/dnd-constants';
import { SkeletonBookmarkItem } from '@/features/bookmarks/components/items/SkeletonBookmarkItem';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { moveItem, reorderItems } from '@/features/bookmarks/lib/bookmarks';
import { findItemById, findParentOfItem } from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';
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

// Helper function to check if a container represents the same folder
const isSameFolder = (containerId: string, fromFolderId: string): boolean => {
  const destFolderId = extractDestinationFolderId(containerId);
  return destFolderId === fromFolderId;
};

// Helper function to determine if dropping in a container is allowed
const canDropInContainer = (containerId: string, fromFolderId: string, ownItems: string[]): boolean => {
  // Allow dropping in different folders
  if (
    containerId.startsWith(DROPPABLE_ROOT_FOLDER_PREFIX) ||
    containerId.startsWith(DROPPABLE_SIDEBAR_FOLDER_PREFIX) ||
    containerId.startsWith(DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX)
  ) {
    return !isSameFolder(containerId, fromFolderId);
  }

  // Allow reordering within same level
  return ownItems.includes(containerId);
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

  // Unified handler for item reordering
  const handleItemReorder = async (fromId: string, overId: string, srcParent: IBookmarkItem | null) => {
    if (!srcParent?.children) return;

    const fromIndex = srcParent.children.findIndex((c: IBookmarkItem) => c.id === fromId);
    const toIndex = srcParent.children.findIndex((c: IBookmarkItem) => c.id === overId);

    if (fromIndex >= 0 && toIndex >= 0 && fromIndex !== toIndex) {
      await reorderItems(srcParent.id, fromIndex, toIndex);
      refreshBookmarks();
    }
  };

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (!active || !over) return;

    const fromId = active.id as string;
    const overId = String(over.id);
    const srcParent = findParentOfItem(rawFolders, fromId);

    // Try folder-to-folder move first, then fall back to reordering
    const moveHandled = await handleItemMove(fromId, overId, srcParent);
    if (!moveHandled) {
      await handleItemReorder(fromId, overId, srcParent);
    }
  };

  const constrainedCollisionDetection: CollisionDetection = ({ active, collisionRect, droppableRects, droppableContainers, pointerCoordinates }) => {
    const srcParent = active.id ? findParentOfItem(rawFolders, active.id as string) : null;
    const fromFolderId = srcParent?.id || 'root';
    const ownItems = srcParent?.children?.map((c) => c.id) ?? [];

    const allowedContainers = droppableContainers.filter((c) => {
      const id = String(c.id);
      const allowed = canDropInContainer(id, fromFolderId, ownItems);
      return allowed;
    });

    return pointerWithin({
      active,
      collisionRect,
      droppableContainers: allowedContainers,
      droppableRects,
      pointerCoordinates,
    });
  };

  return (
    <DragDropContext.Provider value={{ activeId }}>
      <DndContext
        collisionDetection={constrainedCollisionDetection}
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
