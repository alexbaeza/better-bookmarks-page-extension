import React from 'react';
import { FolderIcon } from '../../IconButton/Icons/Icons';

export interface BookmarkFolderItemProps {
  onClick: () => void;
  name: string;
  dataTestId?: string;
}

export const BookmarkFolderItem = ({
  dataTestId,
  onClick,
  name
}: BookmarkFolderItemProps) => {
  return (
    <>
      <button
        data-testid={dataTestId}
        onClick={onClick}
        className="mx-auto flex h-16 w-16 transform cursor-pointer items-center justify-center rounded-lg bg-slate-700 transition duration-300 ease-out hover:scale-105"
      >
        <div className="mx-auto text-custom-text-primary">
          <FolderIcon dataTestId="folder-icon" size={'md'} />
        </div>
      </button>
      <div className="flex cursor-pointer items-center justify-center">
        <p className="text-xs text-custom-text-primary line-clamp-2">{name}</p>
      </div>
    </>
  );
};
