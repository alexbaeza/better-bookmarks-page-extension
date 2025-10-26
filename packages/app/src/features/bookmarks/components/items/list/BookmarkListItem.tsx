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
      alt={`favicon for ${title}`}
      className="size-6 rounded-sm border border-none"
      data-testid="favicon"
      fallback={getDefaultFavicon()}
      src={faviconUrl}
    />
  ) : (
    <Folder className="text-fgColor-secondary" size={16} />
  );

  return (
    <BaseListItem
      dataTestId={dataTestId}
      dragHandleProps={dragHandleProps}
      href={url}
      icon={icon}
      onClick={url ? undefined : onClick}
      onDelete={onDelete}
      onEdit={onEdit}
    >
      <p className="line-clamp-2 break-words text-xs text-fgColor-secondary">{highlighter(title, searchTerm)}</p>
    </BaseListItem>
  );
};
