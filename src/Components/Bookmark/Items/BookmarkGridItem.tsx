import React from 'react';
import { ImageWithFallback } from '../../Image/ImageWithFallback';
import { faviconFromUrl } from '../../../Data/favicon';

export type BookmarkGridItemProps = {
  dataTestId?: string;

  title: string;
  url: string;
};

export const BookmarkGridItem = ({
  dataTestId = 'bookmark-grid-item',
  title,
  url
}: BookmarkGridItemProps) => {
  return (
    <div className="flex w-20 flex-col items-center justify-center break-all rounded-lg bg-primary-dark-contrast bg-opacity-20 p-2 transition duration-300 ease-out hover:scale-105 ">
      <a data-testid={dataTestId} href={url}>
        <div className="mx-auto flex h-16 w-16 transform cursor-pointer items-center justify-center rounded-lg bg-secondary-dark  hover:bg-secondary-dark-active">
          <ImageWithFallback
            data-testid="image-with-fallback"
            className="h-12 w-12 overflow-hidden rounded-lg"
            src={faviconFromUrl(url)}
            alt={`Bookmark item for ${title}`}
          />
        </div>
      </a>
      <div className="mt-1 flex cursor-pointer items-center justify-center">
        <p className="line-clamp-2 h-8 min-h-full text-xs text-text-primary break-words">
          {title}
        </p>
      </div>
    </div>
  );
};
