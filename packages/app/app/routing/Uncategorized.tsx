import type React from 'react';
import { useEffect } from 'react';

import { Content } from '@/features/bookmarks/containers/Content';
import { useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';

export const UncategorizedPage: React.FC = () => {
  const { setCurrentPage } = useBookmarkNavigation();

  useEffect(() => {
    setCurrentPage('Uncategorized');
  }, [setCurrentPage]);

  return <Content />;
};
