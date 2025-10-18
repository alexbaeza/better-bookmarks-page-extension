import { SortableContext, rectSortingStrategy, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useAtomValue } from 'jotai';
import React, { useMemo, useEffect, useState, useRef } from 'react';

import { viewModeAtom } from '@/app/providers/atoms';
import { useDragDrop } from '@/app/providers/dragdrop-provider';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { BookmarkDisplayMode } from '@/shared/types/ui';

import { DraggableBookmarkItem } from '@/features/bookmarks/components/items/DraggableBookmarkItem';

export interface BookmarkContentRendererProps {
  folderContents: IBookmarkItem[];
  folderId: string;
}

export const BookmarkContentRenderer: React.FC<BookmarkContentRendererProps> = ({ folderContents, folderId }) => {
  const { activeId } = useDragDrop();
  const viewMode = useAtomValue(viewModeAtom);
  const isList = viewMode === BookmarkDisplayMode.List;
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const optimalColumns = useMemo(() => {
    if (isList || containerWidth === 0) return 1;

    const itemWidth = 96; // 6rem in pixels
    const gap = 16; // 1rem gap in pixels
    const padding = 8; // 1rem padding (0.5rem on each side) in pixels

    const availableWidth = containerWidth - padding * 2;

    const itemsPerRow = Math.floor((availableWidth + gap) / (itemWidth + gap));

    return Math.max(1, itemsPerRow);
  }, [isList, containerWidth]);

  useEffect(() => {
    const measureWidth = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.clientWidth);
      }
    };

    measureWidth();
    window.addEventListener('resize', measureWidth);
    return () => window.removeEventListener('resize', measureWidth);
  }, []);

  const layoutClass = isList ? 'flex flex-col gap-2 p-2' : 'grid gap-4 p-4';

  const gridStyle = isList
    ? {}
    : {
        gridTemplateColumns: `repeat(${optimalColumns}, minmax(0, 1fr))`,
        gap: '1rem',
      };

  return (
    <SortableContext items={folderContents.map((item) => item.id)} strategy={isList ? verticalListSortingStrategy : rectSortingStrategy}>
      <div ref={containerRef} className={layoutClass} style={gridStyle} data-folder-id={folderId} data-testid="bookmark-content-container">
        {folderContents.map((item) => (
          <React.Fragment key={item.id}>
            <DraggableBookmarkItem item={item} isGhost={item.id === activeId} />
          </React.Fragment>
        ))}
      </div>
    </SortableContext>
  );
};
