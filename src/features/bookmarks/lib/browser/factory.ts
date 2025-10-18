import { ChromeBookmarkAPI } from './api/chrome-api';
import { FirefoxBookmarkAPI } from './api/firefox-api';
import { MockBrowserAPI } from './api/mock-browser-api';
import type { BrowserBookmarkAPI } from './types';
import { detectBrowser } from './utils/browser-detector';

/**
 * Factory for creating browser-specific bookmark API instances
 */
export function createBookmarkAPI(): BrowserBookmarkAPI {
  const browserInfo = detectBrowser();
  const isDev = process.env.NODE_ENV === 'development';

  // In development, use mock browser API that simulates real behavior
  if (isDev) {
    return new MockBrowserAPI();
  }

  // Try to use real browser API in production
  try {
    switch (browserInfo.type) {
      case 'chrome':
        return new ChromeBookmarkAPI();
      case 'firefox':
        return new FirefoxBookmarkAPI();
      default:
        throw new Error(`Unsupported browser: ${browserInfo.type}`);
    }
  } catch (error) {
    console.warn('Failed to create browser API', error);
    throw Error('Failed to create browser API');
  }
}
