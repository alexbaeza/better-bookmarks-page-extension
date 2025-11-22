import { describe, expect, it } from 'vitest';
import { getLast, hasItems, isEmpty, removeLast, takeUntil, truncateWithEllipsis } from '@/shared/utils/array-utils';

describe('array-utils', () => {
  describe('removeLast', () => {
    it('should remove the last element from array', () => {
      expect(removeLast([1, 2, 3])).toEqual([1, 2]);
      expect(removeLast([1, 2, 3, 4, 5])).toEqual([1, 2, 3, 4]);
    });

    it('should return empty array when array has one element', () => {
      expect(removeLast([1])).toEqual([]);
    });

    it('should return empty array when array is empty', () => {
      expect(removeLast([])).toEqual([]);
    });

    it('should not mutate the original array', () => {
      const original = [1, 2, 3];
      const result = removeLast(original);
      expect(original).toEqual([1, 2, 3]);
      expect(result).toEqual([1, 2]);
    });
  });

  describe('takeUntil', () => {
    it('should return elements from start to index (inclusive)', () => {
      expect(takeUntil([1, 2, 3, 4], 2)).toEqual([1, 2, 3]);
      expect(takeUntil([1, 2, 3, 4], 0)).toEqual([1]);
      expect(takeUntil([1, 2, 3, 4], 3)).toEqual([1, 2, 3, 4]);
    });

    it('should return single element when index is 0', () => {
      expect(takeUntil([1, 2, 3], 0)).toEqual([1]);
    });

    it('should return empty array when index is -1', () => {
      expect(takeUntil([1, 2, 3], -1)).toEqual([]);
    });

    it('should not mutate the original array', () => {
      const original = [1, 2, 3, 4];
      const result = takeUntil(original, 2);
      expect(original).toEqual([1, 2, 3, 4]);
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe('getLast', () => {
    it('should return the last element', () => {
      expect(getLast([1, 2, 3])).toBe(3);
      expect(getLast(['a', 'b', 'c'])).toBe('c');
    });

    it('should return undefined for empty array', () => {
      expect(getLast([])).toBeUndefined();
    });

    it('should return the element when array has one element', () => {
      expect(getLast([1])).toBe(1);
    });
  });

  describe('hasItems', () => {
    it('should return true when array has items', () => {
      expect(hasItems([1, 2, 3])).toBe(true);
      expect(hasItems([1])).toBe(true);
    });

    it('should return false when array is empty', () => {
      expect(hasItems([])).toBe(false);
    });

    it('should return false when array is undefined', () => {
      expect(hasItems(undefined)).toBe(false);
    });

    it('should return false when array is null', () => {
      expect(hasItems(null)).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('should return true when array is empty', () => {
      expect(isEmpty([])).toBe(true);
    });

    it('should return false when array has items', () => {
      expect(isEmpty([1, 2, 3])).toBe(false);
      expect(isEmpty([1])).toBe(false);
    });

    it('should return true when array is undefined', () => {
      expect(isEmpty(undefined)).toBe(true);
    });

    it('should return true when array is null', () => {
      expect(isEmpty(null)).toBe(true);
    });
  });

  describe('truncateWithEllipsis', () => {
    it('should return full array when length is less than or equal to maxVisible', () => {
      const result1 = truncateWithEllipsis([1, 2], 2);
      expect(result1.display).toEqual([1, 2]);
      expect(result1.showEllipsis).toBe(false);

      const result2 = truncateWithEllipsis([1, 2, 3, 4], 4);
      expect(result2.display).toEqual([1, 2, 3, 4]);
      expect(result2.showEllipsis).toBe(false);

      const result3 = truncateWithEllipsis([1], 2);
      expect(result3.display).toEqual([1]);
      expect(result3.showEllipsis).toBe(false);
    });

    it('should truncate array when length exceeds maxVisible', () => {
      const result = truncateWithEllipsis([1, 2, 3, 4, 5, 6, 7], 2);
      expect(result.display).toEqual([1, 2, 6, 7]);
      expect(result.showEllipsis).toBe(true);
    });

    it('should show first two and last two items when truncating', () => {
      const result = truncateWithEllipsis([1, 2, 3, 4, 5, 6, 7, 8, 9], 4);
      expect(result.display).toEqual([1, 2, 8, 9]);
      expect(result.showEllipsis).toBe(true);
    });

    it('should handle array with exactly 5 items and maxVisible 4', () => {
      const result = truncateWithEllipsis([1, 2, 3, 4, 5], 4);
      expect(result.display).toEqual([1, 2, 4, 5]);
      expect(result.showEllipsis).toBe(true);
    });

    it('should handle array with 3 items and maxVisible 2', () => {
      const result = truncateWithEllipsis([1, 2, 3], 2);
      expect(result.display).toEqual([1, 2, 2, 3]);
      expect(result.showEllipsis).toBe(true);
    });

    it('should handle array with 4 items and maxVisible 2', () => {
      const result = truncateWithEllipsis([1, 2, 3, 4], 2);
      expect(result.display).toEqual([1, 2, 3, 4]);
      expect(result.showEllipsis).toBe(true);
    });

    it('should handle empty array', () => {
      const result = truncateWithEllipsis([], 2);
      expect(result.display).toEqual([]);
      expect(result.showEllipsis).toBe(false);
    });
  });
});
