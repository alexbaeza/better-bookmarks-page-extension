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
    <button
      data-testid={dataTestId}
      onClick={onClick}
      className="group/item w-full"
    >
      <div className="flex cursor-pointer flex-row rounded-lg bg-secondary-dark transition duration-300 ease-out group-hover/item:scale-105 group-hover/item:bg-secondary-dark-active">
        <div className="flex size-10 flex-none items-center justify-center rounded-l-lg bg-primary-dark-contrast/10">
          <div className="mx-auto text-text-secondary">
            <FolderIcon dataTestId="folder-icon" size={'sm'} />
          </div>
        </div>
        <div className="flex cursor-pointer items-center justify-center pl-3">
          <p className="line-clamp-2 break-words text-xs text-text-secondary">
            {title}
          </p>
        </div>
      </div>
    </button>
  );
};
