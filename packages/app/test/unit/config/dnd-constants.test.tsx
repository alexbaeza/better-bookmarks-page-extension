import { describe, expect, it } from 'vitest';
import { DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX, DROPPABLE_ROOT_FOLDER_PREFIX, DROPPABLE_SIDEBAR_FOLDER_PREFIX } from '@/config/dnd-constants';

describe('dnd-constants', () => {
  describe('DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX', () => {
    it('should be defined', () => {
      expect(DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX).toBeDefined();
    });

    it('should have the expected value', () => {
      expect(DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX).toBe('droppable-fly-out-sidebar-folder-');
    });

    it('should end with a hyphen for concatenation', () => {
      expect(DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX.endsWith('-')).toBe(true);
    });
  });

  describe('DROPPABLE_SIDEBAR_FOLDER_PREFIX', () => {
    it('should be defined', () => {
      expect(DROPPABLE_SIDEBAR_FOLDER_PREFIX).toBeDefined();
    });

    it('should have the expected value', () => {
      expect(DROPPABLE_SIDEBAR_FOLDER_PREFIX).toBe('droppable-sidebar-folder-');
    });

    it('should end with a hyphen for concatenation', () => {
      expect(DROPPABLE_SIDEBAR_FOLDER_PREFIX.endsWith('-')).toBe(true);
    });
  });

  describe('DROPPABLE_ROOT_FOLDER_PREFIX', () => {
    it('should be defined', () => {
      expect(DROPPABLE_ROOT_FOLDER_PREFIX).toBeDefined();
    });

    it('should have the expected value', () => {
      expect(DROPPABLE_ROOT_FOLDER_PREFIX).toBe('droppable-root-folder-');
    });

    it('should end with a hyphen for concatenation', () => {
      expect(DROPPABLE_ROOT_FOLDER_PREFIX.endsWith('-')).toBe(true);
    });
  });

  describe('prefix uniqueness', () => {
    it('should have unique prefixes', () => {
      const prefixes = [DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX, DROPPABLE_SIDEBAR_FOLDER_PREFIX, DROPPABLE_ROOT_FOLDER_PREFIX];

      const uniquePrefixes = new Set(prefixes);
      expect(uniquePrefixes.size).toBe(prefixes.length);
    });
  });
});
