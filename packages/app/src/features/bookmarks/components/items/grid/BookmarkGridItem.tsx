import type React from 'react';
import { memo } from 'react';
import { useBookmarkIcon } from '@/features/bookmarks/hooks/useBookmarkIcon';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { highlighter } from '@/features/bookmarks/lib/highlighter';

import { BaseGridItem } from './BaseGridItem';

export interface GridItemProps {
  dataTestId?: string;
  title: string;
  url?: string;
  onClick?: () => void; // Only for folders
  onEdit: () => void;
  onDelete: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}

export const BookmarkGridItem = memo<GridItemProps>((props) => {
  const { title, url, dataTestId, onClick, onEdit, onDelete, dragHandleProps } = props;
  const { searchTerm } = useBookmarks();
  const icon = useBookmarkIcon(url, title, 'md');

  return (
    <BaseGridItem dataTestId={dataTestId} dragHandleProps={dragHandleProps} icon={icon} onClick={onClick} onDelete={onDelete} onEdit={onEdit} url={url}>
      {highlighter(title, searchTerm)}
    </BaseGridItem>
  );
});
