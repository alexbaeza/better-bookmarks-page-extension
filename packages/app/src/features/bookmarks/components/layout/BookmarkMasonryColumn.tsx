import type React from 'react';
import { useCallback } from 'react';
import { BookmarkFolderContainer } from '@/features/bookmarks/components/BookmarkFolderContainer';
import { DroppableFolder } from '@/features/bookmarks/components/dnd/DroppableFolder';
import { BookmarkDisplayArea } from '@/features/bookmarks/containers/BookmarkDisplayArea';
import { useBookmarkActions } from '@/features/bookmarks/hooks/useBookmarkActions';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { highlighter } from '@/features/bookmarks/lib/highlighter';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { Badge } from '@/shared/ui/Badge';
import { Text } from '@/shared/ui/Text';

export interface BookmarkMasonryColumnProps {
  folderId: string;
  name: string;
  folderContents?: IBookmarkItem[];
}

export const BookmarkMasonryColumn: React.FC<BookmarkMasonryColumnProps> = ({
  folderId,
  name,
  folderContents = [],
}) => {
  const { searchTerm } = useBookmarks();
  const { move } = useBookmarkActions();

  const handleDrop = useCallback(
    async (draggedItemId: string, _fromFolderId: string, _fromIndex: number) => {
      // Move bookmark to this folder
      await move(draggedItemId, { parentId: folderId });
    },
    [folderId, move]
  );

  return (
    <div className="group relative w-full">
      <div className="mb-2 mt-3 flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2 truncate">
          <Text as="h2" className="leading-6 tracking-wide uppercase" color="primary" lineClamp={1} size="sm" truncate>
            {highlighter(name, searchTerm)}
          </Text>
        </div>
        <Badge dataTestId={`bookmark-count-${folderId}`} size="base">
          {folderContents.length}
        </Badge>
      </div>
      <DroppableFolder folderId={folderId} onDrop={handleDrop}>
        <BookmarkFolderContainer overflowVisible>
          <BookmarkDisplayArea folderContents={folderContents} folderId={folderId} />
        </BookmarkFolderContainer>
      </DroppableFolder>
    </div>
  );
};
