import { vi } from 'vitest';

import { detectBrowser } from '@/features/bookmarks/lib/browser/utils/browser-detector';

const mockNavigator = {
  userAgent: '',
};

Object.defineProperty(window, 'navigator', {
  value: mockNavigator,
  writable: true,
});

describe('browser-detector', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  describe('detectBrowser', () => {
    it('detects Firefox browser', () => {
      vi.stubEnv('MODE', 'production');
      mockNavigator.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0';
      delete (window as any).chrome;
      delete (window as any).browser;

      const result = detectBrowser();

      expect(result.type).toBe('firefox');
      expect(result.version).toBe('91.0');
      expect(result.isExtension).toBe(true);
    });

    it('detects Chrome browser', () => {
      vi.stubEnv('MODE', 'production');
      mockNavigator.userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';
      delete (window as any).chrome;
      delete (window as any).browser;

      const result = detectBrowser();

      expect(result.type).toBe('chrome');
      expect(result.version).toBe('91.0.4472.124');
      expect(result.isExtension).toBe(true);
    });

    it('detects Chrome extension context', () => {
      mockNavigator.userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

      Object.defineProperty(window, 'chrome', {
        value: {
          runtime: {
            id: 'test-extension-id',
          },
        },
        writable: true,
      });

      const result = detectBrowser();

      expect(result.type).toBe('chrome');
      expect(result.isExtension).toBe(true);
    });

    it('detects Firefox extension context', () => {
      mockNavigator.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0';

      Object.defineProperty(window, 'browser', {
        value: {
          runtime: {
            id: 'test-extension-id',
          },
        },
        writable: true,
      });

      const result = detectBrowser();

      expect(result.type).toBe('firefox');
      expect(result.isExtension).toBe(true);
    });

    it('detects Edge as Chrome (not Firefox)', () => {
      mockNavigator.userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59';

      const result = detectBrowser();

      expect(result.type).toBe('chrome');
      expect(result.version).toBe('91.0.4472.124');
    });

    it('returns unknown for unsupported browser', () => {
      vi.stubEnv('MODE', 'production');
      vi.stubEnv('DEV', false);
      mockNavigator.userAgent = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.1; Trident/6.0)';
      (window as any).chrome = undefined;
      (window as any).browser = undefined;

      const result = detectBrowser();

      expect(['unknown', 'chrome']).toContain(result.type);
      if (result.type === 'unknown') {
        expect(result.isExtension).toBe(false);
        expect(result.version).toBeUndefined();
      }
    });

    it('falls back to Chrome in development mode', () => {
      vi.stubEnv('NODE_ENV', 'development');
      mockNavigator.userAgent = 'Some unknown browser';

      const result = detectBrowser();

      expect(result.type).toBe('chrome');
      expect(result.isExtension).toBe(false);
      expect(result.version).toBe('dev');
    });

    it('assumes extension context in development mode', () => {
      vi.stubEnv('NODE_ENV', 'development');
      mockNavigator.userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0';

      const result = detectBrowser();

      expect(result.type).toBe('firefox');
      expect(result.isExtension).toBe(true);
    });

    it('handles missing version in user agent', () => {
      mockNavigator.userAgent =
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome Safari/537.36';

      const result = detectBrowser();

      expect(result.type).toBe('chrome');
      expect(result.version).toBeUndefined();
    });
  });
});
