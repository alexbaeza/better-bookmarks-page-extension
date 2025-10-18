import { mockData } from '@/features/bookmarks/store/mock-data';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

describe('mockData', () => {
  it('exports an array of bookmark items', () => {
    expect(Array.isArray(mockData)).toBe(true);
    expect(mockData.length).toBeGreaterThan(0);
  });

  it('has the root folder with id "0"', () => {
    const root = mockData[0];
    expect(root.id).toBe('0');
    expect(root.title).toBe('');
    expect(Array.isArray(root.children)).toBe(true);
  });

  it('contains bookmarks menu, toolbar, and other bookmarks', () => {
    const root = mockData[0];
    expect(root.children).toBeDefined();
    expect(root.children).toHaveLength(5);

    const bookmarksMenu = root.children?.[0];
    expect(bookmarksMenu?.id).toBe('1');
    expect(bookmarksMenu?.title).toBe('Bookmarks Menu');

    const bookmarksToolbar = root.children?.[1];
    expect(bookmarksToolbar?.id).toBe('2');
    expect(bookmarksToolbar?.title).toBe('Bookmarks Toolbar');

    const otherBookmarks = root.children?.[2];
    expect(otherBookmarks?.id).toBe('3');
    expect(otherBookmarks?.title).toBe('Other Bookmarks');
  });

  it('has nested folders and bookmarks', () => {
    const root = mockData[0];
    expect(root.children).toBeDefined();
    const bookmarksMenu = root.children?.[0];

    expect(bookmarksMenu?.children).toBeDefined();
    expect(bookmarksMenu?.children?.length ?? 0).toBeGreaterThan(0);

    const folderWithChildren = bookmarksMenu?.children?.find((item) => item.children && item.children.length > 0);
    expect(folderWithChildren).toBeDefined();

    const findBookmarkWithUrl = (items: IBookmarkItem[]): IBookmarkItem | null => {
      for (const item of items) {
        if (item.url) return item;
        if (item.children) {
          const found = findBookmarkWithUrl(item.children);
          if (found) return found;
        }
      }
      return null;
    };

    const bookmark = bookmarksMenu?.children ? findBookmarkWithUrl(bookmarksMenu.children) : null;
    expect(bookmark).toBeDefined();
    expect(typeof bookmark?.url).toBe('string');
  });

  it('has folders without children (empty folders)', () => {
    const root = mockData[0];
    expect(root.children).toBeDefined();
    const bookmarksMenu = root.children?.[0];

    const emptyFolder = bookmarksMenu?.children?.find((item) => item.children && item.children.length === 0);
    expect(emptyFolder).toBeDefined();
  });

  it('contains bookmarks with various URLs', () => {
    const allBookmarks = getAllBookmarks(mockData);

    expect(allBookmarks.length).toBeGreaterThan(10);
    expect(allBookmarks.some((b) => b.url?.includes('github.com'))).toBe(true);
    expect(allBookmarks.some((b) => b.url?.includes('stackoverflow.com'))).toBe(true);
  });
});

function getAllBookmarks(items: IBookmarkItem[]): IBookmarkItem[] {
  const bookmarks: IBookmarkItem[] = [];

  function traverse(item: IBookmarkItem) {
    if (item.url) {
      bookmarks.push(item);
    }
    if (item.children) {
      item.children.forEach(traverse);
    }
  }

  items.forEach(traverse);
  return bookmarks;
}
