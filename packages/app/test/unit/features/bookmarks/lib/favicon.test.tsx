import { getFaviconUrl } from '@/features/bookmarks/lib/bookmarks';
import { getDefaultFavicon } from '@/features/bookmarks/lib/browser/utils/default-favicon';

describe('getDefaultFavicon', () => {
  it('returns a valid data URL PNG', () => {
    const result = getDefaultFavicon();
    expect(result).toMatch(/^data:image\/png;base64,/);
    expect(result.length).toBeGreaterThan(100); // Ensure it's a substantial PNG
  });
});

describe('getFaviconUrl', () => {
  it('returns DuckDuckGo favicon URL in Chrome extension context', () => {
    (global as typeof global & { chrome?: { runtime: { id: string } } }).chrome = {
      runtime: { id: 'test-extension-id' },
    };

    const url = 'https://www.google.com';
    const result = getFaviconUrl(url);
    expect(result).toBe('https://icons.duckduckgo.com/ip3/google.com.ico');
  });

  it('returns DuckDuckGo favicon URL in Firefox extension context', () => {
    (global as typeof global & { browser?: { favicons: unknown } }).browser = {
      favicons: {},
    };

    const url = 'https://www.google.com';
    const result = getFaviconUrl(url);
    expect(result).toBe('https://icons.duckduckgo.com/ip3/google.com.ico');
  });

  it('falls back to DuckDuckGo favicon service in web context', () => {
    const url = 'https://www.google.com';
    const result = getFaviconUrl(url);
    expect(result).toBe('https://icons.duckduckgo.com/ip3/google.com.ico');
  });

  it('removes www. subdomain from hostname in fallback', () => {
    const url = 'https://www.example.com';
    const result = getFaviconUrl(url);
    expect(result).toBe('https://icons.duckduckgo.com/ip3/example.com.ico');
  });

  it('returns custom default favicon for invalid URLs', () => {
    const url = 'invalid-url';
    const result = getFaviconUrl(url);
    expect(result).toBe(getDefaultFavicon());
  });
});
