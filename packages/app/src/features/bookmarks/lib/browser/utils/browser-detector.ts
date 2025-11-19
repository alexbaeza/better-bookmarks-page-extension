/**
 * Browser detection utility
 */
export const detectBrowser = (): BrowserInfo => {
  const ua = navigator.userAgent;
  const isFirefox = /firefox|fxios/i.test(ua);
  const isChrome = /chrome/i.test(ua) && !/edge/i.test(ua);

  // Check if we're in an extension context
  const isExtension =
    !!(window as typeof window & { chrome?: { runtime?: { id?: string } } }).chrome?.runtime?.id ||
    !!(window as typeof window & { browser?: { runtime?: { id?: string } } }).browser?.runtime?.id;

  const isDev = import.meta.env.DEV;

  if (isFirefox) {
    return {
      isExtension: isExtension || isDev,
      type: 'firefox',
      version: extractVersion(ua, 'Firefox'),
    };
  }

  if (isChrome) {
    return {
      isExtension: isExtension || isDev,
      type: 'chrome',
      version: extractVersion(ua, 'Chrome'),
    };
  }

  // Fallback for development - assume Chrome if we can't detect
  if (isDev) {
    return {
      isExtension: false,
      type: 'chrome',
      version: 'dev',
    };
  }

  return {
    isExtension: false,
    type: 'unknown',
  };
};

const extractVersion = (userAgent: string, browser: string): string | undefined => {
  const match = userAgent.match(new RegExp(`${browser}/([0-9.]+)`));
  return match ? match[1] : undefined;
};

export interface BrowserInfo {
  type: 'chrome' | 'firefox' | 'unknown';
  isExtension: boolean;
  version?: string;
}
