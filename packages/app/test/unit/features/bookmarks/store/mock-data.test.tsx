import { describe, expect, it } from 'vitest';
import { mockData } from '@/features/bookmarks/store/mock-data';

describe('mock-data', () => {
  it('should be defined', () => {
    expect(mockData).toBeDefined();
  });

  it('should be an array', () => {
    expect(Array.isArray(mockData)).toBe(true);
  });

  it('should have root bookmark item', () => {
    expect(mockData).toHaveLength(1);
    expect(mockData[0].id).toBe('0');
  });

  it('should have root item with children', () => {
    expect(mockData[0].children).toBeDefined();
    expect(mockData[0].children?.length).toBeGreaterThan(0);
  });

  describe('root structure', () => {
    it('should have Bookmarks Menu folder', () => {
      const bookmarksMenu = mockData[0].children?.find((item) => item.title === 'Bookmarks Menu');
      expect(bookmarksMenu).toBeDefined();
      expect(bookmarksMenu?.id).toBe('1');
    });

    it('should have Bookmarks Toolbar folder', () => {
      const bookmarksToolbar = mockData[0].children?.find((item) => item.title === 'Bookmarks Toolbar');
      expect(bookmarksToolbar).toBeDefined();
      expect(bookmarksToolbar?.id).toBe('2');
    });

    it('should have Other Bookmarks folder', () => {
      const otherBookmarks = mockData[0].children?.find((item) => item.title === 'Other Bookmarks');
      expect(otherBookmarks).toBeDefined();
      expect(otherBookmarks?.id).toBe('3');
    });
  });

  describe('bookmark properties', () => {
    it('should have bookmarks with IDs', () => {
      const hasIds = mockData[0].children?.every((item) => typeof item.id === 'string');
      expect(hasIds).toBe(true);
    });

    it('should have bookmarks with titles', () => {
      const hasTitles = mockData[0].children?.every((item) => typeof item.title === 'string');
      expect(hasTitles).toBe(true);
    });

    it('should have bookmarks with dateAdded', () => {
      const hasDates = mockData[0].children?.every((item) => typeof item.dateAdded === 'number');
      expect(hasDates).toBe(true);
    });

    it('should have bookmarks with parentId', () => {
      const hasParentId = mockData[0].children?.every((item) => typeof item.parentId === 'string');
      expect(hasParentId).toBe(true);
    });
  });

  describe('nested structure', () => {
    it('should have nested folders', () => {
      const bookmarksMenu = mockData[0].children?.find((item) => item.id === '1');
      expect(bookmarksMenu?.children).toBeDefined();
      expect(bookmarksMenu?.children?.length).toBeGreaterThan(0);
    });

    it('should have deeply nested bookmarks', () => {
      const hasNestedItem = (items: any[]): boolean => {
        return items.some(
          (item) =>
            item.children &&
            item.children.length > 0 &&
            (hasNestedItem(item.children) || item.children.some((child: any) => child.children && child.children.length > 0))
        );
      };
      expect(hasNestedItem(mockData[0].children ?? [])).toBe(true);
    });
  });

  describe('bookmark types', () => {
    it('should have folders (items with children)', () => {
      const hasFolder = mockData[0].children?.some((item) => item.children !== undefined);
      expect(hasFolder).toBe(true);
    });

    it('should have bookmarks (items with url)', () => {
      const findBookmarkWithUrl = (items: any[]): boolean => {
        return items.some((item) => item.url || (item.children && findBookmarkWithUrl(item.children)));
      };
      expect(findBookmarkWithUrl(mockData[0].children ?? [])).toBe(true);
    });
  });

  describe('special cases', () => {
    it('should have empty folders', () => {
      const findEmptyFolder = (items: any[]): boolean => {
        return items.some((item) => (item.children && item.children.length === 0) || (item.children && findEmptyFolder(item.children)));
      };
      expect(findEmptyFolder(mockData[0].children ?? [])).toBe(true);
    });

    it('should have folder with special characters in title', () => {
      const findSpecialChars = (items: any[]): boolean => {
        return items.some((item) => /[!@#$%^&*()]/.test(item.title) || (item.children && findSpecialChars(item.children)));
      };
      expect(findSpecialChars(mockData[0].children ?? [])).toBe(true);
    });

    it('should have loose bookmarks', () => {
      const looseBookmarks = mockData[0].children?.filter((item) => item.url);
      expect(looseBookmarks.length).toBeGreaterThan(0);
    });

    it('should have bookmark with empty title', () => {
      const findEmptyTitle = (items: any[]): boolean => {
        return items.some((item) => item.title === '' || (item.children && findEmptyTitle(item.children)));
      };
      expect(findEmptyTitle(mockData[0].children ?? [])).toBe(true);
    });
  });

  describe('emoji support', () => {
    it('should have folders with emoji in titles', () => {
      const hasEmoji = (items: any[]): boolean => {
        return items.some((item) => /[\p{Emoji}]/u.test(item.title) || (item.children && hasEmoji(item.children)));
      };
      expect(hasEmoji(mockData[0].children ?? [])).toBe(true);
    });
  });
});
