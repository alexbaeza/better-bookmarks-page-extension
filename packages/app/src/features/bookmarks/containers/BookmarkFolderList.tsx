import type React from 'react';
import { BookmarkRootFolderView } from '@/features/bookmarks/containers/BookmarkRootFolderView';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

export interface BookmarkFolderListProps {
  folders: IBookmarkItem[];
}
export const BookmarkFolderList: React.FC<BookmarkFolderListProps> = ({ folders }) => {
  const layoutClass = folders.length > 1 ? 'w-full min-w-0 columns-1 sm:columns-1 md:columns-2 lg:columns-3 2xl:columns-4 gap-4' : 'w-full';

  return (
    <div className={layoutClass}>
      {folders.map((folder) => (
        <BookmarkRootFolderView folderContents={folder.children ?? []} folderId={folder.id} key={folder.id} name={folder.title} />
      ))}
    </div>
  );
};
