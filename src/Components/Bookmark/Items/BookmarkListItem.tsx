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
    <a data-testid={dataTestId} href={url} className="group/item">
      <div className="flex cursor-pointer flex-row rounded-lg bg-secondary-dark transition duration-300 ease-out group-hover/item:scale-105 group-hover/item:bg-secondary-dark-active">
        <div className="flex size-10 flex-none items-center justify-center rounded-l-lg bg-primary-dark-contrast/10">
          <ImageWithFallback
            data-testid="image-with-fallback"
            className="size-6 rounded-lg"
            src={faviconFromUrl(url)}
            alt={`Bookmark item for ${title}`}
          />
        </div>
        <div className="flex cursor-pointer items-center justify-center pl-3">
          <p className="line-clamp-2 break-words text-xs text-text-secondary">
            {title}
          </p>
        </div>
      </div>
    </a>
  );
};
