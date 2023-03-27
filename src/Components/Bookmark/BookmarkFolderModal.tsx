import { IBookmarkItem } from './BookmarkFolderRoot';
import React, { useState } from 'react';
import { IconButton } from '../IconButton/IconButton';
import { CrossIcon, FolderIcon } from '../IconButton/icons/Icons';
import { BookmarkItem } from './Items/BookmarkItem';
import { BookmarkFolderItem } from './Items/BookmarkFolderItem';

export interface BookmarkFolderModalProps {
  title: string;
  folderContents: IBookmarkItem[];
}

export const BookmarkFolderModal = ({ title, folderContents }: BookmarkFolderModalProps) => {
  const [show, setShow] = useState<boolean>(false);

  return (
    <div className="relative">
      <BookmarkFolderItem name={title} onClick={() => setShow(true)} />
      {show && (
        <div className="fixed top-0 left-0 right-0 bottom-0 z-50 flex items-center justify-center">
          <div
            className="absolute top-0 left-0 right-0 bottom-0 bg-black opacity-50"
            onClick={() => setShow(false)}
          ></div>
          <div className="relative rounded-lg bg-custom-primary-dark p-4 shadow">
            <IconButton onClick={() => setShow(false)} icon={<CrossIcon />} />
            <div className="max-w-md">
              <div className="p-6">
                <div className="mx-auto mb-4 h-14 w-14 text-custom-text-primary">
                  <FolderIcon size={'md'} />
                </div>
                <div className="font-base mr-2 text-center text-sm uppercase leading-6 text-custom-text-primary">
                  {title}
                </div>
                <div className="container">
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
                        } else {
                          if (content.url) {
                            return (
                              <BookmarkItem
                                key={`bookmark_item-${content.id}`}
                                title={content.title}
                                url={content.url}
                              />
                            );
                          } else {
                            return [];
                          }
                        }
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
