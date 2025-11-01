import { useSortable } from '@dnd-kit/sortable';
import { useAtomValue } from 'jotai';
import type React from 'react';

import { viewModeAtom } from '@/app/providers/atoms';
import { SkeletonBookmarkItem } from '@/features/bookmarks/components/items/SkeletonBookmarkItem';
import { useDragStyles } from '@/features/bookmarks/hooks/useDragStyles';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

export interface UseBookmarkDragOptions {
  item: IBookmarkItem;
  isGhost?: boolean;
}

export interface UseBookmarkDragReturn {
  dragProps: Record<string, unknown> & { ref: (node: HTMLElement | null) => void; style: React.CSSProperties; 'data-testid': string };
  dragHandleProps: Record<string, unknown>;
  isDragging: boolean;
  renderDragOverlay: () => React.ReactNode | null;
}

/**
 * Hook for bookmark drag functionality
 * @param options - Options containing the bookmark item and optional isGhost flag
 * @returns Drag props, drag handle props, isDragging state, and renderDragOverlay function
 */
export function useBookmarkDrag({ item, isGhost = false }: UseBookmarkDragOptions): UseBookmarkDragReturn {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const viewMode = useAtomValue(viewModeAtom);

  const style = useDragStyles(transform, transition, isGhost, isDragging, true);

  const isFolder = Boolean(item.children);
  const testId = isFolder ? `bookmark-folder-item-${item.id}` : `bookmark-item-${item.id}`;

  const dragProps = {
    ref: setNodeRef,
    style,
    'data-testid': testId,
    ...attributes,
  };

  const dragHandleProps = {
    role: 'button',
    ...listeners,
  };

  const renderDragOverlay = () => {
    if (isGhost) {
      return <SkeletonBookmarkItem dataTestId={`${testId}-ghost`} viewMode={viewMode} />;
    }
    return <SkeletonBookmarkItem dataTestId={`${testId}-overlay`} viewMode={viewMode} />;
  };

  return {
    dragProps,
    dragHandleProps,
    isDragging,
    renderDragOverlay,
  };
}
