import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { when } from 'vitest-when';

import { FirefoxBookmarkAPI } from '@/features/bookmarks/lib/browser/api/firefox-api';
import type { MockBookmarksAPI } from '@/features/bookmarks/lib/browser/api/mock-bookmarks-api';
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
} as { bookmarks: typeof mockBrowserBookmarks; notifications?: { create: unknown } };

describe('FirefoxBookmarkAPI', () => {
  let api: FirefoxBookmarkAPI;

  beforeEach(() => {
    vi.stubGlobal('browser', mockBrowser);
    api = new FirefoxBookmarkAPI();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  describe('constructor', () => {
    it('throws error when Firefox bookmarks API is not available', () => {
      vi.unstubAllGlobals();

      expect(() => new FirefoxBookmarkAPI()).toThrow('Firefox bookmarks API not available');
    });

    it('throws error when Firefox bookmarks API is undefined', () => {
      vi.stubGlobal('browser', { bookmarks: undefined });

      expect(() => new FirefoxBookmarkAPI()).toThrow('Firefox bookmarks API not available');
    });
  });

  it('uses provided mock bookmarks API when constructed with mock instance', async () => {
    const mockGetTree = vi.fn();
    when(mockGetTree)
      .calledWith()
      .thenResolve([
        {
          children: [],
          id: 'root',
          title: 'Root',
        },
      ]);
    const mockBookmarks = {
      getTree: mockGetTree,
    } as Partial<MockBookmarksAPI> as MockBookmarksAPI;

    const apiWithMock = new FirefoxBookmarkAPI(mockBookmarks);
    await apiWithMock.getBookmarksTree();

    expect(mockBookmarks.getTree).toHaveBeenCalledTimes(1);
  });

  describe('getBookmarksTree', () => {
    it('returns normalized bookmark tree with all default folders', async () => {
      const mockTree = generateMockFirefoxBookmarkTree();

      when(mockBrowserBookmarks.getTree).calledWith().thenResolve(mockTree);

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
      when(mockBrowserBookmarks.getTree)
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
      when(mockBrowserBookmarks.getTree)
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
      when(mockBrowserBookmarks.getTree)
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
      when(mockBrowserBookmarks.getTree)
        .calledWith()
        .thenResolve([
          {
            children: [
              {
                id: 'toolbar_____',
                title: 'Bookmarks Toolbar',
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

      when(mockBrowserBookmarks.create)
        .calledWith(expect.objectContaining({ parentId: '1', title: 'New Bookmark', url: 'https://example.com' }))
        .thenResolve(mockBookmark);

      const result = await api.createBookmark('1', {
        title: 'New Bookmark',
        url: 'https://example.com',
      });

      expect(mockBrowserBookmarks.create).toHaveBeenCalledTimes(1);
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

      when(mockBrowserBookmarks.create)
        .calledWith(expect.objectContaining({ parentId: '1', title: 'New Folder' }))
        .thenResolve(mockFolder);

      const result = await api.createBookmark('1', {
        title: 'New Folder',
      });

      expect(mockBrowserBookmarks.create).toHaveBeenCalledTimes(1);
      expect(mockBrowserBookmarks.create).toHaveBeenCalledWith({
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

      when(mockBrowserBookmarks.create)
        .calledWith(expect.objectContaining({ parentId: 'Uncategorized', title: 'New Folder' }))
        .thenResolve(mockFolder);

      const notificationsCreate = vi.fn();
      mockBrowser.notifications = { create: notificationsCreate };

      const result = await api.createBookmark(null, {
        title: 'New Folder',
      });

      expect(mockBrowserBookmarks.create).toHaveBeenCalledTimes(1);
      expect(mockBrowserBookmarks.create).toHaveBeenCalledWith({
        parentId: 'Uncategorized',
        title: 'New Folder',
      });
      expect(result.parentId).toBe('Uncategorized');
      expect(notificationsCreate).toHaveBeenCalledTimes(1);
    });
  });

  describe('removeBookmark', () => {
    it('removes a bookmark', async () => {
      when(mockBrowserBookmarks.removeTree).calledWith('4').thenResolve(undefined);

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

      when(mockBrowserBookmarks.update)
        .calledWith('4', expect.objectContaining({ title: 'Updated Bookmark', url: 'https://updated.com' }))
        .thenResolve(mockBookmark);

      const result = await api.updateBookmark('4', {
        title: 'Updated Bookmark',
        url: 'https://updated.com',
      });

      expect(mockBrowserBookmarks.update).toHaveBeenCalledTimes(1);
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

      when(mockBrowserBookmarks.update)
        .calledWith('4', expect.objectContaining({ title: 'Updated Title' }))
        .thenResolve(mockBookmark);

      const result = await api.updateBookmark('4', {
        title: 'Updated Title',
      });

      expect(mockBrowserBookmarks.update).toHaveBeenCalledTimes(1);
      expect(mockBrowserBookmarks.update).toHaveBeenCalledWith('4', {
        title: 'Updated Title',
      });
      expect(result.title).toBe('Updated Title');
    });
  });

  describe('moveBookmark', () => {
    it('moves a bookmark', async () => {
      when(mockBrowserBookmarks.move)
        .calledWith('4', expect.objectContaining({ parentId: '2' }))
        .thenResolve(undefined);

      await api.moveBookmark('4', '2');

      expect(mockBrowserBookmarks.move).toHaveBeenCalledTimes(1);
      expect(mockBrowserBookmarks.move).toHaveBeenCalledWith('4', {
        parentId: '2',
      });
    });

    it('moves a bookmark with index', async () => {
      when(mockBrowserBookmarks.move)
        .calledWith('4', expect.objectContaining({ parentId: '2', index: 1 }))
        .thenResolve(undefined);

      await api.moveBookmark('4', '2', 1);

      expect(mockBrowserBookmarks.move).toHaveBeenCalledTimes(1);
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

      when(mockBrowserBookmarks.get).calledWith('4').thenResolve([mockBookmark]);

      const result = await api.getBookmark('4');

      expect(mockBrowserBookmarks.get).toHaveBeenCalledTimes(1);
      expect(mockBrowserBookmarks.get).toHaveBeenCalledWith('4');
      expect(result?.id).toBe('4');
      expect(result?.title).toBe('Test Bookmark');
      expect(result?.url).toBe('https://example.com');
    });

    it('returns null when bookmark not found', async () => {
      when(mockBrowserBookmarks.get).calledWith('999').thenResolve([]);

      const result = await api.getBookmark('999');

      expect(result).toBeNull();
    });

    it('returns null when get throws', async () => {
      when(mockBrowserBookmarks.get).calledWith('4').thenReject(new Error('boom'));

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

      when(mockBrowserBookmarks.search)
        .calledWith(expect.objectContaining({ query: 'google' }))
        .thenResolve(mockResults);

      const result = await api.searchBookmarks('google');

      expect(mockBrowserBookmarks.search).toHaveBeenCalledTimes(1);
      expect(mockBrowserBookmarks.search).toHaveBeenCalledWith({ query: 'google' });
      expect(result).toHaveLength(2);
      expect(result[0].title).toBe('Google Search');
      expect(result[1].title).toBe('Google Maps');
    });

    it('returns empty array when no results', async () => {
      when(mockBrowserBookmarks.search)
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

      when(mockBrowserBookmarks.getSubTree).calledWith('1').thenResolve(mockFolder);
      when(mockBrowserBookmarks.move)
        .calledWith('item1', expect.objectContaining({ index: 2 }))
        .thenResolve(undefined);

      await api.reorderItems('1', 0, 2);

      expect(mockBrowserBookmarks.getSubTree).toHaveBeenCalledTimes(1);
      expect(mockBrowserBookmarks.getSubTree).toHaveBeenCalledWith('1');
      expect(mockBrowserBookmarks.move).toHaveBeenCalledTimes(1);
      expect(mockBrowserBookmarks.move).toHaveBeenCalledWith('item1', { index: 2 });
    });

    it('throws when fromIndex is out of bounds', async () => {
      const mockFolder = [
        {
          children: [{ id: 'item1', title: 'Item 1' }],
          id: '1',
          title: 'Test Folder',
        },
      ];

      when(mockBrowserBookmarks.getSubTree).calledWith('1').thenResolve(mockFolder);

      await expect(api.reorderItems('1', 2, 0)).rejects.toThrow('Invalid folder or index: 1, 2');
    });

    it('throws when no item exists at fromIndex', async () => {
      const mockFolder = [
        {
          children: [undefined],
          id: '1',
          title: 'Test Folder',
        },
      ];

      when(mockBrowserBookmarks.getSubTree)
        .calledWith('1')
        .thenResolve(mockFolder as unknown as browser.bookmarks.BookmarkTreeNode[]);

      await expect(api.reorderItems('1', 0, 1)).rejects.toThrow('Item not found at index 0');
    });
  });
});
