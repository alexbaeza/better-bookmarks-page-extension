import { ChromeBookmarkAPI } from './api/chrome-api';
import { FirefoxBookmarkAPI } from './api/firefox-api';
import { MockBookmarksAPI } from './api/mock-bookmarks-api';
import type { BrowserBookmarkAPI } from './types';
import { detectBrowser } from './utils/browser-detector';

/**
 * Factory for creating browser-specific bookmark API instances
 * In dev/test, uses mock data with Chrome/Firefox implementations
 * In production, uses real browser APIs
 */
export function createBookmarkAPI(): BrowserBookmarkAPI {
  const browserInfo = detectBrowser();
  const isDev = import.meta.env.DEV;
  const isTest = import.meta.env.MODE === 'test';

  // Check if we're in a test environment by looking for Cypress or if browser APIs are not available
  type MaybeGlobals = typeof globalThis & {
    Cypress?: unknown;
    chrome?: { bookmarks?: unknown };
    browser?: { bookmarks?: unknown };
  };
  const g = globalThis as MaybeGlobals;
  const isCypressTest = Boolean(g.Cypress);
  const hasChromeAPI = Boolean(g.chrome?.bookmarks);
  const hasBrowserAPI = Boolean(g.browser?.bookmarks);

  let useMockData = false;
  // In dev/test environment or when browser APIs are not available, use mock data
  if (isDev || isTest || isCypressTest || (!hasChromeAPI && !hasBrowserAPI)) {
    console.warn(
      `[Bookmarks API] Development mode: Using mock data with ${browserInfo.type === 'firefox' ? 'Firefox' : 'Chrome'} implementation`
    );
    useMockData = true;
  }

  switch (browserInfo.type) {
    case 'chrome':
      return useMockData ? new ChromeBookmarkAPI(new MockBookmarksAPI(browserInfo.type)) : new ChromeBookmarkAPI();
    case 'firefox':
      return useMockData ? new FirefoxBookmarkAPI(new MockBookmarksAPI(browserInfo.type)) : new FirefoxBookmarkAPI();
    default:
      throw new Error(`Unsupported browser: ${browserInfo.type}`);
  }
}
