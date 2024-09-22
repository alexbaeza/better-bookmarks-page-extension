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
    <div className="group/item flex w-20 flex-col items-center justify-center break-all rounded-lg bg-secondary-dark p-2 transition duration-300 ease-out hover:scale-105 hover:bg-secondary-dark-active ">
      <a data-testid={dataTestId} href={url}>
        <div className="mx-auto flex size-16 cursor-pointer items-center justify-center rounded-lg bg-primary-dark-contrast bg-opacity-10 group-hover/item:bg-primary-dark-active">
          <ImageWithFallback
            data-testid="image-with-fallback"
            className="size-12 overflow-hidden rounded-lg"
            src={faviconFromUrl(url)}
            alt={`Bookmark item for ${title}`}
          />
        </div>
      </a>
      <div className="mt-1 flex cursor-pointer items-center justify-center">
        <p className="line-clamp-2 h-8 min-h-full break-words text-xs text-text-primary">
          {title}
        </p>
      </div>
    </div>
  );
};
