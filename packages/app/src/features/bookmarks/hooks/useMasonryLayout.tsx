import { useMemo } from 'react';

export interface UseMasonryLayoutOptions {
  columnCount: number;
  gap?: number;
}

export interface MasonryColumn<T> {
  items: T[];
  key: string;
}

/**
 * Custom hook that distributes items into masonry columns
 * Fills columns from left to right, always adding to the shortest column
 * This prevents empty columns in the middle
 */
export function useMasonryLayout<T>(
  items: T[],
  options: UseMasonryLayoutOptions,
  getItemHeight?: (item: T) => number
): MasonryColumn<T>[] {
  const { columnCount, gap = 16 } = options;

  return useMemo(() => {
    if (items.length === 0 || columnCount <= 0) {
      return [];
    }

    // If only one column, return all items in that column
    if (columnCount === 1) {
      return [
        {
          items,
          key: 'column-0',
        },
      ];
    }

    // Initialize columns
    const columns: MasonryColumn<T>[] = Array.from({ length: columnCount }, (_, index) => ({
      items: [],
      key: `column-${index}`,
    }));

    // Array to track the approximate height of each column
    const columnHeights = new Array(columnCount).fill(0);

    // Distribute items across columns
    for (const item of items) {
      // Find the column with the shortest height
      let shortestColumnIndex = 0;
      let shortestHeight = columnHeights[0];

      for (let i = 1; i < columnCount; i++) {
        if (columnHeights[i] < shortestHeight) {
          shortestHeight = columnHeights[i];
          shortestColumnIndex = i;
        }
      }

      // Add item to the shortest column
      columns[shortestColumnIndex].items.push(item);

      // Update column height
      // Use estimated height if available, otherwise use average
      const itemHeight = getItemHeight ? getItemHeight(item) : 200; // Default estimated height
      columnHeights[shortestColumnIndex] += itemHeight + gap;
    }

    return columns;
  }, [items, columnCount, gap, getItemHeight]);
}
