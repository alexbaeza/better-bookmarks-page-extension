import type React from 'react';
import { useCallback, useLayoutEffect, useRef } from 'react';
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
  onHeightChange?: (folderId: string, height: number) => void;
}

export const BookmarkMasonryColumn: React.FC<BookmarkMasonryColumnProps> = ({
  folderId,
  name,
  folderContents = [],
  onHeightChange,
}) => {
  const { searchTerm } = useBookmarks();
  const { move } = useBookmarkActions();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const handleDrop = useCallback(
    async (draggedItemId: string, _fromFolderId: string, _fromIndex: number) => {
      // Move bookmark to this folder
      await move(draggedItemId, { parentId: folderId });
    },
    [folderId, move]
  );

  useLayoutEffect(() => {
    if (!onHeightChange) return;
    const element = containerRef.current;
    if (!element) return;

    const reportHeight = () => {
      const height = element.getBoundingClientRect().height;
      onHeightChange(folderId, height);
    };

    reportHeight();

    if (typeof ResizeObserver === 'undefined') {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      if (!Array.isArray(entries) || entries.length === 0) return;
      const entry = entries[0];
      onHeightChange(folderId, entry.contentRect.height);
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [folderId, onHeightChange]);

  return (
    <div className="group relative w-full" ref={containerRef}>
      <div className="mb-2 mt-3 flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2 truncate">
          <Text as="h2" className="leading-6 tracking-wide uppercase" color="primary" lineClamp={1} size="sm" truncate>
            {highlighter(name, searchTerm)}
          </Text>
        </div>
        <Badge dataTestId={`bookmark-count-${folderId}`} size="base" variant="secondary">
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
