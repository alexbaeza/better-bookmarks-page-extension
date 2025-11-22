import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { when } from 'vitest-when';
import { useFavicon } from '@/features/bookmarks/hooks/useFavicon';
import * as bookmarksLib from '@/features/bookmarks/lib/bookmarks';

vi.mock('@/features/bookmarks/lib/bookmarks', () => ({
  getFaviconUrl: vi.fn(),
}));

describe('useFavicon', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns empty string when url is undefined', () => {
    const { result } = renderHook(() => useFavicon(undefined));
    expect(result.current).toBe('');
    expect(bookmarksLib.getFaviconUrl).toHaveBeenCalledTimes(0);
  });

  it('returns empty string when url is empty string', () => {
    const { result } = renderHook(() => useFavicon(''));
    expect(result.current).toBe('');
    expect(bookmarksLib.getFaviconUrl).toHaveBeenCalledTimes(0);
  });

  it('calls getFaviconUrl with the url and returns result', () => {
    when(vi.mocked(bookmarksLib.getFaviconUrl))
      .calledWith('https://example.com')
      .thenReturn('https://favicon.example.com/icon.png');
    const url = 'https://example.com';
    const { result } = renderHook(() => useFavicon(url));

    expect(bookmarksLib.getFaviconUrl).toHaveBeenCalledWith(url);
    expect(result.current).toBe('https://favicon.example.com/icon.png');
  });

  it('returns different favicon for different urls', () => {
    vi.mocked(bookmarksLib.getFaviconUrl).mockImplementation((url) => `https://favicon.${url}`);
    const url1 = 'https://example.com';
    const url2 = 'https://google.com';

    const { result: result1 } = renderHook(() => useFavicon(url1));
    const { result: result2 } = renderHook(() => useFavicon(url2));

    expect(result1.current).toBe(`https://favicon.${url1}`);
    expect(result2.current).toBe(`https://favicon.${url2}`);
  });
});
