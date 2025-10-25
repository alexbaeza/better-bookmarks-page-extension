import { SortableContext, rectSortingStrategy, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useAtomValue } from 'jotai';
import React from 'react';

import { viewModeAtom } from '@/app/providers/atoms';
import { useDragDrop } from '@/app/providers/dragdrop-provider';
import { useContainerWidth } from '@/features/bookmarks/hooks/useContainerWidth';
import { useOptimalColumns } from '@/features/bookmarks/hooks/useOptimalColumns';
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
  const { containerWidth, containerRef } = useContainerWidth();
  const optimalColumns = useOptimalColumns(containerWidth, isList);

  const layoutClass = isList ? 'flex flex-col gap-2 p-2' : 'grid gap-2 p-4';

  const gridStyle = isList
    ? {}
    : {
        gridTemplateColumns: `repeat(${optimalColumns}, minmax(100px, 1fr))`,
        gap: '0.5rem',
      };

  // Debug logs
  console.log('BookmarkContentRenderer debug:', {
    folderId,
    folderContentsCount: folderContents.length,
    viewMode,
    isList,
    containerWidth,
    optimalColumns,
    gridStyle: isList ? 'N/A (list mode)' : gridStyle,
  });

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
