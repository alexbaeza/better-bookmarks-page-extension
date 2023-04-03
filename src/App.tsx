import React, { useEffect, useState } from 'react';
import {
  BookmarkFolderRoot,
  IBookmarkItem
} from './Components/Bookmark/BookmarkFolderRoot';
import { SettingsModal } from './Components/Settings/SettingsModal';
import { Greeting } from './Components/Greeting/Greeting';
import { Footer } from './Components/Footer/Footer';
import { useAtomValue } from 'jotai';
import {
  backgroundOverlayAtom,
  backgroundOverlayOpacityAtom,
  themeAtom
} from './Context/atoms';
import { Bookmarks } from './Data/bookmarks';
import { ViewModeToggle } from './Sections/ViewModeToggle';

export const App = () => {
  const [data, setData] = useState<IBookmarkItem[]>();
  const selectedBackground = useAtomValue(backgroundOverlayAtom);
  const theme = useAtomValue(themeAtom);
  const backgroundOverlayOpacity = useAtomValue(backgroundOverlayOpacityAtom);

  useEffect(() => {
    async function fetchBookmarks() {
      const bookMarksResponse = await Bookmarks.getFolders();
      setData(bookMarksResponse);
    }
    fetchBookmarks();
  }, [backgroundOverlayOpacity, selectedBackground, theme]);

  let bookmarkFolders: IBookmarkItem[] = [];

  if (data) {
    // Find all level-1 folders
    const level1Folders: IBookmarkItem[] = data.flatMap((folder) => {
      if (folder.children) {
        return folder.children.filter((child: IBookmarkItem) => child.children);
      } else {
        return [];
      }
    });

    const idsToRemove = level1Folders.map((l1) => l1.id);
    const bookmarksWithoutLevel1s = data.map((child) => {
      if (child.children) {
        child.children = child.children.filter(
          (c) => !idsToRemove.includes(c.id)
        );
      }
      return child;
    });

    // Add level-1 folders to the bookmark folders array
    bookmarkFolders.push(...bookmarksWithoutLevel1s, ...level1Folders);
  }

  return (
    <div className={theme}>
      <div className=" min-h-screen bg-primary-dark">
        <div
          data-testid="background"
          className="absolute top-0 right-0 h-full w-full flex-col bg-repeat p-1.5"
          style={{
            opacity: `${backgroundOverlayOpacity}%`,
            backgroundImage: `url('${selectedBackground}')`,
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%'
          }}
        />
        <SettingsModal />
        <Greeting />
        <ViewModeToggle />
        <section className="flex flex-grow flex-col items-center justify-center px-3 pt-3">
          <div className="mx-auto flex flex-col justify-center p-2 align-middle">
            {bookmarkFolders.length ? (
              <div className="w-full gap-12 sm:columns-1 md:columns-2 lg:columns-3 xl:columns-3 2xl:columns-4">
                {bookmarkFolders
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
                Looks like you don't have any Bookmarks, add some to see the
                magic! 🪄✨
              </p>
            )}
          </div>
        </section>
        <section className="p-6">
          <Footer />
        </section>
      </div>
    </div>
  );
};
