import { useAtomValue } from 'jotai';
import type React from 'react';

import { viewModeAtom } from '@/app/providers/atoms';
import { BookmarkFolderGridItem } from '@/features/bookmarks/components/items/BookmarkFolderGridItem';
import { BookmarkGridItem } from '@/features/bookmarks/components/items/grid/BookmarkGridItem';
import { BookmarkListItem } from '@/features/bookmarks/components/items/list/BookmarkListItem';
import { useBookmarkModals } from '@/features/bookmarks/hooks/useBookmarkModals';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { BookmarkDisplayMode } from '@/shared/types/ui';

export interface BookmarkItemViewProps {
  dataTestId?: string;
  item: IBookmarkItem;
  onFolderClick?: (item: IBookmarkItem) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLElement>;
}

export const BookmarkItemView: React.FC<BookmarkItemViewProps> = ({ dataTestId, item, onFolderClick, dragHandleProps }) => {
  const viewMode = useAtomValue(viewModeAtom);
  const { openFolderModal, openEditModal, remove } = useBookmarkModals();

  const handleEdit = (): void => {
    openEditModal(item);
  };

  const handleDelete = async (): Promise<void> => {
    return remove(item.id);
  };

  const handleClick = (): void => {
    if (onFolderClick) {
      onFolderClick(item);
    } else {
      openFolderModal(item);
    }
  };

  const isFolder = Boolean(item.children);
  const commonProps = {
    dataTestId,
    dragHandleProps,
    onDelete: handleDelete,
    onEdit: handleEdit,
    title: item.title,
  };

  if (viewMode === BookmarkDisplayMode.Grid) {
    if (isFolder) {
      return <BookmarkFolderGridItem dragHandleProps={dragHandleProps} folderId={item.id} onClick={handleClick} title={item.title} />;
    }
    return <BookmarkGridItem {...commonProps} onClick={undefined} url={item.url} />;
  }

  return <BookmarkListItem {...commonProps} folderId={isFolder ? item.id : undefined} onClick={isFolder ? handleClick : undefined} url={item.url} />;
};
