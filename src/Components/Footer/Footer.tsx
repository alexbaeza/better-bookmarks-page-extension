import React from 'react';
import { HeartIcon } from '../IconButton/Icons/Icons';

export const Footer = ({
  classname = 'justify-end'
}: {
  classname?: string;
}) => {
  return (
    <>
      <div
        data-testid="built-with"
        className={`flex w-full flex-row text-xs text-text-primary ${classname}`}
      >
        {'Built with '}
        <span data-testid="heart-icon" className="mx-1 text-red-600">
          <HeartIcon />
        </span>
        {'by'}
        <a
          data-testid="author-link"
          className="text-primary ml-1 font-bold"
          href={'https://github.com/alexbaeza/better-bookmarks-page-extension'}
        >
          alexbaeza.
        </a>
      </div>
    </>
  );
};
