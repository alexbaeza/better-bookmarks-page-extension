import { Folder } from 'lucide-react';
import type React from 'react';

import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { useFavicon } from '@/features/bookmarks/hooks/useFavicon';
import { getDefaultFavicon } from '@/features/bookmarks/lib/browser/utils/default-favicon';
import { highlighter } from '@/features/bookmarks/lib/highlighter';
import { ImageWithFallback } from '@/shared/ui/ImageWithFallback';

import { BaseListItem } from './BaseListItem';

export interface UnifiedListItemProps {
  dataTestId?: string;
  title: string;
  url?: string; // if present → link, else → folder
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
  onClick?: () => void; // only for folders
  onEdit: () => void;
  onDelete: () => void;
}

export const BookmarkListItem: React.FC<UnifiedListItemProps> = ({ dataTestId = 'bookmark-item', title, url, dragHandleProps, onClick, onEdit, onDelete }) => {
  const { searchTerm } = useBookmarks();
  const faviconUrl = useFavicon(url);

  const icon = url ? (
    <ImageWithFallback
      data-testid="favicon"
      className="size-6 rounded-sm border border-none"
      src={faviconUrl}
      fallback={getDefaultFavicon()}
      alt={`favicon for ${title}`}
    />
  ) : (
    <Folder size={16} className="text-fgColor-secondary" />
  );

  return (
    <BaseListItem
      dataTestId={dataTestId}
      href={url}
      onClick={url ? undefined : onClick}
      dragHandleProps={dragHandleProps}
      onEdit={onEdit}
      onDelete={onDelete}
      icon={icon}
    >
      <p className="line-clamp-2 break-words text-xs text-fgColor-secondary">{highlighter(title, searchTerm)}</p>
    </BaseListItem>
  );
};
