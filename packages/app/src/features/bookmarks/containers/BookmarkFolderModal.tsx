import { FolderIcon } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';

import { useModal } from '@/app/providers/modal-context';
import { BookmarkFolderContainer } from '@/features/bookmarks/components/BookmarkFolderContainer';
import { BookmarkDisplayArea } from '@/features/bookmarks/containers/BookmarkDisplayArea';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { Modal } from '@/shared/ui/Modal';

export interface BookmarkFolderModalProps {
  dataTestId?: string;
  folderContents: IBookmarkItem[];
  folderId: string;
  folderTitle: string;
}

export const BookmarkFolderModal: React.FC<BookmarkFolderModalProps> = ({
  dataTestId,
  folderContents: initialContents,
  folderId,
  folderTitle,
}) => {
  const { hideModal } = useModal();
  const { rawFolders } = useBookmarks();
  const [folderContents, setFolderContents] = useState(initialContents);

  // Refresh folder contents when rawFolders changes
  useEffect(() => {
    const currentFolder = rawFolders.find((folder) => folder.id === folderId);
    if (currentFolder?.children) {
      setFolderContents(currentFolder.children);
    }
  }, [rawFolders, folderId]);

  return (
    <Modal dataTestId={dataTestId || 'bookmark-folder-modal'} onClose={hideModal} title={folderTitle}>
      <div className="p-4">
        <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-lg bg-bgColor-secondary p-2 text-fgColor-primary">
          <FolderIcon size={24} />
        </div>
        <BookmarkFolderContainer>
          <BookmarkDisplayArea folderContents={folderContents} folderId={folderId} />
        </BookmarkFolderContainer>
      </div>
    </Modal>
  );
};
