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
import { type ReactNode, createContext, useContext, useState } from 'react';

import { useAppStateContext } from '@/app/providers/app-state-context';
import { viewModeAtom } from '@/app/providers/atoms';
import { DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX, DROPPABLE_ROOT_FOLDER_PREFIX, DROPPABLE_SIDEBAR_FOLDER_PREFIX } from '@/config/dnd-constants';
import { SkeletonBookmarkItem } from '@/features/bookmarks/components/items/SkeletonBookmarkItem';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { moveItem, reorderItems } from '@/features/bookmarks/lib/bookmarks';
import { findItemById, findParentOfItem } from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';

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

  const handleDragEnd = async ({ active, over }: DragEndEvent) => {
    setActiveId(null);
    if (!active || !over) {
      return;
    }

    const fromId = active.id as string;
    const overId = String(over.id);
    const srcParent = findParentOfItem(rawFolders, fromId);
    const activeItem = findItemById(rawFolders, fromId);

    // Determine if we're dragging a folder or a bookmark
    const isFolder = activeItem && !activeItem.url;

    // Allow both folder and bookmark operations

    if (isFolder) {
      // Handle folder operations

      // Handle reordering folders within same level
      if (srcParent?.children) {
        const fromIndex = srcParent.children.findIndex((c) => c.id === fromId);
        const toIndex = srcParent.children.findIndex((c) => c.id === overId);

        if (fromIndex >= 0 && toIndex >= 0 && fromIndex !== toIndex) {
          await reorderItems(srcParent.id, fromIndex, toIndex);
          refreshBookmarks();
        } else {
        }
      } else {
      }
    } else {
      // Handle bookmark operations
      let destFolderId: string | null = null;
      if (overId.startsWith(DROPPABLE_SIDEBAR_FOLDER_PREFIX)) {
        destFolderId = overId.slice(DROPPABLE_SIDEBAR_FOLDER_PREFIX.length);
      } else if (overId.startsWith(DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX)) {
        destFolderId = overId.slice(DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX.length);
      } else if (overId.startsWith(DROPPABLE_ROOT_FOLDER_PREFIX)) {
        destFolderId = overId.slice(DROPPABLE_ROOT_FOLDER_PREFIX.length);
      }

      if (destFolderId) {
        // If destination is same folder, do not treat as a move-to-index-0; fall through to reorder logic
        const fromFolderId = srcParent?.id || 'root';
        if (destFolderId !== fromFolderId) {
          await moveItem(fromId, fromFolderId, destFolderId, 0);
          refreshBookmarks();
          return;
        }
        // Same-folder container drop: continue to reorder flow below
      }

      // Handle reordering within same folder (bookmarks only)
      if (srcParent?.children) {
        const fromIndex = srcParent.children.findIndex((c) => c.id === fromId);
        let toIndex = srcParent.children.findIndex((c) => c.id === overId);
        // If overId is the container (no matching child), default to last position
        if (toIndex === -1 && destFolderId === srcParent.id) {
          toIndex = srcParent.children.length - 1;
        }

        if (fromIndex >= 0 && toIndex >= 0 && fromIndex !== toIndex) {
          await reorderItems(srcParent.id, fromIndex, toIndex);
          refreshBookmarks();
        } else {
        }
      } else {
      }
    }
  };

  const constrainedCollisionDetection: CollisionDetection = ({ active, collisionRect, droppableRects, droppableContainers, pointerCoordinates }) => {
    const activeItem = active.id ? findItemById(rawFolders, active.id as string) : null;
    const isFolder = activeItem && !activeItem.url;
    const srcParent = active.id ? findParentOfItem(rawFolders, active.id as string) : null;

    // Allow both folder and bookmark operations
    const allowedContainers = droppableContainers.filter((c) => {
      const id = String(c.id);

      if (isFolder) {
        // Folders can be reordered within the layout or moved to sidebar
        return (
          id.startsWith(DROPPABLE_ROOT_FOLDER_PREFIX) ||
          id.startsWith(DROPPABLE_SIDEBAR_FOLDER_PREFIX) ||
          id.startsWith(DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX) ||
          // Allow reordering within same level
          (srcParent?.children?.map((c) => c.id) ?? []).includes(id)
        );
      }
      // Bookmarks can be dropped in folders or reordered within same folder
      const ownItems = srcParent?.children?.map((c) => c.id) ?? [];
      return (
        id.startsWith(DROPPABLE_ROOT_FOLDER_PREFIX) ||
        id.startsWith(DROPPABLE_SIDEBAR_FOLDER_PREFIX) ||
        id.startsWith(DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX) ||
        ownItems.includes(id)
      );
    });

    return pointerWithin({
      active,
      collisionRect,
      droppableRects,
      droppableContainers: allowedContainers,
      pointerCoordinates,
    });
  };

  return (
    <DragDropContext.Provider value={{ activeId }}>
      <DndContext
        sensors={sensors}
        collisionDetection={constrainedCollisionDetection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragCancel={() => setActiveId(null)}
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
