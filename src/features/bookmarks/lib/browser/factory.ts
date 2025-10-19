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
  const isTest = process.env.NODE_ENV === 'test';

  // Try to use real browser API (even in development)
  try {
    switch (browserInfo.type) {
      case 'chrome':
        return new ChromeBookmarkAPI();
      case 'firefox':
        return new FirefoxBookmarkAPI();
      default:
        // In development or test, fallback to Chrome API if we can't detect browser
        if (isDev || isTest) {
          console.warn('Could not detect browser, falling back to Chrome API');
          return new ChromeBookmarkAPI();
        }
        throw new Error(`Unsupported browser: ${browserInfo.type}`);
    }
  } catch (error) {
    console.warn('Failed to create browser API', error);
    // In development or test, fallback to mock API if real APIs fail
    if (isDev || isTest) {
      console.warn('Falling back to mock API for development/test');
      return new MockBrowserAPI();
    }
    throw Error('Failed to create browser API');
  }
}
