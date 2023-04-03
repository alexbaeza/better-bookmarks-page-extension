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
    <a data-testid={dataTestId} href={url}>
      <div className="mx-auto flex h-16 w-16 transform cursor-pointer items-center justify-center rounded-lg bg-secondary-dark transition duration-300 ease-out hover:scale-105">
        <ImageWithFallback
          data-testid="image-with-fallback"
          className="h-12 w-12 overflow-hidden rounded-lg"
          src={faviconFromUrl(url)}
          alt={`Bookmark item for ${title}`}
        />
      </div>
      <div className="flex cursor-pointer items-center justify-center">
        <p className="text-xs text-text-primary line-clamp-2">{title}</p>
      </div>
    </a>
  );
};
