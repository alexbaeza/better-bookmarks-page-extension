import { IBookmarkItem } from './BookmarkFolderRoot';
import React, { useState } from 'react';
import { IconButton } from '../IconButton/IconButton';
import { CrossIcon, FolderIcon } from '../IconButton/Icons/Icons';
import { BookmarkItem } from './Items/BookmarkItem';
import { BookmarkDisplayMode, BookmarkType } from '../../types.d';
import { useAtomValue } from 'jotai';
import { viewModeAtom } from '../../Context/atoms';

export interface BookmarkFolderModalProps {
  dataTestId?: string;
  title: string;
  folderContents: IBookmarkItem[];
}

export const BookmarkFolderModal = ({
  dataTestId,
  title,
  folderContents
}: BookmarkFolderModalProps) => {
  const [show, setShow] = useState<boolean>(false);
  const viewMode = useAtomValue(viewModeAtom);

  const items = folderContents.map((content) => {
    if (content.children) {
      return (
        <BookmarkFolderModal
          dataTestId="bookmark-folder-item-modal"
          key={`bookmark_folder-${content.id}`}
          title={content.title}
          folderContents={content.children}
        />
      );
    } else {
      if (content.url) {
        return (
          <BookmarkItem
            data-testid="bookmark-item"
            key={`bookmark_item-${content.id}`}
            title={content.title}
            url={content.url}
            type={BookmarkType.Item}
          />
        );
      } else {
        return [];
      }
    }
  });

  return (
    <div className="relative" data-testid={dataTestId}>
      <BookmarkItem
        dataTestId="bookmark-folder-item"
        title={title}
        onClickAction={() => setShow(true)}
        type={BookmarkType.Folder}
      />
      {show && (
        <div
          data-testid="bookmark-folder-content-modal"
          className="fixed inset-0 z-50 flex items-center justify-center"
        >
          <div
            className="absolute inset-0 bg-black opacity-50"
            onClick={() => setShow(false)}
          />
          <div className="relative flex w-4/5 justify-center rounded-lg bg-primary-dark p-4 shadow md:w-3/5 lg:w-2/5">
            <IconButton
              dataTestId="bookmark-folder-content-modal-close-button"
              onClick={() => setShow(false)}
              icon={<CrossIcon />}
            />
            <div className="w-full p-6">
              <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-lg bg-secondary-dark p-2 text-text-primary">
                <FolderIcon size={'md'} />
              </div>
              <div className="font-base mr-2 text-center text-sm uppercase leading-6 text-text-primary">
                {title}
              </div>
              <div className="container">
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
                      className="grid grid-flow-row-dense grid-cols-4 gap-4 p-4"
                    >
                      {items}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
