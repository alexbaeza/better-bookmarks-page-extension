import React from 'react';
import { ImageWithFallback } from '../../Image/ImageWithFallback';
import { faviconFromUrl } from '../../../Data/favicon';

export type BookmarkListItemProps = {
  dataTestId?: string;

  title: string;
  url: string;
};

export const BookmarkListItem = ({
  dataTestId = 'bookmark-list-item',
  title,
  url
}: BookmarkListItemProps) => {
  return (
    <a data-testid={dataTestId} href={url}>
      <div className="flex cursor-pointer flex-row rounded-lg bg-secondary-dark transition duration-300 ease-out hover:scale-105 hover:bg-secondary-dark-active">
        <div className="flex h-10 w-10 flex-none transform items-center justify-center rounded-l-lg bg-primary-dark-contrast bg-opacity-20">
          <ImageWithFallback
            data-testid="image-with-fallback"
            className="h-6 w-6 rounded-lg"
            src={faviconFromUrl(url)}
            alt={`Bookmark item for ${title}`}
          />
        </div>
        <div className="flex cursor-pointer items-center justify-center pl-3">
          <p className="line-clamp-2 text-xs text-text-secondary">{title}</p>
        </div>
      </div>
    </a>
  );
};
