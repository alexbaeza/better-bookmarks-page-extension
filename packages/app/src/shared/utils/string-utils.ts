/**
 * String utility functions
 */

/**
 * Case-insensitive string inclusion check
 * Returns true if the search term is empty (matches everything)
 * @example
 * includesIgnoreCase('Hello World', 'hello') // true
 * includesIgnoreCase('Hello World', 'WORLD') // true
 * includesIgnoreCase('Hello World', '') // true
 */
export const includesIgnoreCase = (text: string, searchTerm: string): boolean => {
  if (!searchTerm) return true;
  return text.toLowerCase().includes(searchTerm.toLowerCase());
};

/**
 * Normalizes a string by trimming and converting to lowercase
 * @example
 * normalizeString('  Hello World  ') // 'hello world'
 */
export const normalizeString = (text: string): string => {
  return text.trim().toLowerCase();
};
