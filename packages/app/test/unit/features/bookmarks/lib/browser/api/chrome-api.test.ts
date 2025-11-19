import { vi } from 'vitest';
import { when } from 'vitest-when';

import { ChromeBookmarkAPI } from '@/features/bookmarks/lib/browser/api/chrome-api';
import type { MockBookmarksAPI } from '@/features/bookmarks/lib/browser/api/mock-bookmarks-api';
import { generateMockChromeBookmarkTree } from '~test/mocks/bookmark-data';
import type { TestWindow } from '~test/test-types';

const mockChromeBookmarks = {
  create: vi.fn(),
  get: vi.fn(),
  getSubTree: vi.fn(),
  getTree: vi.fn(),
  move: vi.fn(),
  remove: vi.fn(),
  removeTree: vi.fn(),
  reorderChildren: vi.fn(),
  search: vi.fn(),
  update: vi.fn(),
};

const mockChrome = {
  bookmarks: mockChromeBookmarks,
} as { bookmarks: typeof mockChromeBookmarks; notifications?: { create: unknown } };

describe('ChromeBookmarkAPI', () => {
  let api: ChromeBookmarkAPI;

  beforeEach(() => {
    Object.defineProperty(window, 'chrome', {
      configurable: true,
      value: mockChrome,
      writable: true,
    });
    api = new ChromeBookmarkAPI();
  });

  describe('constructor', () => {
    it('throws error when Chrome bookmarks API is not available', () => {
      Reflect.deleteProperty(window, 'chrome');

      expect(() => new ChromeBookmarkAPI()).toThrow('Chrome bookmarks API not available');
    });

    it('throws error when Chrome bookmarks API is undefined', () => {
      (window as TestWindow).chrome = { bookmarks: undefined } as TestWindow['chrome'];

      expect(() => new ChromeBookmarkAPI()).toThrow('Chrome bookmarks API not available');
    });
  });

  it('uses provided mock bookmarks API when constructed with mock instance', async () => {
    const mockGetTree = vi.fn();
    when(mockGetTree)
      .calledWith()
      .thenResolve([
        {
          children: [],
          id: '0',
          title: 'Root',
        },
      ]);
    const mockBookmarks = {
      getTree: mockGetTree,
    } as Partial<MockBookmarksAPI> as MockBookmarksAPI;

    const apiWithMock = new ChromeBookmarkAPI(mockBookmarks);
    await apiWithMock.getBookmarksTree();

    expect(mockBookmarks.getTree).toHaveBeenCalledTimes(1);
  });

  describe('getBookmarksTree', () => {
    it('returns normalized bookmark tree with all default folders', async () => {
      const mockTree = generateMockChromeBookmarkTree();

      when(mockChromeBookmarks.getTree).calledWith().thenResolve(mockTree);

      const result = await api.getBookmarksTree();

      expect(mockChromeBookmarks.getTree).toHaveBeenCalledTimes(1);

      // Should have filtered folders Bookmarks Bar and Other Bookmarks
      expect(result.folders.length).toBe(3);

      // Verify folders are correctly extracted
      const folderIds = result.folders.map((f) => f.id);
      expect(folderIds).toContain('bar-folder-1');
      expect(folderIds).toContain('other-folder-1');
      expect(folderIds).toContain('other-folder-2');

      expect(result.uncategorized).not.toBeUndefined();

      // biome-ignore lint/style/noNonNullAssertion: Assertion above checks that uncategorized is not undefined
      const uncategorizedIds = result!.uncategorized!.children?.map((b) => b.id) || [];
      expect(uncategorizedIds).toContain('bar-bookmark-3');
      expect(uncategorizedIds).toContain('other-bookmark-4');
      expect(uncategorizedIds).toContain('other-bookmark-5');
    });

    it('handles empty bookmark tree', async () => {
      when(mockChromeBookmarks.getTree)
        .calledWith()
        .thenResolve([
          {
            children: [],
            id: '0',
            title: 'Root',
          },
        ]);

      const result = await api.getBookmarksTree();

      expect(result.folders).toHaveLength(0);
      expect(result.uncategorized).toBeUndefined();
    });

    it('handles root with non-built-in folder children', async () => {
      when(mockChromeBookmarks.getTree)
        .calledWith()
        .thenResolve([
          {
            children: [
              {
                id: 'custom-folder',
                title: 'Custom Folder',
                children: [],
              },
            ],
            id: '0',
            title: 'Root',
          },
        ]);

      const result = await api.getBookmarksTree();

      expect(result.folders).toHaveLength(0);
      expect(result.uncategorized).toBeUndefined();
    });

    it('handles root with undefined children', async () => {
      when(mockChromeBookmarks.getTree)
        .calledWith()
        .thenResolve([
          {
            id: '0',
            title: 'Root',
          },
        ]);

      const result = await api.getBookmarksTree();

      expect(result.folders).toHaveLength(0);
      expect(result.uncategorized).toBeUndefined();
    });

    it('handles built-in folders with undefined children', async () => {
      when(mockChromeBookmarks.getTree)
        .calledWith()
        .thenResolve([
          {
            children: [
              {
                folderType: 'bookmarks-bar',
                id: '1',
                title: 'Bookmarks Bar',
              },
            ],
            id: '0',
            title: 'Root',
          },
        ]);

      const result = await api.getBookmarksTree();

      expect(result.folders).toHaveLength(0);
      expect(result.uncategorized).toBeUndefined();
    });
  });

  describe('createBookmark', () => {
    it('creates a bookmark', async () => {
      const mockBookmark = {
        id: '4',
        parentId: '1',
        title: 'New Bookmark',
        url: 'https://example.com',
      };

      when(mockChromeBookmarks.create)
        .calledWith(expect.objectContaining({ parentId: '1', title: 'New Bookmark', url: 'https://example.com' }))
        .thenResolve(mockBookmark);

      const result = await api.createBookmark('1', {
        title: 'New Bookmark',
        url: 'https://example.com',
      });

      expect(mockChromeBookmarks.create).toHaveBeenCalledWith({
        parentId: '1',
        title: 'New Bookmark',
        url: 'https://example.com',
      });
      expect(result.id).toBe('4');
      expect(result.title).toBe('New Bookmark');
      expect(result.url).toBe('https://example.com');
    });

    it('creates a folder', async () => {
      const mockFolder = {
        id: '5',
        parentId: '1',
        title: 'New Folder',
      };

      when(mockChromeBookmarks.create)
        .calledWith(expect.objectContaining({ parentId: '1', title: 'New Folder' }))
        .thenResolve(mockFolder);

      const result = await api.createBookmark('1', {
        title: 'New Folder',
      });

      expect(mockChromeBookmarks.create).toHaveBeenCalledWith({
        parentId: '1',
        title: 'New Folder',
      });
      expect(result.id).toBe('5');
      expect(result.title).toBe('New Folder');
      expect(result.url).toBeUndefined();
    });

    it('falls back to Uncategorized parent and shows notification when parentId is null', async () => {
      const mockFolder = {
        id: '5',
        parentId: 'Uncategorized',
        title: 'New Folder',
      };

      when(mockChromeBookmarks.create)
        .calledWith(expect.objectContaining({ parentId: 'Uncategorized', title: 'New Folder' }))
        .thenResolve(mockFolder);

      const notificationsCreate = vi.fn();
      mockChrome.notifications = { create: notificationsCreate };

      const result = await api.createBookmark(null, {
        title: 'New Folder',
      });

      expect(mockChromeBookmarks.create).toHaveBeenCalledWith({
        parentId: 'Uncategorized',
        title: 'New Folder',
      });
      expect(result.parentId).toBe('Uncategorized');
      expect(notificationsCreate).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeBookmark', () => {
    it('removes a bookmark', async () => {
      when(mockChromeBookmarks.removeTree).calledWith('4').thenResolve(undefined);

      await api.removeBookmark('4');

      expect(mockChromeBookmarks.removeTree).toHaveBeenCalledWith('4');
    });
  });

  describe('updateBookmark', () => {
    it('updates a bookmark', async () => {
      const mockBookmark = {
        id: '4',
        title: 'Updated Bookmark',
        url: 'https://updated.com',
      };

      when(mockChromeBookmarks.update)
        .calledWith('4', expect.objectContaining({ title: 'Updated Bookmark', url: 'https://updated.com' }))
        .thenResolve(mockBookmark);

      const result = await api.updateBookmark('4', {
        title: 'Updated Bookmark',
        url: 'https://updated.com',
      });

      expect(mockChromeBookmarks.update).toHaveBeenCalledWith('4', {
        title: 'Updated Bookmark',
        url: 'https://updated.com',
      });
      expect(result.id).toBe('4');
      expect(result.title).toBe('Updated Bookmark');
      expect(result.url).toBe('https://updated.com');
    });

    it('updates only title', async () => {
      const mockBookmark = {
        id: '4',
        title: 'Updated Title',
        url: 'https://example.com',
      };

      when(mockChromeBookmarks.update)
        .calledWith('4', expect.objectContaining({ title: 'Updated Title' }))
        .thenResolve(mockBookmark);

      const result = await api.updateBookmark('4', {
        title: 'Updated Title',
      });

      expect(mockChromeBookmarks.update).toHaveBeenCalledWith('4', {
        title: 'Updated Title',
      });
      expect(result.title).toBe('Updated Title');
    });
  });

  describe('moveBookmark', () => {
    it('moves a bookmark', async () => {
      when(mockChromeBookmarks.move)
        .calledWith('4', expect.objectContaining({ parentId: '2' }))
        .thenResolve(undefined);

      await api.moveBookmark('4', '2');

      expect(mockChromeBookmarks.move).toHaveBeenCalledWith('4', {
        parentId: '2',
      });
    });

    it('moves a bookmark with index', async () => {
      when(mockChromeBookmarks.move)
        .calledWith('4', expect.objectContaining({ parentId: '2', index: 1 }))
        .thenResolve(undefined);

      await api.moveBookmark('4', '2', 1);

      expect(mockChromeBookmarks.move).toHaveBeenCalledWith('4', {
        index: 1,
        parentId: '2',
      });
    });
  });

  describe('getBookmark', () => {
    it('returns bookmark when found', async () => {
      const mockBookmark = {
        id: '4',
        title: 'Test Bookmark',
        url: 'https://example.com',
      };

      when(mockChromeBookmarks.get).calledWith('4').thenResolve([mockBookmark]);

      const result = await api.getBookmark('4');

      expect(mockChromeBookmarks.get).toHaveBeenCalledWith('4');
      expect(result?.id).toBe('4');
      expect(result?.title).toBe('Test Bookmark');
      expect(result?.url).toBe('https://example.com');
    });

    it('returns null when bookmark not found', async () => {
      when(mockChromeBookmarks.get).calledWith('999').thenResolve([]);

      const result = await api.getBookmark('999');

      expect(result).toBeNull();
    });

    it('returns null when get throws', async () => {
      when(mockChromeBookmarks.get).calledWith('4').thenReject(new Error('boom'));

      const result = await api.getBookmark('4');

      expect(result).toBeNull();
    });
  });

  describe('searchBookmarks', () => {
    it('searches bookmarks', async () => {
      const mockResults = [
        {
          id: '4',
          title: 'Google Search',
          url: 'https://google.com',
        },
        {
          id: '5',
          title: 'Google Maps',
          url: 'https://maps.google.com',
        },
      ];

      when(mockChromeBookmarks.search)
        .calledWith(expect.objectContaining({ query: 'google' }))
        .thenResolve(mockResults);

      const result = await api.searchBookmarks('google');

      expect(mockChromeBookmarks.search).toHaveBeenCalledWith({ query: 'google' });
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Google Search');
      expect(result[1].title).toBe('Google Maps');
    });

    it('returns empty array when no results', async () => {
      when(mockChromeBookmarks.search)
        .calledWith(expect.objectContaining({ query: 'nonexistent' }))
        .thenResolve([]);

      const result = await api.searchBookmarks('nonexistent');

      expect(result).toHaveLength(0);
    });
  });

  describe('reorderItems', () => {
    it('reorders items in a folder', async () => {
      const mockFolder = [
        {
          children: [
            { id: 'item1', title: 'Item 1' },
            { id: 'item2', title: 'Item 2' },
            { id: 'item3', title: 'Item 3' },
          ],
          id: '1',
          title: 'Test Folder',
        },
      ];

      when(mockChromeBookmarks.getSubTree).calledWith('1').thenResolve(mockFolder);
      when(mockChromeBookmarks.move)
        .calledWith('item1', expect.objectContaining({ index: 2 }))
        .thenResolve(undefined);

      await api.reorderItems('1', 0, 2);

      expect(mockChromeBookmarks.getSubTree).toHaveBeenCalledWith('1');
      expect(mockChromeBookmarks.move).toHaveBeenCalledWith('item1', { index: 2 });
    });

    it('throws when fromIndex is out of bounds', async () => {
      const mockFolder = [
        {
          children: [{ id: 'item1', title: 'Item 1' }],
          id: '1',
          title: 'Test Folder',
        },
      ];

      when(mockChromeBookmarks.getSubTree).calledWith('1').thenResolve(mockFolder);

      await expect(api.reorderItems('1', 3, 0)).rejects.toThrow('Invalid folder or index: 1, 3');
    });

    it('throws when no item exists at fromIndex', async () => {
      const mockFolder = [
        {
          children: [undefined],
          id: '1',
          title: 'Test Folder',
        },
      ];

      when(mockChromeBookmarks.getSubTree)
        .calledWith('1')
        .thenResolve(mockFolder as unknown as chrome.bookmarks.BookmarkTreeNode[]);

      await expect(api.reorderItems('1', 0, 1)).rejects.toThrow('Item not found at index 0');
    });
  });
});
