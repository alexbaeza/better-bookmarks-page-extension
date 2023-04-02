import React from 'react';
import { FolderIcon } from '../../IconButton/Icons/Icons';

export interface BookmarkFolderItemProps {
  onClick: () => void;
  title: string;
  dataTestId?: string;
}

export const BookmarkFolderListItem = ({
  dataTestId,
  onClick,
  title
}: BookmarkFolderItemProps) => {
  return (
    <button data-testid={dataTestId} onClick={onClick} className="w-full">
      <div className="flex cursor-pointer flex-row rounded-lg bg-secondary-dark transition duration-300 ease-out hover:scale-105 hover:bg-secondary-dark-active">
        <div className="flex h-10 w-10 flex-none transform items-center justify-center rounded-lg bg-secondary-dark">
          <div className="mx-auto text-text-secondary">
            <FolderIcon dataTestId="folder-icon" size={'sm'} />
          </div>
        </div>
        <div className="flex cursor-pointer items-center justify-center pl-3">
          <p className="text-xs text-text-primary line-clamp-2">{title}</p>
        </div>
      </div>
    </button>
  );
};
