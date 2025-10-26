import { rectSortingStrategy, SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useAtomValue } from 'jotai';
import React from 'react';

import { viewModeAtom } from '@/app/providers/atoms';
import { useDragDrop } from '@/app/providers/dragdrop-provider';
import { DraggableBookmarkItem } from '@/features/bookmarks/components/items/DraggableBookmarkItem';
import { useContainerWidth } from '@/features/bookmarks/hooks/useContainerWidth';
import { useOptimalColumns } from '@/features/bookmarks/hooks/useOptimalColumns';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { BookmarkDisplayMode } from '@/shared/types/ui';

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
        gap: '0.5rem',
        gridTemplateColumns: `repeat(${optimalColumns}, minmax(100px, 1fr))`,
      };

  return (
    <SortableContext items={folderContents.map((item) => item.id)} strategy={isList ? verticalListSortingStrategy : rectSortingStrategy}>
      <div
        className={layoutClass}
        data-folder-id={folderId}
        data-testid={`bookmark-content-container-${folderId}`}
        data-view-mode={viewMode}
        ref={containerRef}
        style={gridStyle}
      >
        {folderContents.map((item) => (
          <React.Fragment key={item.id}>
            <DraggableBookmarkItem isGhost={item.id === activeId} item={item} />
          </React.Fragment>
        ))}
      </div>
    </SortableContext>
  );
};
