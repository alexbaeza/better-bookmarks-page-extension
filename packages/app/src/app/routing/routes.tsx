import type React from 'react';

import { NotFoundPage } from '@/app/routing/NotFound';
import { Page } from '@/app/routing/Page';
import { BookmarkPage, useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { isAllPage, isFolderPage, isUncategorizedPage } from '@/shared/utils/page-utils';

export const AppRoutes: React.FC = () => {
  const { currentPage } = useBookmarkNavigation();

  if (isAllPage(currentPage)) {
    return <Page pageId={BookmarkPage.All} />;
  }

  if (isUncategorizedPage(currentPage)) {
    return <Page pageId={BookmarkPage.Uncategorized} />;
  }

  // If it's a folder ID, render the folder page
  if (isFolderPage(currentPage)) {
    return <Page pageId={currentPage} />;
  }

  return <NotFoundPage />;
};
