import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createBookmarkAPI } from '@/features/bookmarks/lib/browser/factory';
import { detectBrowser } from '@/features/bookmarks/lib/browser/utils/browser-detector';

vi.mock('@/features/bookmarks/lib/browser/api/chrome-api', () => ({
  ChromeBookmarkAPI: class {
    type = 'chrome-api';
  },
}));
vi.mock('@/features/bookmarks/lib/browser/api/firefox-api', () => ({
  FirefoxBookmarkAPI: class {
    type = 'firefox-api';
  },
}));
vi.mock('@/features/bookmarks/lib/browser/api/mock-browser-api', () => ({
  MockBrowserAPI: class {
    type = 'mock-api';
  },
}));
vi.mock('@/features/bookmarks/lib/browser/utils/browser-detector', () => ({
  detectBrowser: vi.fn(),
}));

describe('createBookmarkAPI (Vite + Vitest)', () => {
  let originalGlobals: any;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
    originalGlobals = {
      Cypress: (globalThis as any).Cypress,
      chrome: (globalThis as any).chrome,
      browser: (globalThis as any).browser,
    };
    delete (globalThis as any).Cypress;
    delete (globalThis as any).chrome;
    delete (globalThis as any).browser;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    if (originalGlobals.Cypress !== undefined) (globalThis as any).Cypress = originalGlobals.Cypress;
    if (originalGlobals.chrome !== undefined) (globalThis as any).chrome = originalGlobals.chrome;
    if (originalGlobals.browser !== undefined) (globalThis as any).browser = originalGlobals.browser;
  });

  it('returns MockBrowserAPI in test environment', () => {
    vi.stubEnv('NODE_ENV', 'test');
    vi.mocked(detectBrowser).mockReturnValue({ type: 'chrome' } as any);

    const result = createBookmarkAPI();
    expect(result).toEqual({ type: 'mock-api' });
  });

  it('returns MockBrowserAPI when Cypress is present', () => {
    (globalThis as any).Cypress = {};
    vi.stubEnv('NODE_ENV', 'production');
    vi.mocked(detectBrowser).mockReturnValue({ type: 'chrome' } as any);

    const result = createBookmarkAPI();
    expect(result).toEqual({ type: 'mock-api' });
  });

  it('returns MockBrowserAPI when no browser APIs exist', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.mocked(detectBrowser).mockReturnValue({ type: 'chrome' } as any);

    const result = createBookmarkAPI();
    expect(result).toEqual({ type: 'mock-api' });
  });

  it('returns ChromeBookmarkAPI when chrome.bookmarks exists', () => {
    (globalThis as any).chrome = { bookmarks: {} };
    vi.stubEnv('NODE_ENV', 'production');
    vi.mocked(detectBrowser).mockReturnValue({ type: 'chrome' } as any);

    const result = createBookmarkAPI();
    expect(result).toEqual({ type: 'chrome-api' });
  });

  it('returns FirefoxBookmarkAPI when browser.bookmarks exists', () => {
    (globalThis as any).browser = { bookmarks: {} };
    vi.stubEnv('NODE_ENV', 'production');
    vi.mocked(detectBrowser).mockReturnValue({ type: 'firefox' } as any);

    const result = createBookmarkAPI();
    expect(result).toEqual({ type: 'firefox-api' });
  });

  it('falls back to ChromeBookmarkAPI in dev when unknown type', () => {
    vi.stubEnv('NODE_ENV', 'development');
    vi.mocked(detectBrowser).mockReturnValue({ type: 'unknown' } as any);
    (globalThis as any).chrome = { bookmarks: {} };

    const result = createBookmarkAPI();

    expect(result).toBeDefined();
    expect((result as any).type).toBe('chrome-api');
  });

  it('throws when unsupported browser in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    (globalThis as any).chrome = { bookmarks: {} };
    vi.mocked(detectBrowser).mockReturnValue({ type: 'unknown' } as any);

    expect(() => createBookmarkAPI()).toThrow();
  });
});
