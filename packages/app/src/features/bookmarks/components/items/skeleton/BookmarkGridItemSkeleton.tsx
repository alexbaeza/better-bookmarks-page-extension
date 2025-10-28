import type React from 'react';

export interface BookmarkGridItemSkeletonProps {
  dataTestId?: string;
}

export const BookmarkGridItemSkeleton: React.FC<BookmarkGridItemSkeletonProps> = ({ dataTestId = 'bookmark-skeleton-item' }) => {
  return (
    <div
      className="
				relative flex w-24 flex-col items-center gap-1
				rounded-lg bg-bgColor-secondary p-2
				animate-pulse
			"
      data-testid={dataTestId}
    >
      <div className="flex w-full flex-end justify-between">
        <div className="size-6 rounded bg-bgColor-primary/20" />
        <div className="size-6 rounded bg-bgColor-primary/20" />
      </div>

      <div className="z-0 -mt-4 flex flex-col items-center flex-1 w-full">
        <div
          className="
						bg-bgColor-tertiary-contrast flex size-14
						items-center justify-center rounded-lg
					"
        >
          <div className="size-8 rounded-sm bg-bgColor-primary/20" />
        </div>
        <div className="flex w-full h-10 flex-col space-y-1 justify-center">
          <div className="h-3 w-3/4 rounded bg-bgColor-primary/20" />
          <div className="h-3 w-full rounded bg-bgColor-primary/20" />
        </div>
      </div>
    </div>
  );
};
