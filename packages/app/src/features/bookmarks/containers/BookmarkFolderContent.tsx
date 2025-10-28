import type React from 'react';

import { BookmarkDisplayArea } from '@/features/bookmarks/containers/BookmarkDisplayArea';
import { BookmarkFolderList } from '@/features/bookmarks/containers/BookmarkFolderList';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { NotFoundIllustration } from '@/features/navigation/components/NotFoundIllustration';
import { Text } from '@/shared/ui/Text';

export const BookmarkFolderContent: React.FC = () => {
  const { currentPage, pageContainers } = useBookmarks();

  if (pageContainers.length === 0 || (pageContainers.length === 1 && (pageContainers[0].children?.length ?? 0) === 0)) {
    return (
      <div className="flex w-full items-center justify-center p-2" data-testid="empty-state-container">
        <div className="flex flex-col items-center">
          <Text align="center" className="italic" color="primary" data-testid="empty-state-message" size="sm">
            Looks like you don't have any Bookmarks, add some to see the magic! 🪄✨
          </Text>
          <NotFoundIllustration className="mb-4 text-bgColor-tertiary" />
        </div>
      </div>
    );
  }

  if (currentPage === 'All' || currentPage === 'Uncategorized') {
    return (
      <div className="mx-auto flex w-full flex-col justify-center p-2">
        <BookmarkFolderList folders={pageContainers} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center p-2">
      <div className="min-h-64 w-full overflow-hidden rounded-lg border-4 border-bgColor-tertiary">
        <BookmarkDisplayArea folderContents={pageContainers[0].children ?? []} folderId={pageContainers[0].id} />
      </div>
    </div>
  );
};
