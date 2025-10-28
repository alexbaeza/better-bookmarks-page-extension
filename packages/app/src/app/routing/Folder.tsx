import type React from 'react';
import { useEffect } from 'react';

import { BookmarkFolderContent } from '@/features/bookmarks/containers/BookmarkFolderContent';
import { useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';

interface FolderPageProps {
  folderId: string;
}

export const FolderPage: React.FC<FolderPageProps> = ({ folderId }) => {
  const { setCurrentPage } = useBookmarkNavigation();

  useEffect(() => {
    if (folderId) setCurrentPage(folderId);
  }, [folderId, setCurrentPage]);

  return <BookmarkFolderContent />;
};
