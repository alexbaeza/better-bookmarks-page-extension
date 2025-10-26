import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAtomValue } from 'jotai';
import type React from 'react';
import { useMemo } from 'react';

import { viewModeAtom } from '@/app/providers/atoms';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

import { BookmarkItem } from './BookmarkItem';
import { SkeletonBookmarkItem } from './SkeletonBookmarkItem';

export interface DraggableBookmarkItemProps {
  item: IBookmarkItem;
  isGhost?: boolean;
}

export const DraggableBookmarkItem: React.FC<DraggableBookmarkItemProps> = ({ item, isGhost = false }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: item.id });

  const viewMode = useAtomValue(viewModeAtom);

  const style = useMemo(
    () => ({
      height: 'auto',
      opacity: isGhost ? 0.3 : isDragging ? 0.8 : 1, // Less opacity change to reduce visual impact
      transform: CSS.Transform.toString(transform),
      transition, // Always apply transition
      width: '100%',
    }),
    [transform, transition, isGhost, isDragging]
  );

  if (isGhost) {
    return (
      <div
        aria-hidden="true"
        className="rounded-lg border-2 border-dashed border-fgColor-accent"
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
      <BookmarkItem dragHandleProps={listeners} item={item} />
    </div>
  );
};
