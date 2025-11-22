import { useModal } from '@/app/providers/modal-context';
import { BookmarkFormModal } from '@/features/bookmarks/containers/BookmarkFormModal';
import { useBookmarkActions } from '@/features/bookmarks/hooks/useBookmarkActions';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

export const useBookmarkModals = () => {
  const { showModal, hideModal } = useModal();
  const { create, update, remove } = useBookmarkActions();

  const openEditModal = (item: IBookmarkItem) => {
    const onSave = async (values: { title: string; url?: string }) => {
      await update(item.id, values);
    };

    showModal(
      <BookmarkFormModal initialValues={{ title: item.title, url: item.url }} onClose={hideModal} onSave={onSave} />
    );
  };

  const openCreateModal = (parentId: string) => {
    const onSave = async (values: { title: string; url?: string }) => {
      await create(parentId, values);
    };

    showModal(<BookmarkFormModal initialValues={{ title: '', url: '' }} onClose={hideModal} onSave={onSave} />);
  };

  return {
    openCreateModal,
    openEditModal,
    remove,
  };
};
