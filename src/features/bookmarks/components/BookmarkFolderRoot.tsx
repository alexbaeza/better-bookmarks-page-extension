import { useDraggable, useDroppable } from '@dnd-kit/core';
import { GripVertical } from 'lucide-react';
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

  const { isOver, setNodeRef } = useDroppable({
    id: `${DROPPABLE_ROOT_FOLDER_PREFIX}${folderId}`,
  });

  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    isDragging,
  } = useDraggable({
    id: folderId,
  });

  return (
    <div
      ref={(node) => {
        setNodeRef(node);
        setDragRef(node);
      }}
      className={`group relative inline-block w-full break-inside-avoid
       ${isOver && 'rounded-lg outline outline-4 outline-fgColor-accent'}
       ${isDragging && 'opacity-50'}`}
    >
      <div className="mb-2 mt-3 flex items-center justify-between space-x-2">
        <div className="flex items-center space-x-2 truncate">
          <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-fgColor-secondary hover:text-fgColor-primary">
            <GripVertical size={16} />
          </div>
          <h2 className="font-base truncate text-sm uppercase leading-6 tracking-wide text-fgColor-primary">{highlighter(name, searchTerm)}</h2>
        </div>
        <span className="flex w-8 min-w-8 items-center justify-center rounded-full bg-bgColor-tertiary text-xs font-bold text-fgColor-primary">
          {folderContents.length}
        </span>
      </div>
      <div className="min-h-64 w-full overflow-visible rounded-lg border-4 border-bgColor-tertiary">
        <BookmarkContentRenderer folderContents={folderContents} folderId={folderId} />
      </div>
    </div>
  );
};
