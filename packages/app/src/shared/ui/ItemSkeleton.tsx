import type React from 'react';

export type ItemSkeletonVariant = 'grid' | 'list';

export interface ItemSkeletonProps {
  variant: ItemSkeletonVariant;
  dataTestId?: string;
}

export const ItemSkeleton: React.FC<ItemSkeletonProps> = ({ variant, dataTestId = 'bookmark-skeleton-item' }) => {
  const isGrid = variant === 'grid';

  return (
    <div
      className={`
        animate-pulse
        ${isGrid ? 'w-24 flex-col items-center gap-1 rounded-lg p-2' : 'h-12 w-full rounded-lg'}
        bg-bgColor-secondary
      `}
      data-testid={dataTestId}
    >
      {isGrid ? (
        <>
          <div className="flex w-full flex-end justify-between">
            <div className="size-6 rounded bg-bgColor-primary/20" />
            <div className="size-6 rounded bg-bgColor-primary/20" />
          </div>

          <div className="z-0 -mt-4 flex flex-col items-center flex-1 w-full">
            <div className="bg-bgColor-secondary/50 flex size-14 items-center justify-center rounded-lg">
              <div className="size-8 rounded-sm bg-bgColor-primary/20" />
            </div>
            <div className="flex w-full h-10 flex-col space-y-1 justify-center">
              <div className="h-3 w-3/4 rounded bg-bgColor-primary/20" />
              <div className="h-3 w-full rounded bg-bgColor-primary/20" />
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="bg-bgColor-secondary-contrast flex h-full w-12 flex-none items-center justify-center rounded-l-lg p-2">
            <div className="size-6 rounded-lg bg-bgColor-primary/20" />
          </div>

          <div className="flex flex-1 flex-col justify-center space-y-1 px-3">
            <div className="h-4 w-3/4 rounded bg-bgColor-primary/20" />
            <div className="h-4 w-1/2 rounded bg-bgColor-primary/20" />
          </div>
        </>
      )}
    </div>
  );
};
