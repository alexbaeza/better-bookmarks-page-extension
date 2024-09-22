import React from 'react';
import { BookmarkFolderRoot } from '../Components/Bookmark/BookmarkFolderRoot';
import { useBookmarks } from '../Hooks/useBookmarks';

export const Content = () => {
  const { isLoading, filteredData } = useBookmarks();
  if (isLoading) {
    return <p>Loading</p>;
  }
  const noData = (
    <div className="w-full ">
      <p className="text-sm italic text-text-primary">
        Looks like you don't have any Bookmarks, add some to see the magic! 🪄✨
      </p>
    </div>
  );

  return (
    <div className="mx-auto flex w-full flex-col justify-center p-2 align-middle">
      {filteredData.length > 1 && (
        <div className="w-full gap-12 sm:columns-1 md:columns-2 lg:columns-3 xl:columns-3 ">
          {filteredData.map((folder) => {
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
      )}
      {filteredData.length === 1 && (
        <div className="w-full">
          {filteredData.map((folder) => {
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
      )}
      {filteredData.length === 0 && noData}
      {filteredData.length === 1 &&
        filteredData[0].children?.length === 0 &&
        noData}
    </div>
  );
};
