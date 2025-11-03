import { ChromeBookmarkAPI } from './api/chrome-api';
import { FirefoxBookmarkAPI } from './api/firefox-api';
import { mockBookmarksAPI } from './api/mock-bookmarks-api';
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

  // In test environment or when browser APIs are not available, use mock data with Chrome implementation
  if (isTest || isCypressTest || (!hasChromeAPI && !hasBrowserAPI)) {
    // Use mock API with Chrome implementation (same code path as real Chrome)
    return new ChromeBookmarkAPI(mockBookmarksAPI as unknown as typeof window.chrome.bookmarks);
  }

  // Try to use real browser API (even in development)
  try {
    switch (browserInfo.type) {
      case 'chrome':
        return new ChromeBookmarkAPI();
      case 'firefox':
        return new FirefoxBookmarkAPI();
      default:
        // In development, fallback to Chrome API if we can't detect browser
        if (isDev) {
          return new ChromeBookmarkAPI();
        }
        throw new Error(`Unsupported browser: ${browserInfo.type}`);
    }
  } catch {
    // In development, fallback to mock API with Chrome implementation if real APIs fail
    if (isDev) {
      return new ChromeBookmarkAPI(mockBookmarksAPI as unknown as typeof window.chrome.bookmarks);
    }
    throw Error('Failed to create browser API');
  }
}
