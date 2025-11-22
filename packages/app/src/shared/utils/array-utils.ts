/**
 * Array utility functions
 */

/**
 * Returns a new array without the last element
 * @example
 * removeLast([1, 2, 3]) // [1, 2]
 * removeLast([1]) // []
 * removeLast([]) // []
 */
export const removeLast = <T>(array: T[]): T[] => {
  return array.slice(0, -1);
};

/**
 * Returns a new array containing elements from start up to (and including) the specified index
 * @example
 * takeUntil([1, 2, 3, 4], 2) // [1, 2, 3]
 * takeUntil([1, 2, 3, 4], 0) // [1]
 */
export const takeUntil = <T>(array: T[], index: number): T[] => {
  return array.slice(0, index + 1);
};

/**
 * Returns the last element of an array, or undefined if empty
 * @example
 * getLast([1, 2, 3]) // 3
 * getLast([]) // undefined
 */
export const getLast = <T>(array: T[]): T | undefined => {
  return array.length > 0 ? array[array.length - 1] : undefined;
};

/**
 * Checks if an array has elements
 * @example
 * hasItems([1, 2]) // true
 * hasItems([]) // false
 */
export const hasItems = <T>(array: T[] | undefined | null): boolean => {
  return (array?.length ?? 0) > 0;
};

/**
 * Checks if an array is empty
 * @example
 * isEmpty([]) // true
 * isEmpty([1]) // false
 */
export const isEmpty = <T>(array: T[] | undefined | null): boolean => {
  return (array?.length ?? 0) === 0;
};

/**
 * Truncates an array to show first N items, ellipsis, and last N items
 * Returns the truncated array and whether ellipsis should be shown
 * @example
 * truncateWithEllipsis([1, 2, 3, 4, 5], 2) // { display: [1, 2, 3, 4, 5], showEllipsis: false }
 * truncateWithEllipsis([1, 2, 3, 4, 5, 6, 7], 2) // { display: [1, 2, 6, 7], showEllipsis: true }
 */
export const truncateWithEllipsis = <T>(array: T[], maxVisible: number): { display: T[]; showEllipsis: boolean } => {
  if (array.length <= maxVisible) {
    return { display: array, showEllipsis: false };
  }

  const _itemsToShow = Math.floor(maxVisible / 2);
  const lastItem = getLast(array);
  const secondLastItem = array[array.length - 2];

  const display: T[] = [];
  if (array[0]) display.push(array[0]);
  if (array[1]) display.push(array[1]);
  if (secondLastItem) display.push(secondLastItem);
  if (lastItem) display.push(lastItem);

  return {
    display,
    showEllipsis: true,
  };
};
