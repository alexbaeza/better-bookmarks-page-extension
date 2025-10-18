import type React from 'react';

import { BookmarkContentRenderer } from '@/features/bookmarks/containers/BookmarkContentRenderer';
import { RenderFolders } from '@/features/bookmarks/containers/RenderFolders';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { NotFoundIllustration } from '@/features/navigation/components/NotFoundIllustration';

export const Content: React.FC = () => {
  const { currentPage, pageContainers } = useBookmarks();

  if (pageContainers.length === 0 || (pageContainers.length === 1 && (pageContainers[0].children?.length ?? 0) === 0)) {
    return (
      <div className="flex w-full items-center justify-center p-2">
        <div className="flex flex-col items-center">
          <p className="text-center text-sm italic text-fgColor-primary">Looks like you don’t have any Bookmarks, add some to see the magic! 🪄✨</p>
          <NotFoundIllustration className="mb-4 text-bgColor-tertiary" />
        </div>
      </div>
    );
  }

  if (currentPage === 'All' || currentPage === 'Uncategorized') {
    return (
      <div className="mx-auto flex w-full flex-col justify-center p-2">
        <RenderFolders folders={pageContainers} />
      </div>
    );
  }

  return (
    <div className="mx-auto flex w-full flex-col justify-center p-2">
      <div className="min-h-64 w-full overflow-hidden rounded-lg border-4 border-bgColor-tertiary">
        <BookmarkContentRenderer folderContents={pageContainers[0].children ?? []} folderId={pageContainers[0].id} />
      </div>
    </div>
  );
};
