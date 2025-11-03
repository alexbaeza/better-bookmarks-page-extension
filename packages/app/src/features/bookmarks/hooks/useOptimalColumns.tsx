import { GRID_MIN_ITEM_WIDTH } from '@/config/constants';

export function useOptimalColumns(containerWidth: number, isList: boolean): number {
  if (isList) {
    return 1;
  }

  // Calculate optimal columns based on container width
  const minItemWidth = GRID_MIN_ITEM_WIDTH;
  const gap = 8; // 0.5rem gap

  const availableWidth = containerWidth - gap;
  const columns = Math.max(1, Math.floor(availableWidth / (minItemWidth + gap)));

  // Return calculated columns to fill the row based on available width
  return columns;
}
