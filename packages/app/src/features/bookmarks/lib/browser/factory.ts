import { ChromeBookmarkAPI } from './api/chrome-api';
import { FirefoxBookmarkAPI } from './api/firefox-api';
import type { BrowserBookmarkAPI } from './types';
import { detectBrowser } from './utils/browser-detector';

/**
 * Factory for creating browser-specific bookmark API instances
 * In dev/test, uses mock data with Chrome/Firefox implementations
 * In production, uses real browser APIs
 * Mock files are dynamically imported only when needed, excluding them from production builds
 */
export const createBookmarkAPI = async (): Promise<BrowserBookmarkAPI> => {
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
  if (isDev || isTest || isCypressTest || !(hasChromeAPI || hasBrowserAPI)) {
    console.warn(
      `[Bookmarks API] Development mode: Using mock data with ${browserInfo.type === 'firefox' ? 'Firefox' : 'Chrome'} implementation`
    );
    useMockData = true;
  }

  switch (browserInfo.type) {
    case 'chrome': {
      if (useMockData) {
        const { MockBookmarksAPI } = await import('./api/mock-bookmarks-api');
        return new ChromeBookmarkAPI(new MockBookmarksAPI(browserInfo.type));
      }
      return new ChromeBookmarkAPI();
    }
    case 'firefox': {
      if (useMockData) {
        const { MockBookmarksAPI } = await import('./api/mock-bookmarks-api');
        return new FirefoxBookmarkAPI(new MockBookmarksAPI(browserInfo.type));
      }
      return new FirefoxBookmarkAPI();
    }
    default:
      throw new Error(`Unsupported browser please open an issue and report it: ${browserInfo.type}`);
  }
};
