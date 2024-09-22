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
    <button
      data-testid={dataTestId}
      onClick={onClick}
      className="flex w-20 flex-col items-center justify-center break-all rounded-lg bg-secondary-dark p-2 transition duration-300 ease-out hover:scale-105"
    >
      <div className="flex size-16 flex-col items-center justify-center rounded-lg bg-primary-dark-contrast/10 hover:bg-secondary-dark-active">
        <FolderIcon
          className="text-text-secondary"
          dataTestId="folder-icon"
          size={'md'}
        />
      </div>
      <div className="mt-1 flex cursor-pointer items-center justify-center">
        <p className="line-clamp-2 h-8 min-h-full break-words text-xs text-text-primary">
          {title}
        </p>
      </div>
    </button>
  );
};
