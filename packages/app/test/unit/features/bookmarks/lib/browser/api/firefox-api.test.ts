import { vi } from 'vitest';

import { FirefoxBookmarkAPI } from '@/features/bookmarks/lib/browser/api/firefox-api';
import { generateMockFirefoxBookmarkTree } from '~test/mocks/bookmark-data';

const mockBrowserBookmarks = {
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

const mockBrowser = {
  bookmarks: mockBrowserBookmarks,
};

Object.defineProperty(window, 'browser', {
  configurable: true,
  value: mockBrowser,
  writable: true,
});

describe('FirefoxBookmarkAPI', () => {
  let api: FirefoxBookmarkAPI;

  describe('constructor', () => {
    it('throws error when Firefox bookmarks API is not available', () => {
      delete (window as any).browser;

      expect(() => new FirefoxBookmarkAPI()).toThrow('Firefox bookmarks API not available');

      Object.defineProperty(window, 'browser', {
        configurable: true,
        value: mockBrowser,
        writable: true,
      });
    });

    it('throws error when Firefox bookmarks API is undefined', () => {
      (window as any).browser = {};

      expect(() => new FirefoxBookmarkAPI()).toThrow('Firefox bookmarks API not available');

      Object.defineProperty(window, 'browser', {
        configurable: true,
        value: mockBrowser,
        writable: true,
      });
    });
  });

  beforeEach(() => {
    Object.defineProperty(window, 'browser', {
      configurable: true,
      value: mockBrowser,
      writable: true,
    });
    api = new FirefoxBookmarkAPI();
  });

  describe('getBookmarksTree', () => {
    it('returns normalized bookmark tree with all default folders', async () => {
      const mockTree = generateMockFirefoxBookmarkTree();

      mockBrowserBookmarks.getTree.mockResolvedValue(mockTree);

      const result = await api.getBookmarksTree();

      expect(mockBrowserBookmarks.getTree).toHaveBeenCalledTimes(1);

      // Should have filtered folders Bookmarks Menu, Bookmarks Toolbar, and Other Bookmarks
      expect(result.folders.length).toBe(3);

      // Verify folders are correctly extracted
      const folderIds = result.folders.map((f) => f.id);
      expect(folderIds).toContain('menu-folder-1');
      expect(folderIds).toContain('toolbar-folder-1');
      expect(folderIds).toContain('unfiled-folder-1');

      expect(result.uncategorized).not.toBeUndefined();

      // biome-ignore lint/style/noNonNullAssertion: Assertion above checks that uncategorized is not undefined
      const uncategorizedIds = result!.uncategorized!.children?.map((b) => b.id) || [];
      expect(uncategorizedIds).toContain('menu-bookmark-3');
      expect(uncategorizedIds).toContain('toolbar-bookmark-3');
      expect(uncategorizedIds).toContain('unfiled-bookmark-2');
    });

    it('handles empty bookmark tree', async () => {
      mockBrowserBookmarks.getTree.mockResolvedValue([
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
  });

  describe('createBookmark', () => {
    it('creates a bookmark', async () => {
      const mockBookmark = {
        id: '4',
        parentId: '1',
        title: 'New Bookmark',
        url: 'https://example.com',
      };

      mockBrowserBookmarks.create.mockResolvedValue(mockBookmark);

      const result = await api.createBookmark('1', {
        title: 'New Bookmark',
        url: 'https://example.com',
      });

      expect(mockBrowserBookmarks.create).toHaveBeenCalledWith({
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

      mockBrowserBookmarks.create.mockResolvedValue(mockFolder);

      const result = await api.createBookmark('1', {
        title: 'New Folder',
      });

      expect(mockBrowserBookmarks.create).toHaveBeenCalledWith({
        parentId: '1',
        title: 'New Folder',
      });
      expect(result.id).toBe('5');
      expect(result.title).toBe('New Folder');
      expect(result.url).toBeUndefined();
    });
  });

  describe('removeBookmark', () => {
    it('removes a bookmark', async () => {
      mockBrowserBookmarks.removeTree.mockResolvedValue(undefined);

      await api.removeBookmark('4');

      expect(mockBrowserBookmarks.removeTree).toHaveBeenCalledWith('4');
    });
  });

  describe('updateBookmark', () => {
    it('updates a bookmark', async () => {
      const mockBookmark = {
        id: '4',
        title: 'Updated Bookmark',
        url: 'https://updated.com',
      };

      mockBrowserBookmarks.update.mockResolvedValue(mockBookmark);

      const result = await api.updateBookmark('4', {
        title: 'Updated Bookmark',
        url: 'https://updated.com',
      });

      expect(mockBrowserBookmarks.update).toHaveBeenCalledWith('4', {
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

      mockBrowserBookmarks.update.mockResolvedValue(mockBookmark);

      const result = await api.updateBookmark('4', {
        title: 'Updated Title',
      });

      expect(mockBrowserBookmarks.update).toHaveBeenCalledWith('4', {
        title: 'Updated Title',
      });
      expect(result.title).toBe('Updated Title');
    });
  });

  describe('moveBookmark', () => {
    it('moves a bookmark', async () => {
      mockBrowserBookmarks.move.mockResolvedValue(undefined);

      await api.moveBookmark('4', '2');

      expect(mockBrowserBookmarks.move).toHaveBeenCalledWith('4', {
        parentId: '2',
      });
    });

    it('moves a bookmark with index', async () => {
      mockBrowserBookmarks.move.mockResolvedValue(undefined);

      await api.moveBookmark('4', '2', 1);

      expect(mockBrowserBookmarks.move).toHaveBeenCalledWith('4', {
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

      mockBrowserBookmarks.get.mockResolvedValue([mockBookmark]);

      const result = await api.getBookmark('4');

      expect(mockBrowserBookmarks.get).toHaveBeenCalledWith('4');
      expect(result?.id).toBe('4');
      expect(result?.title).toBe('Test Bookmark');
      expect(result?.url).toBe('https://example.com');
    });

    it('returns null when bookmark not found', async () => {
      mockBrowserBookmarks.get.mockResolvedValue([]);

      const result = await api.getBookmark('999');

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

      mockBrowserBookmarks.search.mockResolvedValue(mockResults);

      const result = await api.searchBookmarks('google');

      expect(mockBrowserBookmarks.search).toHaveBeenCalledWith({ query: 'google' });
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Google Search');
      expect(result[1].title).toBe('Google Maps');
    });

    it('returns empty array when no results', async () => {
      mockBrowserBookmarks.search.mockResolvedValue([]);

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

      mockBrowserBookmarks.getSubTree.mockResolvedValue(mockFolder);
      mockBrowserBookmarks.move.mockResolvedValue(undefined);

      await api.reorderItems('1', 0, 2);

      expect(mockBrowserBookmarks.getSubTree).toHaveBeenCalledWith('1');
      expect(mockBrowserBookmarks.move).toHaveBeenCalledWith('item1', { index: 2 });
    });
  });
});
