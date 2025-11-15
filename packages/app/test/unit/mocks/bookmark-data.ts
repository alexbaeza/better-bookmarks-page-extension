/**
 * Utility to generate realistic mock bookmark data for testing
 * Supports both Firefox and Chrome bookmark tree structures
 */

// Firefox default folder IDs
const FIREFOX_DEFAULT_FOLDER_IDS = {
  ROOT: 'root________',
  MENU: 'menu________',
  TOOLBAR: 'toolbar_____',
  UNFILED: 'unfiled_____',
  MOBILE: 'mobile______',
} as const;

/**
 * Generate a realistic Firefox bookmark tree with all default folders
 */
export function generateMockFirefoxBookmarkTree(): browser.bookmarks.BookmarkTreeNode[] {
  const now = Date.now();
  const oneDayAgo = now - 86400000;
  const oneWeekAgo = now - 604800000;
  const oneMonthAgo = now - 2592000000;

  return [
    {
      id: FIREFOX_DEFAULT_FOLDER_IDS.ROOT,
      title: '',
      dateAdded: oneMonthAgo,
      children: [
        {
          id: FIREFOX_DEFAULT_FOLDER_IDS.MENU,
          title: 'Bookmarks Menu',
          dateAdded: oneMonthAgo,
          dateGroupModified: now,
          children: [
            {
              id: 'menu-folder-1',
              title: 'Work',
              dateAdded: oneWeekAgo,
              dateGroupModified: oneDayAgo,
              parentId: FIREFOX_DEFAULT_FOLDER_IDS.MENU,
              children: [
                {
                  id: 'menu-bookmark-1',
                  title: 'GitHub',
                  url: 'https://github.com',
                  dateAdded: oneDayAgo,
                  parentId: 'menu-folder-1',
                },
                {
                  id: 'menu-bookmark-2',
                  title: 'Stack Overflow',
                  url: 'https://stackoverflow.com',
                  dateAdded: oneDayAgo,
                  parentId: 'menu-folder-1',
                },
              ],
            },
            {
              id: 'menu-bookmark-3',
              title: 'MDN Web Docs',
              url: 'https://developer.mozilla.org',
              dateAdded: oneWeekAgo,
              parentId: FIREFOX_DEFAULT_FOLDER_IDS.MENU,
            },
          ],
        },
        {
          id: FIREFOX_DEFAULT_FOLDER_IDS.TOOLBAR,
          title: 'Bookmarks Toolbar',
          dateAdded: oneMonthAgo,
          dateGroupModified: now,
          children: [
            {
              id: 'toolbar-folder-1',
              title: 'Quick Links',
              dateAdded: oneWeekAgo,
              dateGroupModified: oneDayAgo,
              parentId: FIREFOX_DEFAULT_FOLDER_IDS.TOOLBAR,
              children: [
                {
                  id: 'toolbar-bookmark-1',
                  title: 'Google',
                  url: 'https://google.com',
                  dateAdded: oneDayAgo,
                  parentId: 'toolbar-folder-1',
                },
                {
                  id: 'toolbar-bookmark-2',
                  title: 'YouTube',
                  url: 'https://youtube.com',
                  dateAdded: oneDayAgo,
                  parentId: 'toolbar-folder-1',
                },
              ],
            },
            {
              id: 'toolbar-bookmark-3',
              title: 'Gmail',
              url: 'https://mail.google.com',
              dateAdded: oneWeekAgo,
              parentId: FIREFOX_DEFAULT_FOLDER_IDS.TOOLBAR,
            },
          ],
        },
        {
          id: FIREFOX_DEFAULT_FOLDER_IDS.UNFILED,
          title: 'Other Bookmarks',
          dateAdded: oneMonthAgo,
          dateGroupModified: now,
          children: [
            {
              id: 'unfiled-folder-1',
              title: 'Personal',
              dateAdded: oneWeekAgo,
              dateGroupModified: oneDayAgo,
              parentId: FIREFOX_DEFAULT_FOLDER_IDS.UNFILED,
              children: [
                {
                  id: 'unfiled-bookmark-1',
                  title: 'Reddit',
                  url: 'https://reddit.com',
                  dateAdded: oneDayAgo,
                  parentId: 'unfiled-folder-1',
                },
              ],
            },
            {
              id: 'unfiled-bookmark-2',
              title: 'Wikipedia',
              url: 'https://wikipedia.org',
              dateAdded: oneWeekAgo,
              parentId: FIREFOX_DEFAULT_FOLDER_IDS.UNFILED,
            },
          ],
        },
        {
          id: FIREFOX_DEFAULT_FOLDER_IDS.MOBILE,
          title: 'Mobile Bookmarks',
          dateAdded: oneMonthAgo,
          dateGroupModified: oneWeekAgo,
          children: [
            {
              id: 'mobile-bookmark-1',
              title: 'Mobile App',
              url: 'https://example.com/mobile',
              dateAdded: oneWeekAgo,
              parentId: FIREFOX_DEFAULT_FOLDER_IDS.MOBILE,
            },
          ],
        },
      ],
    },
  ];
}

