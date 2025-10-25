import type React from 'react';
import { useEffect } from 'react';

import { Content } from '@/features/bookmarks/containers/Content';
import { useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';

interface FolderPageProps {
  folderId: string;
}

export const FolderPage: React.FC<FolderPageProps> = ({ folderId }) => {
  const { setCurrentPage } = useBookmarkNavigation();

  useEffect(() => {
    if (folderId) setCurrentPage(folderId);
  }, [folderId, setCurrentPage]);

  return <Content />;
};
