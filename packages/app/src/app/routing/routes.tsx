import type React from 'react';

import { NotFoundPage } from '@/app/routing/NotFound';
import { Page } from '@/app/routing/Page';
import { BookmarkPage, useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';

export const AppRoutes: React.FC = () => {
  const { currentPage } = useBookmarkNavigation();

  if (currentPage === BookmarkPage.All) {
    return <Page pageId={BookmarkPage.All} />;
  }

  if (currentPage === BookmarkPage.Uncategorized) {
    return <Page pageId={BookmarkPage.Uncategorized} />;
  }

  // If it's a folder ID, render the folder page
  if (
    typeof currentPage === 'string' &&
    currentPage !== BookmarkPage.All &&
    currentPage !== BookmarkPage.Uncategorized
  ) {
    return <Page pageId={currentPage} />;
  }

  return <NotFoundPage />;
};
