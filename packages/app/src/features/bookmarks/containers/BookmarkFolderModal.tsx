import { FolderIcon } from 'lucide-react';
import type React from 'react';

import { useModal } from '@/app/providers/modal-context';
import { BookmarkContentRenderer } from '@/features/bookmarks/containers/BookmarkContentRenderer';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { Modal } from '@/shared/ui/Modal';

export interface BookmarkFolderModalProps {
  dataTestId?: string;
  folderContents: IBookmarkItem[];
  folderId: string;
  folderTitle: string;
}

export const BookmarkFolderModal: React.FC<BookmarkFolderModalProps> = ({ folderContents, folderId, folderTitle }) => {
  const { hideModal } = useModal();

  return (
    <Modal dataTestId="bookmark-folder-modal" onClose={hideModal} title={folderTitle}>
      <div className="p-4">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-lg bg-bgColor-secondary p-2 text-fgColor-primary">
          <FolderIcon size={24} />
        </div>
        <BookmarkContentRenderer folderContents={folderContents} folderId={folderId} />
      </div>
    </Modal>
  );
};
