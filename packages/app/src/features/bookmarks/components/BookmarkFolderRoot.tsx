import { useDraggable, useDroppable } from '@dnd-kit/core';
import type React from 'react';

import { DROPPABLE_ROOT_FOLDER_PREFIX } from '@/config/dnd-constants';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { highlighter } from '@/features/bookmarks/lib/highlighter';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

import { BookmarkContentRenderer } from '@/features/bookmarks/containers/BookmarkContentRenderer';

export interface BookmarkFolderRootProps {
  folderId: string;
  name: string;
  folderContents: IBookmarkItem[];
}

export const BookmarkFolderRoot: React.FC<BookmarkFolderRootProps> = ({ folderId, name, folderContents }) => {
  const { searchTerm } = useBookmarks();

  // System folders that shouldn't be draggable
  const isSystemFolder = name === 'Bookmarks Menu' || name === 'Bookmarks Toolbar' || name === 'Other Bookmarks';

  const { isOver, setNodeRef } = useDroppable({
    id: `${DROPPABLE_ROOT_FOLDER_PREFIX}${folderId}`,
  });

  const { setNodeRef: setDragRef, isDragging } = useDraggable({
    id: folderId,
    disabled: isSystemFolder,
  });

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        setDragRef(node);
      }}
      className={`group relative inline-block w-full
       ${isOver && 'rounded-lg outline outline-4 outline-fgColor-accent'}
       ${isDragging && 'opacity-50'}`}
    >
      <div className="mb-2 mt-3 flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2 truncate">
          <h2 className="font-base truncate text-sm uppercase leading-6 tracking-wide text-fgColor-primary">{highlighter(name, searchTerm)}</h2>
        </div>
        <span className="flex w-8 min-w-8 items-center justify-center rounded-full bg-bgColor-tertiary text-xs font-bold text-fgColor-primary" data-testid="bookmark-count">
          {folderContents.length}
        </span>
      </div>
      <div className="min-h-64 w-full overflow-visible rounded-lg border-4 border-bgColor-tertiary">
        <BookmarkContentRenderer folderContents={folderContents} folderId={folderId} />
      </div>
    </div>
  );
};
