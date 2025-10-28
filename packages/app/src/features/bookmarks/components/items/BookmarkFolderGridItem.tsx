import { useDroppable } from '@dnd-kit/core';
import { Folder } from 'lucide-react';
import type React from 'react';

import { DROPPABLE_ROOT_FOLDER_PREFIX } from '@/config/dnd-constants';
import { BookmarkDragHandle } from './BookmarkDragHandle';
import { BookmarkGridItemContent } from './BookmarkGridItemContent';

interface BookmarkFolderGridItemProps {
  title: string;
  folderId: string;
  onClick: () => void;
  dataTestId?: string;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}

export const BookmarkFolderGridItem: React.FC<BookmarkFolderGridItemProps> = ({
  title,
  folderId,
  onClick,
  dataTestId = 'bookmark-folder-grid-item',
  dragHandleProps,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: `${DROPPABLE_ROOT_FOLDER_PREFIX}${folderId}`,
    disabled: false,
  });

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onClick();
    }
  };

  return (
    <div className={isOver ? 'ring-2 ring-fgColor-accent rounded-lg' : ''} ref={setNodeRef}>
      <div data-testid={dataTestId} onClick={onClick} onKeyDown={handleKeyDown} role="button" tabIndex={0}>
        <BookmarkGridItemContent
          dragHandle={<BookmarkDragHandle className="p-2 min-w-[24px] min-h-[24px] text-xs" hovered={false} size={12} variant="grid" />}
          dragHandleProps={dragHandleProps}
          icon={<Folder className="text-fgColor-secondary hover:text-fgColor-primary" data-testid="folder-icon" fill="currentColor" size={28} />}
        >
          {title}
        </BookmarkGridItemContent>
      </div>
    </div>
  );
};
