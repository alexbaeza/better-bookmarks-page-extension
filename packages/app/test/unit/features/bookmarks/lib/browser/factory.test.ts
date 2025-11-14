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
vi.mock('@/features/bookmarks/lib/browser/api/mock-bookmarks-api', () => ({
  MockBookmarksAPI: class {},
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

  it('returns ChromeBookmarkAPI with mock in test environment', () => {
    vi.stubEnv('NODE_ENV', 'test');
    vi.mocked(detectBrowser).mockReturnValue({ type: 'chrome' } as any);

    const result = createBookmarkAPI();
    expect(result).toEqual({ type: 'chrome-api' });
  });

  it('returns ChromeBookmarkAPI with mock when Cypress is present', () => {
    (globalThis as any).Cypress = {};
    vi.stubEnv('NODE_ENV', 'production');
    vi.mocked(detectBrowser).mockReturnValue({ type: 'chrome' } as any);

    const result = createBookmarkAPI();
    expect(result).toEqual({ type: 'chrome-api' });
  });

  it('returns ChromeBookmarkAPI with mock when no browser APIs exist', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.mocked(detectBrowser).mockReturnValue({ type: 'chrome' } as any);

    const result = createBookmarkAPI();
    expect(result).toEqual({ type: 'chrome-api' });
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
    vi.stubEnv('MODE', 'production');
    vi.mocked(detectBrowser).mockReturnValue({ type: 'firefox' } as any);

    const result = createBookmarkAPI();
    expect(result).toEqual({ type: 'firefox-api' });
  });

  it('throws error for unknown browser type', () => {
    vi.stubEnv('NODE_ENV', 'production');
    vi.mocked(detectBrowser).mockReturnValue({ type: 'unknown' } as any);
    (globalThis as any).chrome = { bookmarks: {} };

    expect(() => createBookmarkAPI()).toThrow('Unsupported browser');
  });
});
