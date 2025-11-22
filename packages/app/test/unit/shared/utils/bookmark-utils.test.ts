import { describe, expect, it } from 'vitest';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { isBookmark, isBookmarkFolder } from '@/shared/utils/bookmark-utils';

describe('bookmark-utils', () => {
  describe('isBookmarkFolder', () => {
    it('should return true when item has children array', () => {
      const folder: IBookmarkItem = {
        children: [],
        id: 'folder-1',
        title: 'Folder',
      };
      expect(isBookmarkFolder(folder)).toBe(true);
    });

    it('should return true when item has non-empty children array', () => {
      const folder: IBookmarkItem = {
        children: [
          {
            id: 'child-1',
            title: 'Child',
          },
        ],
        id: 'folder-1',
        title: 'Folder',
      };
      expect(isBookmarkFolder(folder)).toBe(true);
    });

    it('should return false when item has no children property', () => {
      const bookmark: IBookmarkItem = {
        id: 'bookmark-1',
        title: 'Bookmark',
        url: 'https://example.com',
      };
      expect(isBookmarkFolder(bookmark)).toBe(false);
    });

    it('should return false when children is not an array', () => {
      const item = {
        children: null,
        id: 'item-1',
        title: 'Item',
      } as unknown as IBookmarkItem;
      expect(isBookmarkFolder(item)).toBe(false);
    });

    it('should return false when children is undefined', () => {
      const item = {
        id: 'item-1',
        title: 'Item',
      } as IBookmarkItem;
      expect(isBookmarkFolder(item)).toBe(false);
    });
  });

  describe('isBookmark', () => {
    it('should return true when item has URL', () => {
      const bookmark: IBookmarkItem = {
        id: 'bookmark-1',
        title: 'Bookmark',
        url: 'https://example.com',
      };
      expect(isBookmark(bookmark)).toBe(true);
    });

    it('should return true when item has empty URL string', () => {
      const bookmark: IBookmarkItem = {
        id: 'bookmark-1',
        title: 'Bookmark',
        url: '',
      };
      expect(isBookmark(bookmark)).toBe(true);
    });

    it('should return false when item has no URL property', () => {
      const folder: IBookmarkItem = {
        children: [],
        id: 'folder-1',
        title: 'Folder',
      };
      expect(isBookmark(folder)).toBe(false);
    });

    it('should return false when URL is null', () => {
      const item = {
        id: 'item-1',
        title: 'Item',
        url: null,
      } as unknown as IBookmarkItem;
      expect(isBookmark(item)).toBe(false);
    });

    it('should return false when URL is undefined', () => {
      const item = {
        id: 'item-1',
        title: 'Item',
      } as IBookmarkItem;
      expect(isBookmark(item)).toBe(false);
    });
  });
});
