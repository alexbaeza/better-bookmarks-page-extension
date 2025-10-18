import { useAtomValue } from 'jotai';
import type React from 'react';

import { viewModeAtom } from '@/app/providers/atoms';
import { useModal } from '@/app/providers/modal-context';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { BookmarkDisplayMode } from '@/shared/types/ui';
import { Modal } from '@/shared/ui/Modal';

import { BookmarkContentRenderer } from '@/features/bookmarks/containers/BookmarkContentRenderer';
import { BookmarkFormModal } from '../BookmarkFormModal';
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
  const bookmarks = useBookmarks();
  const create = bookmarks.create;
  const update = bookmarks.update;
  const remove = bookmarks.remove;

  const modal = useModal();
  const showModal = modal.showModal;
  const hideModal = modal.hideModal;

  const defaultFolderClick = (folder: IBookmarkItem): void => {
    showModal(
      <Modal title={folder.title} onClose={hideModal}>
        <BookmarkContentRenderer folderContents={folder.children || []} folderId={folder.id} />
      </Modal>
    );
  };

  const openForm = (initial: { id?: string; title: string; url?: string; parentId?: string }, isNew: boolean): void => {
    showModal(
      <BookmarkFormModal
        initialValues={{ title: initial.title, url: initial.url }}
        onSave={async (values) => {
          if (isNew) {
            await create(initial.parentId || null, values);
          } else {
            await update(initial.id || '', values);
          }
          hideModal();
        }}
        onClose={hideModal}
      />
    );
  };

  const handleEdit = (): void => {
    openForm(
      {
        id: props.item.id,
        title: props.item.title,
        url: props.item.url,
        parentId: props.item.parentId,
      },
      false
    );
  };

  const handleDelete = (): Promise<void> => {
    return remove(props.item.id);
  };

  const handleAddChild = (): void => {
    openForm({ parentId: props.item.id, title: '', url: '' }, true);
  };

  if (props.item.children) {
    const clickHandler = props.onFolderClick
      ? (): void => {
          props.onFolderClick?.(props.item);
        }
      : (): void => {
          defaultFolderClick(props.item);
        };

    const dataTestIdProp = props.dataTestId;
    const titleProp = props.item.title;
    const onClickProp = clickHandler;
    const onEditProp = handleEdit;
    const onDeleteProp = handleDelete;
    const dragProps = props.dragHandleProps;

    if (!props.onFolderClick) {
      (onClickProp as typeof onClickProp & { onAddChild: () => void }).onAddChild = handleAddChild;
    }

    if (viewMode === BookmarkDisplayMode.Grid) {
      return (
        <BookmarkGridItem
          dataTestId={dataTestIdProp}
          title={titleProp}
          onClick={onClickProp}
          onEdit={onEditProp}
          onDelete={onDeleteProp}
          dragHandleProps={dragProps}
        />
      );
    }
    return (
      <BookmarkListItem
        dataTestId={dataTestIdProp}
        title={titleProp}
        onClick={onClickProp}
        onEdit={onEditProp}
        onDelete={onDeleteProp}
        dragHandleProps={dragProps}
      />
    );
  }
  const dataTestIdLink = props.dataTestId;
  const titleLink = props.item.title;
  const urlLink = props.item.url;
  const editLink = handleEdit;
  const deleteLink = handleDelete;
  const dragLink = props.dragHandleProps;

  if (viewMode === BookmarkDisplayMode.Grid) {
    return <BookmarkGridItem dataTestId={dataTestIdLink} title={titleLink} url={urlLink} onEdit={editLink} onDelete={deleteLink} dragHandleProps={dragLink} />;
  }
  return <BookmarkListItem dataTestId={dataTestIdLink} title={titleLink} url={urlLink} onEdit={editLink} onDelete={deleteLink} dragHandleProps={dragLink} />;
};
