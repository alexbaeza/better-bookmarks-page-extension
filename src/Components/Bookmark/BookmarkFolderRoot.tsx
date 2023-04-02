import React from 'react';
import { BookmarkFolderModal } from './BookmarkFolderModal';
import { useAtomValue } from 'jotai';
import { viewModeAtom } from '../../Context/atoms';
import { BookmarkItem } from './Items/BookmarkItem';
import { BookmarkDisplayMode, BookmarkType } from '../../types.d';

export interface IBookmarkItem {
  id: string;
  title: string;
  index: number;
  dateAdded: number;
  parentId: string;
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
        <div className="mt-2">
          <BookmarkFolderModal
            dataTestId={`bookmark-folder-content-modal-${key}`}
            key={`bookmark-folder-content-modal-${content.id}`}
            title={content.title}
            folderContents={content.children}
          />
        </div>
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
    <div className="group relative inline-block w-full py-6 px-1">
      <div className="mt-3 mb-2 flex">
        <div className="font-base mr-2 text-sm uppercase leading-6 tracking-wide text-text-primary">
          {name}
        </div>
        <div className="min-w-8 flex w-8 items-center justify-center rounded-xl bg-accent text-xs font-bold text-teal-50">
          {folderContents.length}
        </div>
      </div>
      <div
        className={`min-h-64 mb-3 mr-6 block h-auto w-full overflow-hidden rounded-lg border border-4 border-secondary-dark sm:mb-0`}
      >
        <div className="h-full w-full rounded-lg object-cover ">
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
              className="grid grid-flow-row-dense grid-cols-4 grid-cols-4 gap-4 p-4"
            >
              {items}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
