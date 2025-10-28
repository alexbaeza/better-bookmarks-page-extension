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
  dragProps: {
    ref: (node: HTMLElement | null) => void;
    style: React.CSSProperties;
    'data-testid': string;
  };
  dragHandleProps: Record<string, any>;
  isDragging: boolean;
  renderDragOverlay: () => React.ReactElement | null;
}

export const useBookmarkDrag = ({ item, isGhost = false }: UseBookmarkDragOptions): UseBookmarkDragReturn => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });
  const viewMode = useAtomValue(viewModeAtom);
  const isGrid = viewMode === 'grid';
  const style = useDragStyles(transform, transition, isGhost, isDragging, isGrid);

  const renderDragOverlay = () => {
    if (isGhost) {
      return (
        <div
          aria-hidden="true"
          className="w-24 h-24 rounded-lg border-2 border-dashed border-fgColor-accent"
          ref={setNodeRef}
          style={{
            ...style,
            backgroundImage: `
              repeating-linear-gradient(
                45deg,
                rgba(255,255,255,0.15) 0,
                rgba(255,255,255,0.15) 8px,
                transparent 8px,
                transparent 16px
              )
            `,
          }}
        >
          <SkeletonBookmarkItem viewMode={viewMode} />
        </div>
      );
    }

    return (
      <div ref={setNodeRef} style={style} {...attributes} {...listeners} data-testid={`${item.url ? 'bookmark-item' : 'bookmark-folder-item'}-${item.id}`}>
        {/* Content will be provided by consumer */}
      </div>
    );
  };

  return {
    dragProps: {
      ref: setNodeRef,
      style,
      'data-testid': `${item.url ? 'bookmark-item' : 'bookmark-folder-item'}-${item.id}`,
    },
    dragHandleProps: { ...attributes, ...listeners },
    isDragging,
    renderDragOverlay,
  };
};
