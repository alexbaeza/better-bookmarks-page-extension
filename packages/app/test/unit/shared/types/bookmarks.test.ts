import { describe, expect, it } from 'vitest';
import type { BookmarkFormModalProps, IBookmarkItem } from '@/shared/types/bookmarks';

describe('bookmarks types', () => {
  describe('IBookmarkItem', () => {
    it('should accept a valid bookmark item with required fields', () => {
      const bookmark: IBookmarkItem = {
        id: '1',
        title: 'Test Bookmark',
      };

      expect(bookmark.id).toBe('1');
      expect(bookmark.title).toBe('Test Bookmark');
    });

    it('should accept optional url field', () => {
      const bookmark: IBookmarkItem = {
        id: '1',
        title: 'Test Bookmark',
        url: 'https://example.com',
      };

      expect(bookmark.url).toBe('https://example.com');
    });

    it('should accept optional children array', () => {
      const bookmark: IBookmarkItem = {
        id: '1',
        title: 'Test Folder',
        children: [
          { id: '2', title: 'Child 1' },
          { id: '3', title: 'Child 2' },
        ],
      };

      expect(bookmark.children).toHaveLength(2);
    });

    it('should accept all optional fields', () => {
      const bookmark: IBookmarkItem = {
        id: '1',
        title: 'Test Bookmark',
        index: 0,
        dateAdded: 1234567890,
        dateGroupModified: 1234567891,
        parentId: '0',
        url: 'https://example.com',
        children: [],
      };

      expect(bookmark).toMatchObject({
        id: '1',
        title: 'Test Bookmark',
        index: 0,
        dateAdded: 1234567890,
        dateGroupModified: 1234567891,
        parentId: '0',
        url: 'https://example.com',
        children: [],
      });
    });
  });

  describe('BookmarkFormModalProps', () => {
    it('should accept props with callbacks', () => {
      const onClose = () => {};
      const onSave = () => {};

      const props: BookmarkFormModalProps = {
        onClose,
        onSave,
      };

      expect(props.onClose).toBe(onClose);
      expect(props.onSave).toBe(onSave);
    });

    it('should accept optional initialValues', () => {
      const props: BookmarkFormModalProps = {
        onClose: () => {},
        onSave: () => {},
        initialValues: {
          title: 'Test',
          url: 'https://example.com',
        },
      };

      expect(props.initialValues?.title).toBe('Test');
      expect(props.initialValues?.url).toBe('https://example.com');
    });

    it('should accept initialValues without url', () => {
      const props: BookmarkFormModalProps = {
        onClose: () => {},
        onSave: () => {},
        initialValues: {
          title: 'Test Folder',
        },
      };

      expect(props.initialValues?.title).toBe('Test Folder');
      expect(props.initialValues?.url).toBeUndefined();
    });
  });
});
