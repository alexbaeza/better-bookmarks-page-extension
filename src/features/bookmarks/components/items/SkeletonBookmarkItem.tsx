import { useAtomValue } from 'jotai';
import type React from 'react';

import { viewModeAtom } from '@/app/providers/atoms';
import { BookmarkDisplayMode } from '@/shared/types/ui';

export interface SkeletonBookmarkItemProps {
  dataTestId?: string;
  viewMode?: BookmarkDisplayMode;
}

export const SkeletonBookmarkItem: React.FC<SkeletonBookmarkItemProps> = ({ dataTestId = 'bookmark-skeleton-item', viewMode: propViewMode }) => {
  const atomViewMode = useAtomValue(viewModeAtom);
  const viewMode = propViewMode ?? atomViewMode;

  if (viewMode === BookmarkDisplayMode.List) {
    return (
      <div
        data-testid={dataTestId}
        className="
          relative flex h-12 w-full animate-pulse
          overflow-visible rounded-lg bg-bgColor-secondary
        "
      >
        {/* Icon panel skeleton */}
        <div
          className="
            bg-bgColor-secondary-contrast flex h-full w-12 flex-none items-center
            justify-center rounded-l-lg p-2
          "
        >
          <div className="size-6 rounded-lg bg-bgColor-primary/20" />
        </div>

        {/* Text lines skeleton */}
        <div className="flex flex-1 flex-col justify-center space-y-1 px-3">
          <div className="h-4 w-3/4 rounded bg-bgColor-primary/20" />
          <div className="h-4 w-1/2 rounded bg-bgColor-primary/20" />
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid={dataTestId}
      className="
          relative flex w-24 animate-pulse flex-col
          items-center gap-1 rounded-lg
          bg-bgColor-secondary p-2 break-inside-avoid
        "
    >
      {/* Top row: Drag handle and options skeleton */}
      <div className="flex w-full justify-between">
        {/* Drag handle skeleton */}
        <div className="size-6 rounded bg-bgColor-primary/20" />

        {/* Options button skeleton */}
        <div className="size-6 rounded bg-bgColor-primary/20" />
      </div>

      {/* Icon panel skeleton (same size as real icon wrapper) */}
      <div
        className="
            bg-bgColor-tertiary-contrast flex size-14
            items-center justify-center rounded-lg mb-2
          "
      >
        <div className="size-8 rounded-sm bg-bgColor-primary/20" />
      </div>

      {/* Text skeleton: same height as two lines of real text */}
      <div className="flex w-full flex-col space-y-1">
        <div className="h-3 w-3/4 rounded bg-bgColor-primary/20" />
        <div className="h-3 w-full rounded bg-bgColor-primary/20" />
      </div>
    </div>
  );
};
