import { useAtomValue } from 'jotai';
import type React from 'react';
import { memo } from 'react';

import { viewModeAtom } from '@/app/providers/atoms';
import { BookmarkGridItem } from '@/features/bookmarks/components/items/grid/BookmarkGridItem';
import { BookmarkListItem } from '@/features/bookmarks/components/items/list/BookmarkListItem';
import { SkeletonBookmarkItem } from '@/features/bookmarks/components/items/SkeletonBookmarkItem';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { BookmarkDisplayMode } from '@/shared/types/ui';

export interface BookmarkItemProps {
  item: IBookmarkItem;
  dataTestId?: string;
  isLoading?: boolean;
  onFolderClick?: (item: IBookmarkItem) => void;
}

export const BookmarkItem: React.FC<BookmarkItemProps> = memo(({ item, dataTestId, isLoading, onFolderClick }) => {
  const viewMode = useAtomValue(viewModeAtom);

  // Handle loading state
  if (isLoading || !item) {
    return <SkeletonBookmarkItem dataTestId={dataTestId} />;
  }

  if (viewMode === BookmarkDisplayMode.Grid) {
    return <BookmarkGridItem dataTestId={dataTestId} item={item} onFolderClick={onFolderClick} />;
  }

  return <BookmarkListItem dataTestId={dataTestId} item={item} onFolderClick={onFolderClick} />;
});
