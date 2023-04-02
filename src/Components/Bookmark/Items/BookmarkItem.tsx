/* eslint-disable no-unused-vars */
import React from 'react';
import { BookmarkListItem } from './BookmarkListItem';
import { BookmarkGridItem } from './BookmarkGridItem';
import { BookmarkFolderGridItem } from './BookmarkFolderGridItem';
import { BookmarkFolderListItem } from './BookmarkFolderListItem';
import { useAtomValue } from 'jotai';
import { viewModeAtom } from '../../../Context/atoms';
import { BookmarkDisplayMode, BookmarkType } from '../../../types.d';

export type BookmarkItemProps = {
  dataTestId?: string;
  title: string;
  url: string;
  type: BookmarkType.Item;
};

export type BookmarkFolderItemProps = {
  dataTestId?: string;
  title: string;
  onClickAction: () => void;
  type: BookmarkType.Folder;
};

type Props = BookmarkItemProps | BookmarkFolderItemProps;

export const BookmarkItem = (props: Props) => {
  const viewMode = useAtomValue(viewModeAtom);

  let item;

  if (props.type === BookmarkType.Folder) {
    const { dataTestId, title, onClickAction } = props;
    if (viewMode === BookmarkDisplayMode.Grid) {
      item = (
        <BookmarkFolderGridItem
          dataTestId={dataTestId}
          title={title}
          onClick={onClickAction}
        />
      );
    } else {
      item = (
        <BookmarkFolderListItem
          dataTestId={dataTestId}
          title={title}
          onClick={onClickAction}
        />
      );
    }
  } else {
    const { dataTestId, title, url } = props;
    if (viewMode === BookmarkDisplayMode.Grid) {
      item = (
        <BookmarkGridItem dataTestId={dataTestId} title={title} url={url} />
      );
    } else {
      item = (
        <BookmarkListItem dataTestId={dataTestId} title={title} url={url} />
      );
    }
  }

  return <div className="mt-2">{item}</div>;
};
