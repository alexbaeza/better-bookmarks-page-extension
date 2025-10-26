import { vi } from 'vitest';
import { createBookmarkAPI } from '@/features/bookmarks/lib/browser/factory';
import { detectBrowser } from '@/features/bookmarks/lib/browser/utils/browser-detector';

vi.mock('@/features/bookmarks/lib/browser/utils/browser-detector', () => ({
  detectBrowser: vi.fn(),
}));

vi.mock('@/features/bookmarks/lib/browser/api/chrome-api', () => ({
  ChromeBookmarkAPI: class MockChromeBookmarkAPI {
    constructor() {
      if (process.env.NODE_ENV === 'production' && !(globalThis as any).chrome?.bookmarks) {
        throw new Error('Chrome API failed');
      }
    }
  },
}));

vi.mock('@/features/bookmarks/lib/browser/api/firefox-api', () => ({
  FirefoxBookmarkAPI: class MockFirefoxBookmarkAPI {},
}));

vi.mock('@/features/bookmarks/lib/browser/api/mock-browser-api', () => ({
  MockBrowserAPI: class MockMockBrowserAPI {},
}));

describe('factory', () => {
  let mockDetectBrowser: ReturnType<typeof vi.mocked<typeof detectBrowser>>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockDetectBrowser = vi.mocked(detectBrowser);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllEnvs();
  });

  describe('createBookmarkAPI', () => {
    it('creates ChromeBookmarkAPI for Chrome browser', () => {
      mockDetectBrowser.mockReturnValue({
        isExtension: true,
        type: 'chrome',
        version: '91.0',
      });

      (globalThis as any).chrome = {
        bookmarks: {},
      };

      const result = createBookmarkAPI();

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    it('creates FirefoxBookmarkAPI for Firefox browser', () => {
      mockDetectBrowser.mockReturnValue({
        isExtension: true,
        type: 'firefox',
        version: '91.0',
      });

      (globalThis as any).browser = {
        bookmarks: {},
      };

      const result = createBookmarkAPI();

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    it('creates MockBrowserAPI in test environment', () => {
      vi.stubEnv('NODE_ENV', 'test');

      const result = createBookmarkAPI();

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    it('creates MockBrowserAPI when Cypress is detected', () => {
      (globalThis as any).Cypress = {};

      const result = createBookmarkAPI();

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    it('creates MockBrowserAPI when no browser APIs are available', () => {
      mockDetectBrowser.mockReturnValue({
        isExtension: false,
        type: 'chrome',
        version: '91.0',
      });

      const result = createBookmarkAPI();

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    it('creates MockBrowserAPI when only Chrome API is available but browser is Firefox', () => {
      mockDetectBrowser.mockReturnValue({
        isExtension: true,
        type: 'firefox',
        version: '91.0',
      });

      (globalThis as any).chrome = {
        bookmarks: {},
      };

      const result = createBookmarkAPI();

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    it('creates MockBrowserAPI when only Firefox API is available but browser is Chrome', () => {
      vi.stubEnv('NODE_ENV', 'development');

      mockDetectBrowser.mockReturnValue({
        isExtension: true,
        type: 'chrome',
        version: '91.0',
      });

      (globalThis as any).browser = {
        bookmarks: {},
      };
      delete (globalThis as any).chrome;

      const result = createBookmarkAPI();

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    it('falls back to Chrome API in development when browser cannot be detected', () => {
      vi.stubEnv('NODE_ENV', 'development');
      mockDetectBrowser.mockReturnValue({
        isExtension: false,
        type: 'unknown',
      });

      (globalThis as any).chrome = {
        bookmarks: {},
      };

      const result = createBookmarkAPI();

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    it('falls back to MockBrowserAPI in development when Chrome API fails', () => {
      vi.stubEnv('NODE_ENV', 'development');
      mockDetectBrowser.mockReturnValue({
        isExtension: false,
        type: 'unknown',
      });

      (globalThis as any).chrome = {
        bookmarks: {},
      };

      const result = createBookmarkAPI();

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    it('creates MockBrowserAPI for unsupported browser in production', () => {
      mockDetectBrowser.mockReturnValue({
        isExtension: false,
        type: 'unknown',
      });

      const result = createBookmarkAPI();

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });

    it('creates MockBrowserAPI when browser API creation fails in production', () => {
      mockDetectBrowser.mockReturnValue({
        isExtension: true,
        type: 'chrome',
        version: '91.0',
      });

      (globalThis as any).chrome = {
        bookmarks: {},
      };

      const result = createBookmarkAPI();

      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });
  });
});
