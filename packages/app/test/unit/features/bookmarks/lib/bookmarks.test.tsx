import { vi } from 'vitest';
import { when } from 'vitest-when';

import type { BrowserBookmarkAPI } from '@/features/bookmarks/lib/browser/types';

// Mock browser API implementation
const mockBrowserAPI: BrowserBookmarkAPI = {
  getBookmarksTree: vi.fn(),
  createBookmark: vi.fn(),
  updateBookmark: vi.fn(),
  removeBookmark: vi.fn(),
  moveBookmark: vi.fn(),
  getBookmark: vi.fn(),
  searchBookmarks: vi.fn(),
};

// Mock the factory to return our mock API
vi.mock('@/features/bookmarks/lib/browser/factory', () => ({
  createBookmarkAPI: () => mockBrowserAPI,
}));

describe('Bookmarks', () => {
  let bookmarksModule: typeof import('@/features/bookmarks/lib/bookmarks');

  beforeEach(async () => {
    vi.clearAllMocks();
    (global as typeof global & { chrome?: { runtime: { id: string } } }).chrome = { runtime: { id: 'test-extension' } };
    (global as typeof global & { browser?: { runtime: { id: string } } }).browser = { runtime: { id: 'test-extension' } };
    Object.defineProperty(navigator, 'userAgent', {
      value: 'Chrome/91.0.4472.124',
      writable: true,
    });
    (global as typeof global & { process?: { env: { NODE_ENV: string } } }).process = { env: { NODE_ENV: 'production' } };

    bookmarksModule = await import('@/features/bookmarks/lib/bookmarks');
  });

  describe('getBookmarksData', () => {
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

      when(mockBrowserAPI.getBookmarksTree).calledWith().thenResolve(mockTree);

      const result = await bookmarksModule.getBookmarksData();

      expect(result.folders).toHaveLength(1);
      expect(result.folders[0].id).toBe('1');
      expect(result.uncategorized?.children).toHaveLength(1);
      expect(result.uncategorized?.children?.[0]?.id).toBe('4');
    });
  });

  describe('create', () => {
    it('creates bookmark with valid parent', async () => {
      const createdItem = { id: '3', title: 'New Bookmark', url: 'http://new.com' };
      when(mockBrowserAPI.createBookmark).calledWith('1', { title: 'New Bookmark', url: 'http://new.com' }).thenResolve(createdItem);

      const result = await bookmarksModule.create('1', { title: 'New Bookmark', url: 'http://new.com' });

      expect(mockBrowserAPI.createBookmark).toHaveBeenCalledWith('1', { title: 'New Bookmark', url: 'http://new.com' });
      expect(result).toEqual(createdItem);
    });

    it('defaults to Uncategorized if parentId is null', async () => {
      const createdItem = { id: '3', title: 'New Bookmark', url: 'http://new.com' };
      when(mockBrowserAPI.createBookmark).calledWith(null, { title: 'New Bookmark', url: 'http://new.com' }).thenResolve(createdItem);

      await bookmarksModule.create(null, { title: 'New Bookmark', url: 'http://new.com' });

      expect(mockBrowserAPI.createBookmark).toHaveBeenCalledWith(null, { title: 'New Bookmark', url: 'http://new.com' });
    });
  });

  describe('update', () => {
    it('updates bookmark', async () => {
      const updatedItem = { id: '1', title: 'Updated Title', url: 'http://example.com' };
      when(mockBrowserAPI.updateBookmark).calledWith('1', { title: 'Updated Title' }).thenResolve(updatedItem);

      const result = await bookmarksModule.update('1', { title: 'Updated Title' });

      expect(mockBrowserAPI.updateBookmark).toHaveBeenCalledWith('1', { title: 'Updated Title' });
      expect(result).toEqual(updatedItem);
    });
  });

  describe('remove', () => {
    it('removes bookmark tree', async () => {
      when(mockBrowserAPI.removeBookmark).calledWith('1').thenResolve(undefined);

      await bookmarksModule.remove('1');

      expect(mockBrowserAPI.removeBookmark).toHaveBeenCalledWith('1');
    });
  });

  describe('move', () => {
    it('moves bookmark', async () => {
      when(mockBrowserAPI.moveBookmark).calledWith('1', '2', undefined).thenResolve(undefined);

      await bookmarksModule.move('1', { parentId: '2' });

      expect(mockBrowserAPI.moveBookmark).toHaveBeenCalledWith('1', '2', undefined);
    });
  });

  describe('get', () => {
    it('gets bookmark by id', async () => {
      const bookmark = { id: '1', title: 'Test Bookmark', url: 'http://example.com' };
      when(mockBrowserAPI.getBookmark).calledWith('1').thenResolve(bookmark);

      const result = await bookmarksModule.get('1');

      expect(mockBrowserAPI.getBookmark).toHaveBeenCalledWith('1');
      expect(result).toEqual(bookmark);
    });
  });

  describe('search', () => {
    it('searches bookmarks', async () => {
      const results = [{ id: '1', title: 'Test Bookmark', url: 'http://example.com' }];
      when(mockBrowserAPI.searchBookmarks).calledWith('test').thenResolve(results);

      const result = await bookmarksModule.search('test');

      expect(mockBrowserAPI.searchBookmarks).toHaveBeenCalledWith('test');
      expect(result).toEqual(results);
    });
  });
});
