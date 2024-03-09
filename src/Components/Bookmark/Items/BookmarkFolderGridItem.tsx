import React from 'react';
import { FolderIcon } from '../../IconButton/Icons/Icons';

export interface BookmarkFolderGridItemProps {
  onClick: () => void;
  title: string;
  dataTestId?: string;
}

export const BookmarkFolderGridItem = ({
  dataTestId,
  onClick,
  title
}: BookmarkFolderGridItemProps) => {
  return (
    <div className="flex w-20 flex-col items-center justify-center break-all rounded-lg bg-primary-dark-contrast bg-opacity-20 p-2 transition duration-300 ease-out hover:scale-105">
      <button data-testid={dataTestId} onClick={onClick}>
        <div className="flex h-16 w-16 flex-col items-center justify-center rounded-lg bg-secondary-dark hover:bg-secondary-dark-active">
          <FolderIcon
            className="text-text-secondary"
            dataTestId="folder-icon"
            size={'md'}
          />
        </div>
      </button>
      <div className="mt-1 flex cursor-pointer items-center justify-center">
        <p className="line-clamp-2 h-8 min-h-full text-xs text-text-primary break-normal">
          {title}
        </p>
      </div>
    </div>
  );
};
