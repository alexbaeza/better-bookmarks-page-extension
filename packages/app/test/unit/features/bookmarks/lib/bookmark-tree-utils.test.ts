import { findFolderById, findItemById, findParentOfItem, updateChildrenInTree } from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

describe('bookmark-tree-utils', () => {
  const tree: IBookmarkItem[] = [
    {
      id: '1',
      title: 'Root1',
      children: [
        { id: '2', title: 'Child1' },
        {
          id: '3',
          title: 'Child2',
          children: [{ id: '4', title: 'Grandchild' }],
        },
      ],
    },
    { id: '5', title: 'Root2' },
  ];

  describe('findItemById', () => {
    it('finds item at root level', () => {
      const result = findItemById(tree, '1');
      expect(result?.id).toBe('1');
    });

    it('finds item in children', () => {
      const result = findItemById(tree, '2');
      expect(result?.id).toBe('2');
    });

    it('finds item in nested children', () => {
      const result = findItemById(tree, '4');
      expect(result?.id).toBe('4');
    });

    it('returns null if not found', () => {
      const result = findItemById(tree, '999');
      expect(result).toBeNull();
    });
  });

  describe('findParentOfItem', () => {
    it('finds parent of direct child', () => {
      const result = findParentOfItem(tree, '2');
      expect(result?.id).toBe('1');
    });

    it('finds parent of nested child', () => {
      const result = findParentOfItem(tree, '4');
      expect(result?.id).toBe('3');
    });

    it('returns null if no parent', () => {
      const result = findParentOfItem(tree, '1');
      expect(result).toBeNull();
    });
  });

  describe('updateChildrenInTree', () => {
    it('updates children of root item', () => {
      const newChildren = [{ id: '6', title: 'New Child' }];
      const result = updateChildrenInTree(tree, '1', newChildren);
      expect(result[0].children).toEqual(newChildren);
    });

    it('updates children of nested item', () => {
      const newChildren = [{ id: '7', title: 'New Grandchild' }];
      const result = updateChildrenInTree(tree, '3', newChildren);
      expect(result[0].children?.[1]?.children).toEqual(newChildren);
    });

    it('returns unchanged tree if id not found', () => {
      const result = updateChildrenInTree(tree, '999', []);
      expect(result).toEqual(tree);
    });
  });

  describe('findFolderById', () => {
    it('finds folder at root level', () => {
      const result = findFolderById(tree, '1');
      expect(result?.id).toBe('1');
    });

    it('finds folder in nested', () => {
      const result = findFolderById(tree, '3');
      expect(result?.id).toBe('3');
    });

    it('returns undefined if not found', () => {
      const result = findFolderById(tree, '999');
      expect(result).toBeUndefined();
    });

    it('returns undefined for null id', () => {
      const result = findFolderById(tree, null);
      expect(result).toBeUndefined();
    });
  });
});
