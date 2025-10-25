import { useAtomValue } from 'jotai';
import type React from 'react';

import { viewModeAtom } from '@/app/providers/atoms';
import { useBookmarkModals } from '@/features/bookmarks/hooks/useBookmarkModals';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { BookmarkDisplayMode } from '@/shared/types/ui';

import { BookmarkGridItem } from './grid/BookmarkGridItem';
import { BookmarkListItem } from './list/BookmarkListItem';

export interface BookmarkNodeProps {
  dataTestId?: string;
  item: IBookmarkItem;
  onFolderClick?: (item: IBookmarkItem) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}

export const BookmarkItem: React.FC<BookmarkNodeProps> = (props) => {
  const viewMode = useAtomValue(viewModeAtom);
  const { openFolderModal, openEditModal, openCreateModal, remove } = useBookmarkModals();

  const handleEdit = (): void => {
    openEditModal(props.item);
  };

  const handleDelete = (): Promise<void> => {
    return remove(props.item.id);
  };

  const handleAddChild = (): void => {
    openCreateModal(props.item.id);
  };

  if (props.item.children) {
    const clickHandler = props.onFolderClick
      ? (): void => {
          props.onFolderClick?.(props.item);
        }
      : (): void => {
          openFolderModal(props.item);
        };

    if (!props.onFolderClick) {
      (clickHandler as typeof clickHandler & { onAddChild: () => void }).onAddChild = handleAddChild;
    }

    if (viewMode === BookmarkDisplayMode.Grid) {
      return (
        <BookmarkGridItem
          dataTestId={props.dataTestId}
          title={props.item.title}
          onClick={clickHandler}
          onEdit={handleEdit}
          onDelete={handleDelete}
          dragHandleProps={props.dragHandleProps}
        />
      );
    }
    return (
      <BookmarkListItem
        dataTestId={props.dataTestId}
        title={props.item.title}
        onClick={clickHandler}
        onEdit={handleEdit}
        onDelete={handleDelete}
        dragHandleProps={props.dragHandleProps}
      />
    );
  }

  if (viewMode === BookmarkDisplayMode.Grid) {
    return (
      <BookmarkGridItem
        dataTestId={props.dataTestId}
        title={props.item.title}
        url={props.item.url}
        onEdit={handleEdit}
        onDelete={handleDelete}
        dragHandleProps={props.dragHandleProps}
      />
    );
  }
  return (
    <BookmarkListItem
      dataTestId={props.dataTestId}
      title={props.item.title}
      url={props.item.url}
      onEdit={handleEdit}
      onDelete={handleDelete}
      dragHandleProps={props.dragHandleProps}
    />
  );
};
