import { describe, expect, it } from 'vitest';
import * as types from '@/shared/types';

describe('shared types index', () => {
  describe('exports', () => {
    it('should export IBookmarkItem from bookmarks', () => {
      expect(types).toHaveProperty('BookmarkDisplayMode');
    });

    it('should export BookmarkDisplayMode from ui', () => {
      const { BookmarkDisplayMode } = types;
      expect(BookmarkDisplayMode).toBeDefined();
      expect(BookmarkDisplayMode.Grid).toBe('grid');
      expect(BookmarkDisplayMode.List).toBe('list');
    });

    it('should be an object', () => {
      expect(typeof types).toBe('object');
    });

    it('should export multiple types', () => {
      const exports = Object.keys(types);
      expect(exports.length).toBeGreaterThan(0);
    });
  });
});
