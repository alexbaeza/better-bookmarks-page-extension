import type React from 'react';
import { BookmarkFolderRoot } from '@/features/bookmarks/components/BookmarkFolderRoot';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

export interface RenderFoldersProps {
  folders: IBookmarkItem[];
}
export const RenderFolders: React.FC<RenderFoldersProps> = ({ folders }) => {
  const layoutClass = folders.length > 1 ? 'w-full min-w-0 columns-1 sm:columns-1 md:columns-2 lg:columns-3 2xl:columns-4 gap-4' : 'w-full';

  return (
    <div className={layoutClass}>
      {folders.map((folder) => (
        <BookmarkFolderRoot key={folder.id} folderId={folder.id} name={folder.title} folderContents={folder.children ?? []} />
      ))}
    </div>
  );
};
