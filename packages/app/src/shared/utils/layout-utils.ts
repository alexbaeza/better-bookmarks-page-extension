/**
 * Layout utility functions
 */

/**
 * Calculates column count based on container width using Tailwind breakpoints
 * @example
 * calculateColumnCount(1200) // 4
 * calculateColumnCount(800) // 3
 * calculateColumnCount(500) // 1
 */
export const calculateColumnCount = (width: number, defaultWidth = 1200): number => {
  const actualWidth = width || defaultWidth;
  // Match Tailwind breakpoints: sm:640, md:768, lg:1024, 2xl:1536
  if (actualWidth >= 1536) return 4; // 2xl
  if (actualWidth >= 1024) return 4; // lg
  if (actualWidth >= 768) return 3; // md
  if (actualWidth >= 640) return 3; // sm
  return 1; // default
};
