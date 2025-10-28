import type React from 'react';
import { useBookmarkIcon } from '@/features/bookmarks/hooks/useBookmarkIcon';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { highlighter } from '@/features/bookmarks/lib/highlighter';

import { BaseListItem } from './BaseListItem';

export interface UnifiedListItemProps {
  dataTestId?: string;
  title: string;
  url?: string; // if present → link, else → folder
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
  onClick?: () => void; // only for folders
  onEdit: () => void;
  onDelete: () => void;
  folderId?: string; // for folders to enable dropping
}

export const BookmarkListItem: React.FC<UnifiedListItemProps> = ({
  dataTestId = 'bookmark-item',
  title,
  url,
  dragHandleProps,
  onClick,
  onEdit,
  onDelete,
  folderId,
}) => {
  const { searchTerm } = useBookmarks();
  const icon = useBookmarkIcon(url, title, 'sm');

  return (
    <BaseListItem
      dataTestId={dataTestId}
      dragHandleProps={dragHandleProps}
      folderId={folderId}
      href={url}
      icon={icon}
      onClick={url ? undefined : onClick}
      onDelete={onDelete}
      onEdit={onEdit}
    >
      {highlighter(title, searchTerm)}
    </BaseListItem>
  );
};
