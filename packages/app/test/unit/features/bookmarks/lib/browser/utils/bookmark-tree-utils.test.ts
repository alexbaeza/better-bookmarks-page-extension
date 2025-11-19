import { describe, expect, it } from 'vitest';
import {
  buildPathToFolder,
  findFolderById,
  findItemById,
  findParentOfItem,
} from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

describe('bookmark-tree-utils', () => {
  describe('buildPathToFolder', () => {
    it('should return empty array when folder is not found', () => {
      const tree: IBookmarkItem[] = [
        {
          id: 'folder-1',
          title: 'Folder 1',
          children: [],
        },
      ];

      const path = buildPathToFolder(tree, 'non-existent');
      expect(path).toEqual([]);
    });

    it('should return path for root-level folder', () => {
      const tree: IBookmarkItem[] = [
        {
          id: 'folder-1',
          title: 'Folder 1',
          children: [],
        },
        {
          id: 'folder-2',
          title: 'Folder 2',
          children: [],
        },
      ];

      const path = buildPathToFolder(tree, 'folder-1');
      expect(path).toEqual(['folder-1']);
    });

    it('should return path for nested folder', () => {
      const tree: IBookmarkItem[] = [
        {
          id: 'folder-1',
          title: 'Folder 1',
          children: [
            {
              id: 'subfolder-1',
              title: 'Subfolder 1',
              children: [],
            },
          ],
        },
      ];

      const path = buildPathToFolder(tree, 'subfolder-1');
      expect(path).toEqual(['folder-1', 'subfolder-1']);
    });

    it('should return path for deeply nested folder', () => {
      const tree: IBookmarkItem[] = [
        {
          id: 'folder-1',
          title: 'Folder 1',
          children: [
            {
              id: 'subfolder-1',
              title: 'Subfolder 1',
              children: [
                {
                  id: 'subsubfolder-1',
                  title: 'Sub-subfolder 1',
                  children: [],
                },
              ],
            },
          ],
        },
      ];

      const path = buildPathToFolder(tree, 'subsubfolder-1');
      expect(path).toEqual(['folder-1', 'subfolder-1', 'subsubfolder-1']);
    });

    it('should return path when multiple root folders exist', () => {
      const tree: IBookmarkItem[] = [
        {
          id: 'folder-1',
          title: 'Folder 1',
          children: [
            {
              id: 'subfolder-1',
              title: 'Subfolder 1',
              children: [],
            },
          ],
        },
        {
          id: 'folder-2',
          title: 'Folder 2',
          children: [],
        },
      ];

      const path = buildPathToFolder(tree, 'subfolder-1');
      expect(path).toEqual(['folder-1', 'subfolder-1']);
    });

    it('should return correct path when target is in second root folder', () => {
      const tree: IBookmarkItem[] = [
        {
          id: 'folder-1',
          title: 'Folder 1',
          children: [],
        },
        {
          id: 'folder-2',
          title: 'Folder 2',
          children: [
            {
              id: 'subfolder-2',
              title: 'Subfolder 2',
              children: [],
            },
          ],
        },
      ];

      const path = buildPathToFolder(tree, 'subfolder-2');
      expect(path).toEqual(['folder-2', 'subfolder-2']);
    });
  });

  describe('findItemById', () => {
    it('should find item in root level', () => {
      const tree: IBookmarkItem[] = [
        { id: 'item-1', title: 'Item 1', children: [] },
        { id: 'item-2', title: 'Item 2', children: [] },
      ];

      const result = findItemById(tree, 'item-1');
      expect(result).toEqual({ id: 'item-1', title: 'Item 1', children: [] });
    });

    it('should find item in nested level', () => {
      const tree: IBookmarkItem[] = [
        {
          id: 'folder-1',
          title: 'Folder 1',
          children: [{ id: 'item-1', title: 'Item 1', children: [] }],
        },
      ];

      const result = findItemById(tree, 'item-1');
      expect(result).toEqual({ id: 'item-1', title: 'Item 1', children: [] });
    });

    it('should return null when item not found', () => {
      const tree: IBookmarkItem[] = [{ id: 'item-1', title: 'Item 1', children: [] }];

      const result = findItemById(tree, 'non-existent');
      expect(result).toBeNull();
    });
  });

  describe('findParentOfItem', () => {
    it('should find parent of nested item', () => {
      const tree: IBookmarkItem[] = [
        {
          id: 'folder-1',
          title: 'Folder 1',
          children: [{ id: 'item-1', title: 'Item 1', children: [] }],
        },
      ];

      const result = findParentOfItem(tree, 'item-1');
      expect(result).toEqual({
        id: 'folder-1',
        title: 'Folder 1',
        children: [{ id: 'item-1', title: 'Item 1', children: [] }],
      });
    });

    it('should return null for root level item', () => {
      const tree: IBookmarkItem[] = [{ id: 'item-1', title: 'Item 1', children: [] }];

      const result = findParentOfItem(tree, 'item-1');
      expect(result).toBeNull();
    });
  });

  describe('findFolderById', () => {
    it('should find folder in root level', () => {
      const folders: IBookmarkItem[] = [
        { id: 'folder-1', title: 'Folder 1', children: [] },
        { id: 'folder-2', title: 'Folder 2', children: [] },
      ];

      const result = findFolderById(folders, 'folder-1');
      expect(result).toEqual({ id: 'folder-1', title: 'Folder 1', children: [] });
    });

    it('should find nested folder', () => {
      const folders: IBookmarkItem[] = [
        {
          id: 'folder-1',
          title: 'Folder 1',
          children: [{ id: 'subfolder-1', title: 'Subfolder 1', children: [] }],
        },
      ];

      const result = findFolderById(folders, 'subfolder-1');
      expect(result).toEqual({ id: 'subfolder-1', title: 'Subfolder 1', children: [] });
    });

    it('should return undefined when folder not found', () => {
      const folders: IBookmarkItem[] = [{ id: 'folder-1', title: 'Folder 1', children: [] }];

      const result = findFolderById(folders, 'non-existent');
      expect(result).toBeUndefined();
    });

    it('should return undefined for null id', () => {
      const folders: IBookmarkItem[] = [{ id: 'folder-1', title: 'Folder 1', children: [] }];

      const result = findFolderById(folders, null);
      expect(result).toBeUndefined();
    });
  });
});
