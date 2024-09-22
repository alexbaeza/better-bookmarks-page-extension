import { IBookmarkItem } from '../Components/Bookmark/BookmarkFolderRoot';
import { mockData } from './mock-data';

let browser: any;

// Check if browser is firefox or chrome
let userAgent = navigator.userAgent;
const isFirefox = userAgent.match(/firefox|fxios/i);
if (isFirefox) {
  console.log('Detected Firefox browser');
  browser = window.browser;
} else {
  console.log('Detected Chrome browser');
  browser = window.chrome;
}

const isDevelopmentMode = process.env.NODE_ENV === 'development';

export interface BookmarksData {
  folders: IBookmarkItem[];
  uncategorized: IBookmarkItem | undefined;
}

export class Bookmarks {
  static async getBookmarksData(): Promise<BookmarksData> {
    // This will return the root folder and all sub-folders
    let tree;
    if (isDevelopmentMode) {
      console.warn('Detected Development environment: Using mock data');
      //Use mock data when in development mode
      tree = mockData;
    } else {
      tree = await browser.bookmarks.getTree();
    }

    const root = tree[0];

    // Note: Firefox exposes a type of either "folder" or "bookmark"
    // unfortunately chrome does not to ensure compatibility we will
    // instead check if the item in the array has the 'children' property
    // @ts-ignore
    const allFolders: IBookmarkItem[] = [];
    const uncategorizedFolder: IBookmarkItem = {
      dateAdded: 0,
      parentId: 'NoParent',
      id: 'Uncategorized',
      title: 'Uncategorized',
      index: 9999999,
      children: [] as IBookmarkItem[]
    };

    root.children.forEach((builtinFolder: IBookmarkItem) => {
      //Note Built-in folder would be one of:
      // Firefox: 'Bookmarks Menu','Bookmarks Toolbar', 'Other Bookmarks'
      // Chrome: 'Bookmarks Bar', 'Other Bookmarks'
      // @ts-ignore
      const folders = builtinFolder.children.filter((child) => child.children);
      //Items that are not within folders
      // @ts-ignore
      const uncategorizedItems: IBookmarkItem[] = builtinFolder.children.filter(
        (child) => !child.children
      );
      allFolders.push(...folders);
      // @ts-ignore
      uncategorizedFolder.children.push(...uncategorizedItems);
    });

    return {
      folders: allFolders,
      uncategorized: uncategorizedFolder
    };
  }
}
