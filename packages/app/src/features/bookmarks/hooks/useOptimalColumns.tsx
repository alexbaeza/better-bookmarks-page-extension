export function useOptimalColumns(containerWidth: number, isList: boolean): number {
  if (isList) {
    return 1;
  }

  // Calculate optimal columns based on container width
  // Assuming each grid item has a minimum width of 100px
  const minItemWidth = 100;
  const gap = 8; // 0.5rem gap

  const availableWidth = containerWidth - gap;
  const columns = Math.max(1, Math.floor(availableWidth / (minItemWidth + gap)));

  // Cap at reasonable maximum
  return Math.min(columns, 20);
}
