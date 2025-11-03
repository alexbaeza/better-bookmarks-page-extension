import type React from 'react';
import { useEffect } from 'react';

import { BookmarkFolderContent } from '@/features/bookmarks/containers/BookmarkFolderContent';
import { useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';

interface PageProps {
  pageId: string;
}

export const Page: React.FC<PageProps> = ({ pageId }) => {
  const { setCurrentPage } = useBookmarkNavigation();

  useEffect(() => {
    setCurrentPage(pageId);
  }, [pageId, setCurrentPage]);

  return <BookmarkFolderContent />;
};
