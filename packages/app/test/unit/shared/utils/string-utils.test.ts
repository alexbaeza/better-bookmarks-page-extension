import { describe, expect, it } from 'vitest';
import { includesIgnoreCase, normalizeString } from '@/shared/utils/string-utils';

describe('string-utils', () => {
  describe('includesIgnoreCase', () => {
    it('should return true when search term is empty', () => {
      expect(includesIgnoreCase('Hello World', '')).toBe(true);
    });

    it('should return true when search term is falsy', () => {
      expect(includesIgnoreCase('Hello World', '')).toBe(true);
    });

    it('should handle whitespace-only search terms', () => {
      // Note: includesIgnoreCase doesn't trim, so whitespace-only strings are treated as normal strings
      expect(includesIgnoreCase('Hello World', '   ')).toBe(false);
      expect(includesIgnoreCase('   Hello World   ', '   ')).toBe(true);
    });

    it('should return true when text contains search term (case-insensitive)', () => {
      expect(includesIgnoreCase('Hello World', 'hello')).toBe(true);
      expect(includesIgnoreCase('Hello World', 'HELLO')).toBe(true);
      expect(includesIgnoreCase('Hello World', 'Hello')).toBe(true);
      expect(includesIgnoreCase('Hello World', 'world')).toBe(true);
      expect(includesIgnoreCase('Hello World', 'WORLD')).toBe(true);
      expect(includesIgnoreCase('Hello World', 'World')).toBe(true);
    });

    it('should return true when text contains search term in the middle', () => {
      expect(includesIgnoreCase('Hello World', 'lo wo')).toBe(true);
      expect(includesIgnoreCase('Hello World', 'LO WO')).toBe(true);
    });

    it('should return false when text does not contain search term', () => {
      expect(includesIgnoreCase('Hello World', 'xyz')).toBe(false);
      expect(includesIgnoreCase('Hello World', 'goodbye')).toBe(false);
    });

    it('should handle special characters', () => {
      expect(includesIgnoreCase('Hello-World', 'hello-world')).toBe(true);
      expect(includesIgnoreCase('Hello_World', 'hello_world')).toBe(true);
      expect(includesIgnoreCase('Hello.World', 'hello.world')).toBe(true);
    });

    it('should handle unicode characters', () => {
      expect(includesIgnoreCase('Café', 'café')).toBe(true);
      expect(includesIgnoreCase('Café', 'CAFÉ')).toBe(true);
    });
  });

  describe('normalizeString', () => {
    it('should trim whitespace and convert to lowercase', () => {
      expect(normalizeString('  Hello World  ')).toBe('hello world');
      expect(normalizeString('  HELLO WORLD  ')).toBe('hello world');
      expect(normalizeString('Hello World')).toBe('hello world');
    });

    it('should handle strings with only whitespace', () => {
      expect(normalizeString('   ')).toBe('');
      expect(normalizeString('\t\n')).toBe('');
    });

    it('should handle empty strings', () => {
      expect(normalizeString('')).toBe('');
    });

    it('should handle strings with tabs and newlines', () => {
      expect(normalizeString('  Hello\tWorld\n  ')).toBe('hello\tworld');
    });

    it('should preserve special characters', () => {
      expect(normalizeString('  Hello-World  ')).toBe('hello-world');
      expect(normalizeString('  Hello_World  ')).toBe('hello_world');
      expect(normalizeString('  Hello.World  ')).toBe('hello.world');
    });

    it('should handle unicode characters', () => {
      expect(normalizeString('  Café  ')).toBe('café');
      expect(normalizeString('  CAFÉ  ')).toBe('café');
    });
  });
});
