import type React from 'react';
import { useMemo } from 'react';
import { useContainerWidth } from '@/features/bookmarks/hooks/useContainerWidth';
import type { MasonryColumn } from '@/features/bookmarks/hooks/useMasonryLayout';
import { useMasonryLayout } from '@/features/bookmarks/hooks/useMasonryLayout';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { BookmarkMasonryColumn } from './BookmarkMasonryColumn';

export interface BookmarkMasonryLayoutProps {
  folders: IBookmarkItem[];
}

export const BookmarkMasonryLayout: React.FC<BookmarkMasonryLayoutProps> = ({ folders }) => {
  const { containerWidth, containerRef } = useContainerWidth();

  // Calculate column count based on container width
  const columnCount = useMemo(() => {
    // Default to a reasonable width if containerWidth is 0
    const width = containerWidth || 1200;
    // Match Tailwind breakpoints: sm:640, md:768, lg:1024, 2xl:1536
    if (width >= 1536) return 4; // 2xl
    if (width >= 1024) return 4; // lg
    if (width >= 768) return 2; // md
    if (width >= 640) return 1; // sm
    return 1; // default
  }, [containerWidth]);

  // Use masonry layout to distribute folders across columns
  const masonryColumns = useMasonryLayout(folders, {
    columnCount,
    gap: 16, // 1rem = 16px
  });

  // Get Tailwind grid column classes for responsive breakpoints
  // Ensure all columns have equal width by always rendering all columns
  const gridColsClass = useMemo(() => {
    // Use responsive classes: default 1, md:2, lg:3, 2xl:4
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4';
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
      <div className="w-full p-4">
        {folders.map((folder) => (
          <BookmarkMasonryColumn
            folderContents={folder.children ?? []}
            folderId={folder.id}
            key={String(folder.id)}
            name={folder.title}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="w-full p-4" ref={containerRef}>
      <div className={gridColsClass}>
        {columns.map((column) => (
          <div className="flex min-w-0 flex-col gap-4" key={column.key}>
            {column.items.map((folder) => (
              <BookmarkMasonryColumn
                folderContents={folder.children ?? []}
                folderId={folder.id}
                key={String(folder.id)}
                name={folder.title}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
