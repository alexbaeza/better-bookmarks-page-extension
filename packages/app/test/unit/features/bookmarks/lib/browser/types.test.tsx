import { describe, expect, it } from 'vitest';
import type { BrowserBookmarkAPI, NormalizedBookmarkItem, NormalizedBookmarkTree } from '@/features/bookmarks/lib/browser/types';

describe('browser types', () => {
  describe('NormalizedBookmarkItem', () => {
    it('should accept required fields', () => {
      const item: NormalizedBookmarkItem = {
        id: '1',
        title: 'Test Bookmark',
      };

      expect(item.id).toBe('1');
      expect(item.title).toBe('Test Bookmark');
    });

    it('should accept optional parentId', () => {
      const item: NormalizedBookmarkItem = {
        id: '1',
        title: 'Test',
        parentId: '0',
      };

      expect(item.parentId).toBe('0');
    });

    it('should accept optional url', () => {
      const item: NormalizedBookmarkItem = {
        id: '1',
        title: 'Test',
        url: 'https://example.com',
      };

      expect(item.url).toBe('https://example.com');
    });

    it('should accept optional children array', () => {
      const item: NormalizedBookmarkItem = {
        id: '1',
        title: 'Test Folder',
        children: [
          { id: '2', title: 'Child 1' },
          { id: '3', title: 'Child 2' },
        ],
      };

      expect(item.children).toHaveLength(2);
    });

    it('should accept optional dateAdded', () => {
      const item: NormalizedBookmarkItem = {
        id: '1',
        title: 'Test',
        dateAdded: 1234567890,
      };

      expect(item.dateAdded).toBe(1234567890);
    });

    it('should accept optional dateGroupModified', () => {
      const item: NormalizedBookmarkItem = {
        id: '1',
        title: 'Test',
        dateGroupModified: 1234567891,
      };

      expect(item.dateGroupModified).toBe(1234567891);
    });

    it('should accept all fields', () => {
      const item: NormalizedBookmarkItem = {
        id: '1',
        parentId: '0',
        title: 'Test',
        url: 'https://example.com',
        children: [],
        dateAdded: 1234567890,
        dateGroupModified: 1234567891,
      };

      expect(item).toMatchObject({
        id: '1',
        parentId: '0',
        title: 'Test',
        url: 'https://example.com',
        children: [],
        dateAdded: 1234567890,
        dateGroupModified: 1234567891,
      });
    });
  });

  describe('NormalizedBookmarkTree', () => {
    it('should accept folders array', () => {
      const tree: NormalizedBookmarkTree = {
        folders: [
          { id: '1', title: 'Folder 1' },
          { id: '2', title: 'Folder 2' },
        ],
      };

      expect(tree.folders).toHaveLength(2);
    });

    it('should accept optional uncategorized folder', () => {
      const tree: NormalizedBookmarkTree = {
        folders: [],
        uncategorized: {
          id: 'uncategorized',
          title: 'Uncategorized',
          children: [],
        },
      };

      expect(tree.uncategorized).toBeDefined();
      expect(tree.uncategorized?.title).toBe('Uncategorized');
    });

    it('should accept empty folders array', () => {
      const tree: NormalizedBookmarkTree = {
        folders: [],
      };

      expect(tree.folders).toHaveLength(0);
    });
  });

  describe('BrowserBookmarkAPI', () => {
    it('should define all required methods', () => {
      const mockAPI: BrowserBookmarkAPI = {
        getBookmarksTree: async () => ({ folders: [] }),
        createBookmark: async () => ({ id: '1', title: 'Test' }),
        removeBookmark: async () => {},
        updateBookmark: async () => ({ id: '1', title: 'Updated' }),
        moveBookmark: async () => {},
        getBookmark: async () => null,
        searchBookmarks: async () => [],
        reorderItems: async () => {},
      };

      expect(typeof mockAPI.getBookmarksTree).toBe('function');
      expect(typeof mockAPI.createBookmark).toBe('function');
      expect(typeof mockAPI.removeBookmark).toBe('function');
      expect(typeof mockAPI.updateBookmark).toBe('function');
      expect(typeof mockAPI.moveBookmark).toBe('function');
      expect(typeof mockAPI.getBookmark).toBe('function');
      expect(typeof mockAPI.searchBookmarks).toBe('function');
      expect(typeof mockAPI.reorderItems).toBe('function');
    });

    it('getBookmarksTree should return Promise<NormalizedBookmarkTree>', async () => {
      const mockAPI: BrowserBookmarkAPI = {
        getBookmarksTree: async () => ({ folders: [] }),
        createBookmark: async () => ({ id: '1', title: 'Test' }),
        removeBookmark: async () => {},
        updateBookmark: async () => ({ id: '1', title: 'Updated' }),
        moveBookmark: async () => {},
        getBookmark: async () => null,
        searchBookmarks: async () => [],
        reorderItems: async () => {},
      };

      const result = await mockAPI.getBookmarksTree();
      expect(result).toHaveProperty('folders');
      expect(Array.isArray(result.folders)).toBe(true);
    });

    it('createBookmark should accept parentId and details', async () => {
      const mockAPI: BrowserBookmarkAPI = {
        getBookmarksTree: async () => ({ folders: [] }),
        createBookmark: async (parentId, details) => ({
          id: '1',
          title: details.title,
          url: details.url,
          parentId: parentId || undefined,
        }),
        removeBookmark: async () => {},
        updateBookmark: async () => ({ id: '1', title: 'Updated' }),
        moveBookmark: async () => {},
        getBookmark: async () => null,
        searchBookmarks: async () => [],
        reorderItems: async () => {},
      };

      const result = await mockAPI.createBookmark('parent1', {
        title: 'New Bookmark',
        url: 'https://example.com',
      });

      expect(result.title).toBe('New Bookmark');
      expect(result.url).toBe('https://example.com');
    });
  });
});
