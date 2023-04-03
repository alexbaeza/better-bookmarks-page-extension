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
    <div>
      <button data-testid={dataTestId} onClick={onClick}>
        <div className="flex h-16 w-16 cursor-pointer flex-col items-center justify-center rounded-lg bg-secondary-dark transition duration-300 ease-out hover:scale-105 hover:bg-secondary-dark-active">
          <FolderIcon
            className="text-text-secondary"
            dataTestId="folder-icon"
            size={'md'}
          />
        </div>
      </button>
      <div className="flex cursor-pointer items-center justify-center">
        <p className="text-xs text-text-primary line-clamp-2">{title}</p>
      </div>
    </div>
  );
};
