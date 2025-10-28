import type React from 'react';

export interface BookmarkListItemSkeletonProps {
  dataTestId?: string;
}

export const BookmarkListItemSkeleton: React.FC<BookmarkListItemSkeletonProps> = ({ dataTestId = 'bookmark-skeleton-item' }) => {
  return (
    <div
      className="
				relative flex h-12 w-full animate-pulse
				overflow-visible rounded-lg bg-bgColor-secondary
			"
      data-testid={dataTestId}
    >
      <div
        className="
					bg-bgColor-secondary-contrast flex h-full w-12 flex-none items-center
					justify-center rounded-l-lg p-2
				"
      >
        <div className="size-6 rounded-lg bg-bgColor-primary/20" />
      </div>

      <div className="flex flex-1 flex-col justify-center space-y-1 px-3">
        <div className="h-4 w-3/4 rounded bg-bgColor-primary/20" />
        <div className="h-4 w-1/2 rounded bg-bgColor-primary/20" />
      </div>
    </div>
  );
};
