import { useAtomValue } from 'jotai';
import type React from 'react';
import { useCallback } from 'react';
import { useAppStateContext } from '@/app/providers/app-state-context';
import { viewModeAtom } from '@/app/providers/atoms';
import { BookmarkGridItemDivider } from '@/features/bookmarks/components/dnd/BookmarkGridItemDivider';
import { BookmarkListItemDivider } from '@/features/bookmarks/components/dnd/BookmarkListItemDivider';
import { DraggableBookmarkItem } from '@/features/bookmarks/components/dnd/DraggableBookmarkItem';
import { useContainerWidth } from '@/features/bookmarks/hooks/useContainerWidth';
import { reorderItems } from '@/features/bookmarks/lib/bookmarks';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { BookmarkDisplayMode } from '@/shared/types/ui';
import { Grid } from '@/shared/ui/Grid';
import { List } from '@/shared/ui/List';

export interface BookmarkDisplayAreaProps {
  folderContents: IBookmarkItem[];
  folderId: string;
  onFolderClick?: (item: IBookmarkItem) => void;
}

export const BookmarkDisplayArea: React.FC<BookmarkDisplayAreaProps> = ({
  folderContents,
  folderId,
  onFolderClick,
}) => {
  const viewMode = useAtomValue(viewModeAtom);
  const isList = viewMode === BookmarkDisplayMode.List;
  const { containerWidth, containerRef } = useContainerWidth();
  const { refreshBookmarks } = useAppStateContext();

  const handleReorder = useCallback(
    async (fromIndex: number, toIndex: number) => {
      await reorderItems(folderId, fromIndex, toIndex);
      await refreshBookmarks();
    },
    [folderId, refreshBookmarks]
  );

  const renderItem = (item: IBookmarkItem, index: number) => (
    <DraggableBookmarkItem folderId={folderId} index={index} item={item} key={item.id} onFolderClick={onFolderClick} />
  );

  return (
    <div className="flex flex-col" data-view-mode={viewMode} ref={containerRef}>
      {isList ? (
        <List
          className="px-4"
          gap="xs"
          renderDivider={({ index, position, insertIndex }) => (
            <BookmarkListItemDivider
              dataTestId={`list-divider-${position}-${index}`}
              folderId={folderId}
              insertIndex={insertIndex}
              minHeight="0.5rem"
              onReorder={handleReorder}
            />
          )}
        >
          {folderContents.map((item, index) => renderItem(item, index))}
        </List>
      ) : (
        <Grid
          className="overflow-visible p-4"
          containerWidth={containerWidth}
          gap="lg"
          renderDivider={({ index, position, insertIndex }) => (
            <BookmarkGridItemDivider
              dataTestId={`grid-divider-${position}-${index}`}
              folderId={folderId}
              insertIndex={insertIndex}
              onReorder={handleReorder}
              position={position}
            />
          )}
        >
          {folderContents.map((item, index) => (
            <div key={item.id}>{renderItem(item, index)}</div>
          ))}
        </Grid>
      )}
    </div>
  );
};
