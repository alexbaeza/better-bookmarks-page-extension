import type React from 'react';

import { AllPage } from '@/app/routing/All';
import { FolderPage } from '@/app/routing/Folder';
import { NotFoundPage } from '@/app/routing/NotFound';
import { UncategorizedPage } from '@/app/routing/Uncategorized';
import { BookmarkPage, useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';

export const AppRoutes: React.FC = () => {
  const { currentPage } = useBookmarkNavigation();

  const renderPage = () => {
    switch (currentPage) {
      case BookmarkPage.All:
        return <AllPage />;
      case BookmarkPage.Uncategorized:
        return <UncategorizedPage />;
      default:
        // If it's a folder ID, render the folder page
        if (typeof currentPage === 'string' && currentPage !== BookmarkPage.All && currentPage !== BookmarkPage.Uncategorized) {
          return <FolderPage folderId={currentPage} />;
        }
        return <NotFoundPage />;
    }
  };

  return renderPage();
};
