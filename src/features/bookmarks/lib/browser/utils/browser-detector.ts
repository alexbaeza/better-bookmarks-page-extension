/**
 * Browser detection utility
 */
export function detectBrowser(): BrowserInfo {
  const ua = navigator.userAgent;
  const isFirefox = /firefox|fxios/i.test(ua);
  const isChrome = /chrome/i.test(ua) && !/edge/i.test(ua);

  // Check if we're in an extension context
  const isExtension =
    !!(window as typeof window & { chrome?: { runtime?: { id?: string } } }).chrome?.runtime?.id ||
    !!(window as typeof window & { browser?: { runtime?: { id?: string } } }).browser?.runtime?.id;

  // In development, be more lenient with detection
  const isDev = process.env.NODE_ENV === 'development';

  if (isFirefox) {
    return {
      type: 'firefox',
      isExtension: isExtension || isDev,
      version: extractVersion(ua, 'Firefox'),
    };
  }

  if (isChrome) {
    return {
      type: 'chrome',
      isExtension: isExtension || isDev,
      version: extractVersion(ua, 'Chrome'),
    };
  }

  // Fallback for development - assume Chrome if we can't detect
  if (isDev) {
    return {
      type: 'chrome',
      isExtension: false,
      version: 'dev',
    };
  }

  return {
    type: 'unknown',
    isExtension: false,
  };
}

function extractVersion(userAgent: string, browser: string): string | undefined {
  const match = userAgent.match(new RegExp(`${browser}/([0-9.]+)`));
  return match ? match[1] : undefined;
}

export interface BrowserInfo {
  type: 'chrome' | 'firefox' | 'unknown';
  isExtension: boolean;
  version?: string;
}
