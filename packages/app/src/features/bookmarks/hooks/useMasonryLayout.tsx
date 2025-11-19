import { useMemo } from 'react';

export interface UseMasonryLayoutOptions {
  columnCount: number;
  gap?: number;
}

export interface MasonryColumn<T> {
  items: T[];
  key: string;
}

const createColumns = <T,>(columnCount: number): MasonryColumn<T>[] => {
  return Array.from({ length: columnCount }, (_, index) => ({
    items: [],
    key: `column-${index}`,
  }));
};

const findShortestColumnIndex = (columnHeights: number[]): number => {
  let shortestColumnIndex = 0;
  let shortestHeight = columnHeights[0];

  for (let i = 1; i < columnHeights.length; i++) {
    if (columnHeights[i] < shortestHeight) {
      shortestHeight = columnHeights[i];
      shortestColumnIndex = i;
    }
  }

  return shortestColumnIndex;
};

const distributeItemsAcrossColumns = <T,>(
  items: T[],
  columns: MasonryColumn<T>[],
  columnHeights: number[],
  gap: number,
  getItemHeight?: (item: T) => number
): void => {
  for (const item of items) {
    const shortestColumnIndex = findShortestColumnIndex(columnHeights);

    // Add item to the shortest column
    columns[shortestColumnIndex].items.push(item);

    // Update column height
    const itemHeight = getItemHeight ? getItemHeight(item) : 200; // Default estimated height
    columnHeights[shortestColumnIndex] += itemHeight + gap;
  }
};

/**
 * Custom hook that distributes items into masonry columns
 * Fills columns from left to right, always adding to the shortest column
 * This prevents empty columns in the middle
 */
export const useMasonryLayout = <T,>(
  items: T[],
  options: UseMasonryLayoutOptions,
  getItemHeight?: (item: T) => number
): MasonryColumn<T>[] => {
  const { columnCount, gap = 16 } = options;

  return useMemo(() => {
    if (items.length === 0 || columnCount <= 0) {
      return [];
    }

    // If only one column, return all items in that column
    if (columnCount === 1) {
      return [{ items, key: 'column-0' }];
    }

    const columns = createColumns<T>(columnCount);
    const columnHeights = new Array(columnCount).fill(0);

    distributeItemsAcrossColumns(items, columns, columnHeights, gap, getItemHeight);

    return columns;
  }, [items, columnCount, gap, getItemHeight]);
};
