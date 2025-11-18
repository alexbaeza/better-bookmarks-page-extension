import type React from 'react';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useContainerWidth } from '@/features/bookmarks/hooks/useContainerWidth';
import type { MasonryColumn } from '@/features/bookmarks/hooks/useMasonryLayout';
import { useMasonryLayout } from '@/features/bookmarks/hooks/useMasonryLayout';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { BookmarkMasonryColumn } from './BookmarkMasonryColumn';

export interface BookmarkMasonryLayoutProps {
  folders: IBookmarkItem[];
}

// Constants for height estimation and threshold calculation
const BASE_FOLDER_HEIGHT = 180; // header + padding
const PER_CHILD_HEIGHT = 56; // approx height per bookmark card
const HEIGHT_CHANGE_THRESHOLD = PER_CHILD_HEIGHT; // Ignore changes less than one item height

export const BookmarkMasonryLayout: React.FC<BookmarkMasonryLayoutProps> = ({ folders }) => {
  const { containerWidth, containerRef } = useContainerWidth();
  const [folderHeights, setFolderHeights] = useState<Record<string, number>>({});
  const folderHeightsRef = useRef(folderHeights);

  // Keep ref in sync with state
  folderHeightsRef.current = folderHeights;

  // Calculate column count based on container width
  const columnCount = useMemo(() => {
    // Default to a reasonable width if containerWidth is 0
    const width = containerWidth || 1200;
    // Match Tailwind breakpoints: sm:640, md:768, lg:1024, 2xl:1536
    if (width >= 1536) return 4; // 2xl
    if (width >= 1024) return 4; // lg
    if (width >= 768) return 3; // md
    if (width >= 640) return 3; // sm
    return 1; // default
  }, [containerWidth]);

  const estimateFolderHeight = useCallback((folder: IBookmarkItem) => {
    const childCount = folder.children?.length ?? 0;
    return BASE_FOLDER_HEIGHT + childCount * PER_CHILD_HEIGHT;
  }, []);

  const handleHeightChange = useCallback((id: string, height: number) => {
    const current = folderHeightsRef.current[id];
    // Skip update if change is insignificant (< 1 item height difference)
    // This prevents unnecessary re-renders from minor measurement variations
    if (current !== undefined && Math.abs(current - height) < HEIGHT_CHANGE_THRESHOLD) {
      return; // Don't call setState at all
    }
    setFolderHeights((prev) => ({ ...prev, [id]: height }));
  }, []);

  const getItemHeight = useCallback(
    (folder: IBookmarkItem) => folderHeights[folder.id] ?? estimateFolderHeight(folder),
    [folderHeights, estimateFolderHeight]
  );

  // Use masonry layout to distribute folders across columns
  const masonryColumns = useMasonryLayout(
    folders,
    {
      columnCount,
      gap: 16, // 1rem = 16px
    },
    getItemHeight
  );

  // Get Tailwind grid column classes for responsive breakpoints
  // Ensure all columns have equal width by always rendering all columns
  const gridColsClass = useMemo(() => {
    // Use responsive classes: default 1, md:1, lg:3, 2xl:4
    return 'grid grid-cols-1 lg:grid-cols-3 2xl:grid-cols-4 gap-4';
  }, []);

  // Ensure we always have the correct number of column containers, even if empty
  // This guarantees equal width columns
  const columns = useMemo(() => {
    const result: MasonryColumn<IBookmarkItem>[] = [];
    for (let i = 0; i < columnCount; i++) {
      const existingColumn = masonryColumns[i];
      result.push(
        existingColumn ?? {
          items: [],
          key: `column-${i}`,
        }
      );
    }
    return result;
  }, [masonryColumns, columnCount]);

  if (folders.length <= 1) {
    return (
      <div className="w-full p-4" data-testid="bookmark-masonry-wrapper">
        {folders.map((folder) => (
          <BookmarkMasonryColumn
            folderContents={folder.children ?? []}
            folderId={folder.id}
            key={String(folder.id)}
            name={folder.title}
            onHeightChange={handleHeightChange}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full p-4" data-testid="bookmark-masonry-wrapper" ref={containerRef}>
      <div className={gridColsClass} data-testid="bookmark-masonry-grid">
        {columns.map((column) => (
          <div
            className="flex min-w-0 flex-col gap-4"
            data-testid={`masonry-grid-column-${column.key}`}
            key={column.key}
          >
            {column.items.map((folder) => (
              <BookmarkMasonryColumn
                folderContents={folder.children ?? []}
                folderId={folder.id}
                key={String(folder.id)}
                name={folder.title}
                onHeightChange={handleHeightChange}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