// Chrome folder types
const CHROME_FOLDER_TYPES = {
  BOOKMARKS_BAR: 'bookmarks-bar',
  OTHER: 'other',
} as const;

/**
 * Generate a realistic Chrome bookmark tree with all default folders
 */
export function generateMockChromeBookmarkTree(): chrome.bookmarks.BookmarkTreeNode[] {
  const now = Date.now();
  const oneDayAgo = now - 86400000;
  const oneWeekAgo = now - 604800000;
  const oneMonthAgo = now - 2592000000;

  return [
    {
      id: '0',
      title: '',
      dateAdded: oneMonthAgo,
      syncing: false,
      children: [
        {
          id: '1',
          title: 'Bookmarks Bar',
          folderType: CHROME_FOLDER_TYPES.BOOKMARKS_BAR,
          dateAdded: oneMonthAgo,
          dateGroupModified: now,
          syncing: false,
          children: [
            {
              id: 'bar-folder-1',
              title: 'Quick Links',
              dateAdded: oneWeekAgo,
              dateGroupModified: oneDayAgo,
              parentId: '1',
              syncing: false,
              children: [
                {
                  id: 'bar-bookmark-1',
                  title: 'Google',
                  url: 'https://google.com',
                  dateAdded: oneDayAgo,
                  parentId: 'bar-folder-1',
                  syncing: false,
                },
                {
                  id: 'bar-bookmark-2',
                  title: 'YouTube',
                  url: 'https://youtube.com',
                  dateAdded: oneDayAgo,
                  parentId: 'bar-folder-1',
                  syncing: false,
                },
              ],
            },
            {
              id: 'bar-bookmark-3',
              title: 'Gmail',
              url: 'https://mail.google.com',
              dateAdded: oneWeekAgo,
              parentId: '1',
              syncing: false,
            },
          ],
        },
        {
          id: '2',
          title: 'Other Bookmarks',
          folderType: CHROME_FOLDER_TYPES.OTHER,
          dateAdded: oneMonthAgo,
          dateGroupModified: now,
          syncing: false,
          children: [
            {
              id: 'other-folder-1',
              title: 'Work',
              dateAdded: oneWeekAgo,
              dateGroupModified: oneDayAgo,
              parentId: '2',
              syncing: false,
              children: [
                {
                  id: 'other-bookmark-1',
                  title: 'GitHub',
                  url: 'https://github.com',
                  dateAdded: oneDayAgo,
                  parentId: 'other-folder-1',
                  syncing: false,
                },
                {
                  id: 'other-bookmark-2',
                  title: 'Stack Overflow',
                  url: 'https://stackoverflow.com',
                  dateAdded: oneDayAgo,
                  parentId: 'other-folder-1',
                  syncing: false,
                },
              ],
            },
            {
              id: 'other-folder-2',
              title: 'Personal',
              dateAdded: oneWeekAgo,
              dateGroupModified: oneDayAgo,
              parentId: '2',
              syncing: false,
              children: [
                {
                  id: 'other-bookmark-3',
                  title: 'Reddit',
                  url: 'https://reddit.com',
                  dateAdded: oneDayAgo,
                  parentId: 'other-folder-2',
                  syncing: false,
                },
              ],
            },
            {
              id: 'other-bookmark-4',
              title: 'MDN Web Docs',
              url: 'https://developer.mozilla.org',
              dateAdded: oneWeekAgo,
              parentId: '2',
              syncing: false,
            },
            {
              id: 'other-bookmark-5',
              title: 'Wikipedia',
              url: 'https://wikipedia.org',
              dateAdded: oneWeekAgo,
              parentId: '2',
              syncing: false,
            },
          ],
        },
      ],
    },
  ];
}
