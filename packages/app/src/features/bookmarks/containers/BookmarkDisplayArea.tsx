import { useAtomValue } from 'jotai';
import type React from 'react';

import { viewModeAtom } from '@/app/providers/atoms';
import { BookmarkItemDraggable } from '@/features/bookmarks/containers/BookmarkItemDraggable';
import { useContainerWidth } from '@/features/bookmarks/hooks/useContainerWidth';
import { useOptimalColumns } from '@/features/bookmarks/hooks/useOptimalColumns';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { BookmarkDisplayMode } from '@/shared/types/ui';
import { SortableBookmarkList } from '@/shared/ui/SortableBookmarkList';

export interface BookmarkDisplayAreaProps {
  folderContents: IBookmarkItem[];
  folderId: string;
}

export const BookmarkDisplayArea: React.FC<BookmarkDisplayAreaProps> = ({ folderContents, folderId }) => {
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

  const renderItem = (item: IBookmarkItem, isDragging?: boolean) => <BookmarkItemDraggable isDragging={isDragging} item={item} />;

  return (
    <div ref={containerRef}>
      <SortableBookmarkList className={layoutClass} folderId={folderId} items={folderContents} renderItem={renderItem} style={gridStyle} />
    </div>
  );
};
