import React from 'react';
import { HeartIcon } from '../IconButton/icons/Icons';

export const Footer = () => {
  return (
    <>
      <div
        data-testid="built-with"
        className="flex w-full flex-row justify-end text-xs text-custom-text-primary"
      >
        {'Built with '}
        <span data-testid="heart-icon" className="mx-1 text-red-600">
          <HeartIcon />
        </span>
        {'by'}
        <a
          data-testid="author-link"
          className="ml-1 text-custom-primary"
          href={'https://github.com/alexbaeza/better-bookmarks-page-extension'}
        >
          alexbaeza.
        </a>
      </div>
    </>
  );
};
