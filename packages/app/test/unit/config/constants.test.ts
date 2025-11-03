import { describe, expect, it } from 'vitest';
import {
  APP_DONATION_URL,
  APP_FAVICON_URL,
  APP_REPO_URL,
  APP_VERSION,
  LOCAL_STORAGE_PREFIX_KEY,
} from '@/config/constants';

describe('constants', () => {
  describe('APP_VERSION', () => {
    it('should be defined', () => {
      expect(APP_VERSION).toBeDefined();
    });

    it('should be a string', () => {
      expect(typeof APP_VERSION).toBe('string');
    });

    it('should have a valid version format', () => {
      expect(APP_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  describe('APP_FAVICON_URL', () => {
    it('should be defined', () => {
      expect(APP_FAVICON_URL).toBeDefined();
    });

    it('should contain the expected favicon URL template', () => {
      expect(APP_FAVICON_URL).toBe('https://icons.duckduckgo.com/ip3/{domain}.ico');
    });

    it('should include domain placeholder', () => {
      expect(APP_FAVICON_URL).toContain('{domain}');
    });
  });

  describe('APP_REPO_URL', () => {
    it('should be defined', () => {
      expect(APP_REPO_URL).toBeDefined();
    });

    it('should point to the correct GitHub repository', () => {
      expect(APP_REPO_URL).toBe('https://github.com/alexbaeza/better-bookmarks-page-extension');
    });

    it('should be a valid URL', () => {
      expect(() => new URL(APP_REPO_URL)).not.toThrow();
    });
  });

  describe('APP_DONATION_URL', () => {
    it('should be defined', () => {
      expect(APP_DONATION_URL).toBeDefined();
    });

    it('should point to the buymeacoffee URL', () => {
      expect(APP_DONATION_URL).toBe('https://www.buymeacoffee.com/alexbaeza');
    });

    it('should be a valid URL', () => {
      expect(() => new URL(APP_DONATION_URL)).not.toThrow();
    });
  });

  describe('LOCAL_STORAGE_PREFIX_KEY', () => {
    it('should be defined', () => {
      expect(LOCAL_STORAGE_PREFIX_KEY).toBeDefined();
    });

    it('should be the expected prefix', () => {
      expect(LOCAL_STORAGE_PREFIX_KEY).toBe('BB-');
    });

    it('should be a non-empty string', () => {
      expect(LOCAL_STORAGE_PREFIX_KEY.length).toBeGreaterThan(0);
    });
  });
});
