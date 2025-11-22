import { describe, expect, it } from 'vitest';
import type { DraggableBookmarkItem } from '@/features/bookmarks/types/dnd';
import { isValidCrossFolderDrop, isValidSameFolderDrop } from '@/shared/utils/dnd-utils';

describe('dnd-utils', () => {
  describe('isValidCrossFolderDrop', () => {
    const createDroppedItem = (id: string, folderId: string): DraggableBookmarkItem => ({
      folderId,
      id,
      index: 0,
      title: 'Test Item',
      type: 'bookmark',
    });

    it('should return true for valid cross-folder drop', () => {
      const droppedItem = createDroppedItem('item-1', 'folder-1');
      expect(isValidCrossFolderDrop(droppedItem, 'folder-2', 'item-2', true)).toBe(true);
    });

    it('should return false when target is not a folder', () => {
      const droppedItem = createDroppedItem('item-1', 'folder-1');
      expect(isValidCrossFolderDrop(droppedItem, 'folder-2', 'item-2', false)).toBe(false);
    });

    it('should return false when dropping into the same folder', () => {
      const droppedItem = createDroppedItem('item-1', 'folder-1');
      expect(isValidCrossFolderDrop(droppedItem, 'folder-1', 'item-2', true)).toBe(false);
    });

    it('should return false when dropping onto itself', () => {
      const droppedItem = createDroppedItem('item-1', 'folder-1');
      expect(isValidCrossFolderDrop(droppedItem, 'folder-2', 'item-1', true)).toBe(false);
    });

    it('should return false when dropped item folderId matches target item id', () => {
      const droppedItem = createDroppedItem('item-1', 'folder-1');
      expect(isValidCrossFolderDrop(droppedItem, 'folder-2', 'folder-1', true)).toBe(false);
    });

    it('should return true when all conditions are met', () => {
      const droppedItem = createDroppedItem('item-1', 'folder-1');
      expect(isValidCrossFolderDrop(droppedItem, 'folder-3', 'item-3', true)).toBe(true);
    });
  });

  describe('isValidSameFolderDrop', () => {
    const createDroppedItem = (id: string, folderId: string): DraggableBookmarkItem => ({
      folderId,
      id,
      index: 0,
      title: 'Test Item',
      type: 'bookmark',
    });

    it('should return true when dropped item is from the same folder', () => {
      const droppedItem = createDroppedItem('item-1', 'folder-1');
      expect(isValidSameFolderDrop(droppedItem, 'folder-1')).toBe(true);
    });

    it('should return false when dropped item is from a different folder', () => {
      const droppedItem = createDroppedItem('item-1', 'folder-1');
      expect(isValidSameFolderDrop(droppedItem, 'folder-2')).toBe(false);
    });

    it('should return true for same folder with different items', () => {
      const droppedItem1 = createDroppedItem('item-1', 'folder-1');
      const droppedItem2 = createDroppedItem('item-2', 'folder-1');
      expect(isValidSameFolderDrop(droppedItem1, 'folder-1')).toBe(true);
      expect(isValidSameFolderDrop(droppedItem2, 'folder-1')).toBe(true);
    });
  });
});
