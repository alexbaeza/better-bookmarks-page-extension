import React from 'react';
import { BookmarkFolderModal } from './BookmarkFolderModal';
import { BookmarkItem } from './Items/BookmarkItem';

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

export const BookmarkFolderRoot = ({ name, folderContents }: BookmarkFolderRootProps) => {
  if (!folderContents.length) {
    return <></>;
  }

  return (
    <div className="group relative inline-block w-full py-6 px-1">
      <div className="mt-3 mb-2 flex">
        <div className="font-base mr-2 text-sm uppercase leading-6 tracking-wide text-custom-text-primary">{name}</div>
        <div className="min-w-8 flex w-8 items-center justify-center rounded-xl bg-custom-primary text-xs font-bold text-custom-text-primary">
          {folderContents.length}
        </div>
      </div>
      <figure
        className={`min-h-64 mb-3 mr-6 block h-auto w-full overflow-hidden rounded-lg border border-slate-200 sm:mb-0`}
      >
        <div className=" h-full w-full rounded-lg object-cover ">
          <div className="grid grid-flow-row-dense grid-cols-4 grid-cols-4 gap-4 p-4">
            {folderContents.map((content) => {
              if (content.children) {
                return (
                  <BookmarkFolderModal
                    key={`bookmark_folder-${content.id}`}
                    title={content.title}
                    folderContents={content.children}
                  />
                );
              } else if (content.url) {
                return <BookmarkItem key={`bookmark_item-${content.id}`} title={content.title} url={content?.url} />;
              }
              return null;
            })}
          </div>
        </div>
      </figure>
    </div>
  );
};
