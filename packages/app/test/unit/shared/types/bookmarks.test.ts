import { describe, expect, it } from 'vitest';
import type {
  BookmarkContentRendererProps,
  BookmarkFolderModalProps,
  BookmarkFolderRootProps,
  BookmarkFormModalProps,
  IBookmarkItem,
  RenderFoldersProps,
} from '@/shared/types/bookmarks';

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

  describe('BookmarkFolderRootProps', () => {
    it('should accept valid folder root props', () => {
      const props: BookmarkFolderRootProps = {
        folderId: '1',
        name: 'Test Folder',
        folderContents: [
          { id: '2', title: 'Bookmark 1' },
          { id: '3', title: 'Bookmark 2' },
        ],
      };

      expect(props.folderId).toBe('1');
      expect(props.name).toBe('Test Folder');
      expect(props.folderContents).toHaveLength(2);
    });

    it('should accept empty folderContents array', () => {
      const props: BookmarkFolderRootProps = {
        folderId: '1',
        name: 'Empty Folder',
        folderContents: [],
      };

      expect(props.folderContents).toHaveLength(0);
    });
  });

  describe('BookmarkContentRendererProps', () => {
    it('should accept valid content renderer props', () => {
      const props: BookmarkContentRendererProps = {
        folderContents: [{ id: '1', title: 'Test' }],
        folderId: '0',
      };

      expect(props.folderId).toBe('0');
      expect(props.folderContents).toHaveLength(1);
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

  describe('BookmarkFolderModalProps', () => {
    it('should accept required props', () => {
      const item: IBookmarkItem = { id: '1', title: 'Test' };
      const props: BookmarkFolderModalProps = {
        item,
        folderContents: [],
      };

      expect(props.item).toBe(item);
      expect(props.folderContents).toHaveLength(0);
    });

    it('should accept optional dataTestId', () => {
      const props: BookmarkFolderModalProps = {
        dataTestId: 'test-id',
        item: { id: '1', title: 'Test' },
        folderContents: [],
      };

      expect(props.dataTestId).toBe('test-id');
    });

    it('should accept optional dragHandleProps', () => {
      const dragHandleProps = { className: 'drag-handle' };
      const props: BookmarkFolderModalProps = {
        item: { id: '1', title: 'Test' },
        folderContents: [],
        dragHandleProps,
      };

      expect(props.dragHandleProps).toBe(dragHandleProps);
    });
  });

  describe('RenderFoldersProps', () => {
    it('should accept array of folders', () => {
      const props: RenderFoldersProps = {
        folders: [
          { id: '1', title: 'Folder 1' },
          { id: '2', title: 'Folder 2' },
        ],
      };

      expect(props.folders).toHaveLength(2);
    });

    it('should accept empty folders array', () => {
      const props: RenderFoldersProps = {
        folders: [],
      };

      expect(props.folders).toHaveLength(0);
    });
  });
});
