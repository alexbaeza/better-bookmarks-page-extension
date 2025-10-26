import { Folder } from 'lucide-react';
import type React from 'react';

import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { useFavicon } from '@/features/bookmarks/hooks/useFavicon';
import { getDefaultFavicon } from '@/features/bookmarks/lib/browser/utils/default-favicon';
import { highlighter } from '@/features/bookmarks/lib/highlighter';
import { ImageWithFallback } from '@/shared/ui/ImageWithFallback';

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

export const BookmarkGridItem: React.FC<GridItemProps> = (props) => {
  const { title, url, dataTestId, onClick, onEdit, onDelete, dragHandleProps } = props;
  const { searchTerm } = useBookmarks();
  const faviconUrl = useFavicon(url);

  const icon = url ? (
    <ImageWithFallback alt={title} className="size-8 rounded-sm" fallback={getDefaultFavicon()} src={faviconUrl} />
  ) : (
    <Folder className="text-fgColor-secondary hover:text-fgColor-primary" fill="currentColor" size={28} />
  );

  return (
    <BaseGridItem dataTestId={dataTestId} dragHandleProps={dragHandleProps} icon={icon} onClick={onClick} onDelete={onDelete} onEdit={onEdit} url={url}>
      {highlighter(title, searchTerm)}
    </BaseGridItem>
  );
};
