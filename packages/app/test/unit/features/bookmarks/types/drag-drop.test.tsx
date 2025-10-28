import { describe, expect, it } from 'vitest';
import { DRAG_CONSTANTS, type DragItemType, type DragOperation } from '@/features/bookmarks/types/drag-drop';

describe('drag-drop types', () => {
  describe('DragItemType', () => {
    it('should accept folder type', () => {
      const type: DragItemType = 'folder';
      expect(type).toBe('folder');
    });

    it('should accept bookmark type', () => {
      const type: DragItemType = 'bookmark';
      expect(type).toBe('bookmark');
    });
  });

  describe('DragOperation', () => {
    it('should accept a valid drag operation', () => {
      const operation: DragOperation = {
        fromId: '1',
        toId: '2',
        fromParentId: 'parent1',
        toParentId: 'parent2',
        type: 'bookmark',
      };

      expect(operation.fromId).toBe('1');
      expect(operation.toId).toBe('2');
      expect(operation.fromParentId).toBe('parent1');
      expect(operation.toParentId).toBe('parent2');
      expect(operation.type).toBe('bookmark');
    });

    it('should accept null parent IDs', () => {
      const operation: DragOperation = {
        fromId: '1',
        toId: '2',
        fromParentId: null,
        toParentId: null,
        type: 'folder',
      };

      expect(operation.fromParentId).toBeNull();
      expect(operation.toParentId).toBeNull();
    });

    it('should accept folder type', () => {
      const operation: DragOperation = {
        fromId: '1',
        toId: '2',
        fromParentId: 'parent1',
        toParentId: 'parent2',
        type: 'folder',
      };

      expect(operation.type).toBe('folder');
    });
  });

  describe('DRAG_CONSTANTS', () => {
    it('should be defined', () => {
      expect(DRAG_CONSTANTS).toBeDefined();
    });

    it('should have ROOT_FOLDER constant', () => {
      expect(DRAG_CONSTANTS.ROOT_FOLDER).toBe('droppable-root-folder-');
    });

    it('should have SIDEBAR_FOLDER constant', () => {
      expect(DRAG_CONSTANTS.SIDEBAR_FOLDER).toBe('droppable-sidebar-folder-');
    });

    it('should have FLYOUT_FOLDER constant', () => {
      expect(DRAG_CONSTANTS.FLYOUT_FOLDER).toBe('droppable-fly-out-sidebar-folder-');
    });

    it('should be readonly', () => {
      expect(Object.isFrozen(DRAG_CONSTANTS)).toBe(false); // as const makes it readonly at type level
      expect(DRAG_CONSTANTS).toEqual({
        ROOT_FOLDER: 'droppable-root-folder-',
        SIDEBAR_FOLDER: 'droppable-sidebar-folder-',
        FLYOUT_FOLDER: 'droppable-fly-out-sidebar-folder-',
      });
    });

    it('should have all constants ending with hyphen', () => {
      expect(DRAG_CONSTANTS.ROOT_FOLDER.endsWith('-')).toBe(true);
      expect(DRAG_CONSTANTS.SIDEBAR_FOLDER.endsWith('-')).toBe(true);
      expect(DRAG_CONSTANTS.FLYOUT_FOLDER.endsWith('-')).toBe(true);
    });

    it('should have unique constant values', () => {
      const values = Object.values(DRAG_CONSTANTS);
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBe(values.length);
    });
  });
});
