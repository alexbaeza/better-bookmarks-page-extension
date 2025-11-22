import type React from 'react';
import { BookmarkFolderContainer } from '@/features/bookmarks/components/BookmarkFolderContainer';
import { BreadcrumbNavigation } from '@/features/bookmarks/components/BreadcrumbNavigation';
import { BookmarkMasonryLayout } from '@/features/bookmarks/components/layout/BookmarkMasonryLayout';
import { BookmarkDisplayArea } from '@/features/bookmarks/containers/BookmarkDisplayArea';
import { BookmarkPage } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { NotFoundIllustration } from '@/features/navigation/components/NotFoundIllustration';
import { ViewModeToggle } from '@/features/preferences/containers/ViewModeToggle';
import { useTranslation } from '@/i18n/hooks';
import { Row } from '@/shared/ui/Row';
import { Text } from '@/shared/ui/Text';

export const BookmarkFolderContent: React.FC = () => {
  const { t } = useTranslation();
  const { currentPage, pageContainers } = useBookmarks();

  const isEmpty =
    pageContainers.length === 0 || (pageContainers.length === 1 && (pageContainers[0].children?.length ?? 0) === 0);
  const isMasonryView = currentPage === BookmarkPage.All || currentPage === BookmarkPage.Uncategorized;

  const renderContent = () => {
    if (isEmpty) {
      return (
        <Row
          alignItems="center"
          className="w-full"
          data-testid="empty-state-container"
          gap="none"
          justifyContent="center"
        >
          <div className="flex flex-col items-center">
            <Text align="center" className="italic" color="primary" data-testid="empty-state-message" size="sm">
              {t('bookmarks.emptyState')}
            </Text>
            <NotFoundIllustration className="mb-4 text-bgColor-secondary" />
          </div>
        </Row>
      );
    }

    if (isMasonryView) {
      return <BookmarkMasonryLayout folders={pageContainers} />;
    }

    return (
      <BookmarkFolderContainer>
        <BookmarkDisplayArea folderContents={pageContainers[0].children ?? []} folderId={pageContainers[0].id} />
      </BookmarkFolderContainer>
    );
  };

  return (
    <>
      <div className="w-full border-b border-bgColor-secondary/30">
        <Row alignItems="center" className="w-full p-4" gap="none" justifyContent="between">
          <BreadcrumbNavigation />
          <ViewModeToggle />
        </Row>
      </div>
      {renderContent()}
    </>
  );
};
