import type React from 'react';
import { memo } from 'react';
import { useBookmarkDrag } from '@/features/bookmarks/hooks/useBookmarkDrag';
import { useBookmarkIcon } from '@/features/bookmarks/hooks/useBookmarkIcon';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { highlighter } from '@/features/bookmarks/lib/highlighter';

import type { IBookmarkItem } from '@/shared/types/bookmarks';

export interface BookmarkItemProps {
  item: IBookmarkItem;
  dataTestId?: string;
  children?: React.ReactNode;
}

interface BookmarkItemComponent extends React.FC<BookmarkItemProps> {
  Icon: React.FC<{ item: IBookmarkItem; size?: 'sm' | 'md' | 'lg' }>;
  Title: React.FC<{ item: IBookmarkItem; highlighted?: boolean }>;
  Actions: React.FC<{ onEdit?: () => void; onDelete?: () => void }>;
  DragHandle: React.FC<{ item: IBookmarkItem }>;
}

const BookmarkItemRoot = memo<BookmarkItemProps>(({ item, dataTestId, children }) => {
  const { dragProps } = useBookmarkDrag({ item });

  return (
    <div {...dragProps} data-testid={dataTestId}>
      {children}
    </div>
  );
});

const BookmarkItemIcon = memo<{ item: IBookmarkItem; size?: 'sm' | 'md' | 'lg' }>(({ item, size = 'md' }) => {
  const icon = useBookmarkIcon(item.url, item.title, size);
  return <div data-testid="favicon">{icon}</div>;
});

const BookmarkItemTitle = memo<{ item: IBookmarkItem; highlighted?: boolean }>(({ item, highlighted = true }) => {
  const { searchTerm } = useBookmarks();

  if (highlighted) {
    return <span>{highlighter(item.title, searchTerm)}</span>;
  }

  return <span>{item.title}</span>;
});

const BookmarkItemActions = memo<{ onEdit?: () => void; onDelete?: () => void }>(({ onEdit, onDelete }) => {
  return (
    <div className="flex gap-1">
      {onEdit && (
        <button aria-label="Edit bookmark" onClick={onEdit} type="button">
          Edit
        </button>
      )}
      {onDelete && (
        <button aria-label="Delete bookmark" onClick={onDelete} type="button">
          Delete
        </button>
      )}
    </div>
  );
});

const BookmarkItemDragHandle = memo<{ item: IBookmarkItem }>(({ item }) => {
  const { dragHandleProps } = useBookmarkDrag({ item });

  return (
    <div {...dragHandleProps} className="cursor-grab" role="button" tabIndex={0}>
      <span>⋮⋮</span>
    </div>
  );
});

// Compound component pattern
const BookmarkItem: BookmarkItemComponent = Object.assign(BookmarkItemRoot, {
  Icon: BookmarkItemIcon,
  Title: BookmarkItemTitle,
  Actions: BookmarkItemActions,
  DragHandle: BookmarkItemDragHandle,
});

export { BookmarkItem };
