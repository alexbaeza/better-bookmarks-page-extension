import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as bookmarksModule from '@/features/bookmarks/lib/bookmarks';
import * as factory from '@/features/bookmarks/lib/browser/factory';

describe('bookmarks module', () => {
  const mockAPI = {
    createBookmark: vi.fn(),
    getBookmark: vi.fn(),
    getBookmarksTree: vi.fn(),
    moveBookmark: vi.fn(),
    removeBookmark: vi.fn(),
    searchBookmarks: vi.fn(),
    updateBookmark: vi.fn(),
    reorderItems: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(factory, 'createBookmarkAPI').mockReturnValue(mockAPI);
  });

  describe('loadBookmarksTree', () => {
    it('parses bookmark tree correctly', async () => {
      const mockTree = {
        folders: [
          {
            id: '1',
            title: 'Folder1',
            children: [{ id: '2', title: 'Bookmark1', url: 'http://example.com' }],
          },
        ],
        uncategorized: {
          id: '3',
          title: 'Uncategorized',
          children: [{ id: '4', title: 'Uncategorized Bookmark', url: 'http://test.com' }],
        },
      };

      mockAPI.getBookmarksTree.mockResolvedValue(mockTree);

      const result = await bookmarksModule.loadBookmarksTree();

      expect(result.folders).toHaveLength(1);
      expect(result.folders[0].id).toBe('1');
      expect(result.uncategorized?.children?.[0]?.id).toBe('4');
    });
  });

  describe('createBookmark', () => {
    it('creates bookmark with valid parent', async () => {
      const createdItem = {
        children: undefined,
        dateAdded: undefined,
        dateGroupModified: undefined,
        id: '3',
        parentId: undefined,
        title: 'New Bookmark',
        url: 'http://new.com',
      };
      mockAPI.createBookmark.mockResolvedValue(createdItem);

      const result = await bookmarksModule.createBookmark('1', { title: 'New Bookmark', url: 'http://new.com' });

      expect(mockAPI.createBookmark).toHaveBeenCalledWith('1', { title: 'New Bookmark', url: 'http://new.com' });
      expect(result).toStrictEqual(createdItem);
    });
  });

  describe('updateBookmark', () => {
    it('updates bookmark', async () => {
      const updatedItem = {
        children: undefined,
        dateAdded: undefined,
        dateGroupModified: undefined,
        id: '1',
        parentId: undefined,
        title: 'Updated Title',
        url: 'http://example.com',
      };
      mockAPI.updateBookmark.mockResolvedValue(updatedItem);

      const result = await bookmarksModule.updateBookmark('1', { title: 'Updated Title' });

      expect(mockAPI.updateBookmark).toHaveBeenCalledWith('1', { title: 'Updated Title' });
      expect(result).toStrictEqual(updatedItem);
    });
  });

  describe('removeBookmark', () => {
    it('removes bookmark tree', async () => {
      mockAPI.removeBookmark.mockResolvedValue(undefined);

      await bookmarksModule.removeBookmark('1');

      expect(mockAPI.removeBookmark).toHaveBeenCalledWith('1');
    });
  });

  describe('moveBookmark', () => {
    it('moves bookmark', async () => {
      mockAPI.moveBookmark.mockResolvedValue(undefined);

      await bookmarksModule.moveBookmark('1', { parentId: '2' });

      expect(mockAPI.moveBookmark).toHaveBeenCalledWith('1', '2', undefined);
    });
  });

  describe('getBookmarkById', () => {
    it('gets bookmark by id', async () => {
      const bookmark = {
        children: undefined,
        dateAdded: undefined,
        dateGroupModified: undefined,
        id: '1',
        parentId: undefined,
        title: 'Test Bookmark',
        url: 'http://example.com',
      };
      mockAPI.getBookmark.mockResolvedValue(bookmark);

      const result = await bookmarksModule.getBookmarkById('1');

      expect(mockAPI.getBookmark).toHaveBeenCalledWith('1');
      expect(result).toStrictEqual(bookmark);
    });
  });

  describe('searchBookmarks', () => {
    it('searches bookmarks', async () => {
      const results = [
        {
          children: undefined,
          dateAdded: undefined,
          dateGroupModified: undefined,
          id: '1',
          parentId: undefined,
          title: 'Test Bookmark',
          url: 'http://example.com',
        },
      ];
      mockAPI.searchBookmarks.mockResolvedValue(results);

      const result = await bookmarksModule.searchBookmarks('test');

      expect(mockAPI.searchBookmarks).toHaveBeenCalledWith('test');
      expect(result).toStrictEqual(results);
    });
  });
});
