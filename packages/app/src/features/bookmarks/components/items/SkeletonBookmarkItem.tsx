import { useAtomValue } from 'jotai';
import type React from 'react';

import { viewModeAtom } from '@/app/providers/atoms';
import { BookmarkDisplayMode } from '@/shared/types/ui';
import { ItemSkeleton } from '@/shared/ui/ItemSkeleton';

export interface SkeletonBookmarkItemProps {
  dataTestId?: string;
  viewMode?: BookmarkDisplayMode;
}

export const SkeletonBookmarkItem: React.FC<SkeletonBookmarkItemProps> = ({
  dataTestId = 'bookmark-skeleton-item',
  viewMode: propViewMode,
}) => {
  const atomViewMode = useAtomValue(viewModeAtom);
  const viewMode = propViewMode ?? atomViewMode;

  if (viewMode === BookmarkDisplayMode.List) {
    return <ItemSkeleton dataTestId={dataTestId} variant="list" />;
  }

  return <ItemSkeleton dataTestId={dataTestId} variant="grid" />;
};
