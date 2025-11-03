import { describe, expect, it } from 'vitest';
import { DND_ITEM_TYPES } from '@/config/dnd-constants';

describe('dnd-constants', () => {
  describe('DND_ITEM_TYPES', () => {
    it('should be defined', () => {
      expect(DND_ITEM_TYPES).toBeDefined();
    });

    it('should have BOOKMARK type', () => {
      expect(DND_ITEM_TYPES.BOOKMARK).toBe('bookmark');
    });

    it('should be a const object', () => {
      expect(typeof DND_ITEM_TYPES).toBe('object');
      expect(DND_ITEM_TYPES).toBeDefined();
    });
  });
});
