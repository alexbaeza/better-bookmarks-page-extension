import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { when } from 'vitest-when';
import { createBookmarkAPI } from '@/features/bookmarks/lib/browser/factory';
import { type BrowserInfo, detectBrowser } from '@/features/bookmarks/lib/browser/utils/browser-detector';
import type { TestGlobalThis } from '~test/test-types';

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
    vi.unstubAllEnvs();
    originalGlobals = {
      Cypress: (globalThis as TestGlobalThis).Cypress,
      chrome: (globalThis as TestGlobalThis).chrome,
      browser: (globalThis as TestGlobalThis).browser,
    };
    Reflect.deleteProperty(globalThis, 'Cypress');
    Reflect.deleteProperty(globalThis, 'chrome');
    Reflect.deleteProperty(globalThis, 'browser');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    if (originalGlobals.Cypress !== undefined) (globalThis as TestGlobalThis).Cypress = originalGlobals.Cypress;
    if (originalGlobals.chrome !== undefined) (globalThis as TestGlobalThis).chrome = originalGlobals.chrome;
    if (originalGlobals.browser !== undefined) (globalThis as TestGlobalThis).browser = originalGlobals.browser;
  });

  it('returns ChromeBookmarkAPI with mock in test environment', () => {
    vi.stubEnv('NODE_ENV', 'test');
    when(vi.mocked(detectBrowser))
      .calledWith()
      .thenReturn({ type: 'chrome', isExtension: false } as BrowserInfo);

    const result = createBookmarkAPI();
    expect(result).toEqual({ type: 'chrome-api' });
  });

  it('returns ChromeBookmarkAPI with mock when Cypress is present', () => {
    (globalThis as TestGlobalThis).Cypress = {};
    vi.stubEnv('NODE_ENV', 'production');
    when(vi.mocked(detectBrowser))
      .calledWith()
      .thenReturn({ type: 'chrome', isExtension: false } as BrowserInfo);

    const result = createBookmarkAPI();
    expect(result).toEqual({ type: 'chrome-api' });
  });

  it('returns ChromeBookmarkAPI with mock when no browser APIs exist', () => {
    vi.stubEnv('NODE_ENV', 'production');
    when(vi.mocked(detectBrowser))
      .calledWith()
      .thenReturn({ type: 'chrome', isExtension: false } as BrowserInfo);

    const result = createBookmarkAPI();
    expect(result).toEqual({ type: 'chrome-api' });
  });

  it('returns ChromeBookmarkAPI when chrome.bookmarks exists', () => {
    (globalThis as TestGlobalThis).chrome = { bookmarks: {} } as TestGlobalThis['chrome'];
    vi.stubEnv('NODE_ENV', 'production');
    when(vi.mocked(detectBrowser))
      .calledWith()
      .thenReturn({ type: 'chrome', isExtension: false } as BrowserInfo);

    const result = createBookmarkAPI();
    expect(result).toEqual({ type: 'chrome-api' });
  });

  it('returns FirefoxBookmarkAPI when browser.bookmarks exists', () => {
    (globalThis as TestGlobalThis).browser = { bookmarks: {} } as TestGlobalThis['browser'];
    vi.stubEnv('MODE', 'production');
    when(vi.mocked(detectBrowser))
      .calledWith()
      .thenReturn({ type: 'firefox', isExtension: false } as BrowserInfo);

    const result = createBookmarkAPI();
    expect(result).toEqual({ type: 'firefox-api' });
  });

  it('throws error for unknown browser type', () => {
    vi.stubEnv('NODE_ENV', 'production');
    when(vi.mocked(detectBrowser))
      .calledWith()
      .thenReturn({ type: 'unknown', isExtension: false } as BrowserInfo);
    (globalThis as TestGlobalThis).chrome = { bookmarks: {} } as TestGlobalThis['chrome'];

    expect(() => createBookmarkAPI()).toThrow('Unsupported browser');
  });
});
