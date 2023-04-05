import React, { useEffect, useState } from 'react';
import {
  BookmarkFolderRoot,
  IBookmarkItem
} from '../Components/Bookmark/BookmarkFolderRoot';
import { useBookmarks } from '../Hooks/useBookmarks';

export const Content = () => {
  const { data, loading } = useBookmarks();
  const [cachedData, setCachedData] = useState<IBookmarkItem[] | null>(null);

  const mapBookmarks = (rawData: IBookmarkItem[]) => {
    // Find all level-1 folders
    const level1Folders: IBookmarkItem[] = rawData.flatMap(
      (folder) => folder.children?.filter((child) => child.children) || []
    );
    const idsToRemove: string[] = level1Folders.map((folder) => folder.id);

    const bookmarksWithoutLevel1s: IBookmarkItem[] = rawData.map((folder) => {
      if (folder.children) {
        folder.children = folder.children.filter(
          (child) => !idsToRemove.includes(child.id)
        );
      }
      return folder;
    });

    return [...bookmarksWithoutLevel1s, ...level1Folders];
  };

  useEffect(() => {
    if (!loading && data) {
      const bookmarks = mapBookmarks(data);
      setCachedData(bookmarks);
    }
  }, [data, loading]);

  if (loading) {
    return <p>Loading</p>;
  }

  return (
    <div className="mx-auto flex flex-col justify-center p-2 align-middle">
      {cachedData && cachedData.length ? (
        <div className="w-full gap-12 sm:columns-1 md:columns-2 lg:columns-3 xl:columns-3 2xl:columns-4">
          {cachedData
            .filter((folder) => folder.children?.length)
            .map((folder) => {
              //Safe-guard
              const children = folder.children ?? [];
              return (
                <BookmarkFolderRoot
                  name={folder.title}
                  folderContents={children}
                  key={`bookmark_root_folder_${folder.id}`}
                />
              );
            })}
        </div>
      ) : (
        <p className="text-sm italic text-text-primary">
          Looks like you don't have any Bookmarks, add some to see the magic!
          🪄✨
        </p>
      )}
    </div>
  );
};
