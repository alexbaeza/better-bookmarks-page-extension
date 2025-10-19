import { DndContext, DragOverlay, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { useAtomValue } from 'jotai';
import type React from 'react';
import { type ReactNode, createContext, useCallback, useContext, useState } from 'react';

import { useAppStateContext } from '@/app/providers/app-state-context';
import { viewModeAtom } from '@/app/providers/atoms';
import { createConstrainedCollisionDetection } from '@/app/providers/dragdrop/collision-detection';
import { createDragHandlers } from '@/app/providers/dragdrop/drag-handlers';
import { SkeletonBookmarkItem } from '@/features/bookmarks/components/items/SkeletonBookmarkItem';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { findItemById } from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';

const DragDropContext = createContext<DragDropContextValue | null>(null);

export const DragDropProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { rawFolders } = useBookmarks();
  const { refreshBookmarks } = useAppStateContext();
  const [activeId, setActiveId] = useState<string | null>(null);
  const viewMode = useAtomValue(viewModeAtom);

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const activeItem = activeId ? findItemById(rawFolders, activeId) : null;

  const dragHandlers = useCallback(() => createDragHandlers(rawFolders, refreshBookmarks, setActiveId), [rawFolders, refreshBookmarks]);

  const collisionDetection = useCallback(() => createConstrainedCollisionDetection(rawFolders), [rawFolders]);

  return (
    <DragDropContext.Provider value={{ activeId }}>
      <DndContext
        sensors={sensors}
        collisionDetection={collisionDetection()}
        onDragStart={dragHandlers().handleDragStart}
        onDragEnd={dragHandlers().handleDragEnd}
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
