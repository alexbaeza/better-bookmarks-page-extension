import { IBookmarkItem } from '../Components/Bookmark/BookmarkFolderRoot';
import { mockData } from './mock-data';

let browser: any;

// Check if browser is firefox or chrome
if (window.browser && window.browser.runtime) {
  console.log('Detected Firefox browser');
  browser = window.browser;
} else {
  console.log('Detected Chrome browser');
  browser = window.chrome;
}

export class Bookmarks {
  static async getFolders(): Promise<IBookmarkItem[]> {
    // This will return the root folder and all sub-folders
    let tree;
    if (process.env.NODE_ENV === 'development') {
      console.warn('Detected Development environment: Using mock data');
      //Use mock data when in development mode
      tree = mockData;
    } else {
      tree = await browser.bookmarks.getTree();
    }
    // Note: Firefox exposes a type of either "folder" or "bookmark"
    // unfortunately chrome does not to ensure compatibility we will
    // instead check if the item in the array has the 'children' property
    // @ts-ignore
    return tree[0].children.filter((child) => child.children);
  }
}
