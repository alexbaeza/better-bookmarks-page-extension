import React from 'react';
import { BookmarkFolderModal } from './BookmarkFolderModal';
import { useAtomValue } from 'jotai';
import { viewModeAtom } from '../../Context/atoms';
import { BookmarkItem } from './Items/BookmarkItem';
import { BookmarkDisplayMode, BookmarkType } from '../../types.d';

export interface IBookmarkItem {
  id: string;
  title: string;
  index?: number;
  dateAdded?: number;
  dateGroupModified?: number;
  parentId?: string;
  children?: IBookmarkItem[];
  url?: string;
}

export interface BookmarkFolderRootProps {
  name: string;
  folderContents: IBookmarkItem[];
}

export const BookmarkFolderRoot = ({
  name,
  folderContents
}: BookmarkFolderRootProps) => {
  const viewMode = useAtomValue(viewModeAtom);

  if (!folderContents.length) {
    return <></>;
  }

  const items = folderContents.map((content, key) => {
    if (content.children) {
      return (
        <BookmarkFolderModal
          dataTestId={`bookmark-folder-content-modal-${key}`}
          key={`bookmark-folder-content-modal-${content.id}`}
          title={content.title}
          folderContents={content.children}
        />
      );
    } else if (content.url) {
      return (
        <BookmarkItem
          dataTestId={`bookmark-item-${key}`}
          key={`bookmark-item-${key}`}
          title={content.title}
          url={content?.url}
          type={BookmarkType.Item}
        />
      );
    }
    return null;
  });

  return (
    <div className="group relative inline-block w-full px-1 py-6">
      <div className="mb-2 mt-3 flex">
        <div className="font-base mr-2 text-sm uppercase leading-6 tracking-wide text-text-primary">
          {name}
        </div>
        <span className="flex w-8 min-w-8 items-center justify-center rounded-xl bg-accent text-xs font-bold text-teal-50">
          {folderContents.length}
        </span>
      </div>
      <div
        className={`mb-3 mr-6 block h-auto min-h-64 w-full overflow-hidden rounded-lg border-4 border-secondary-dark sm:mb-0`}
      >
        <div className="size-full rounded-lg object-cover ">
          {viewMode === BookmarkDisplayMode.List ? (
            <div
              data-testid="display-mode-container"
              className="flew flex-row p-4"
            >
              {items}
            </div>
          ) : (
            <div
              data-testid="display-mode-container"
              className="grid grid-cols-[repeat(auto-fill,5rem)] gap-4 p-4"
            >
              {items}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
