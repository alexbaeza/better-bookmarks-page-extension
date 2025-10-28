import type React from 'react';
import { useEffect } from 'react';

import { BookmarkFolderContent } from '@/features/bookmarks/containers/BookmarkFolderContent';
import { useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';

export const AllPage: React.FC = () => {
  const { setCurrentPage } = useBookmarkNavigation();

  useEffect(() => {
    setCurrentPage('All');
  }, [setCurrentPage]);

  return <BookmarkFolderContent />;
};
