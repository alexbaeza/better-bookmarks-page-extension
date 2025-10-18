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
    <ImageWithFallback className="size-8 rounded-sm" src={faviconUrl} fallback={getDefaultFavicon()} alt={title} />
  ) : (
    <Folder size={28} fill="currentColor" className="text-fgColor-secondary hover:text-fgColor-primary" />
  );

  return (
    <BaseGridItem dataTestId={dataTestId} url={url} onClick={onClick} onEdit={onEdit} onDelete={onDelete} dragHandleProps={dragHandleProps} icon={icon}>
      {highlighter(title, searchTerm)}
    </BaseGridItem>
  );
};
