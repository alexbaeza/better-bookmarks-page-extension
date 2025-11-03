import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useModifierKey, usePlatform } from '@/shared/hooks/usePlatform';

describe('usePlatform', () => {
  it('should return default values when navigator is undefined', () => {
    const originalNavigator = globalThis.navigator;
    globalThis.navigator = undefined;

    const { result } = renderHook(() => usePlatform());
    expect(result.current.isMac).toBe(false);
    expect(result.current.isWindows).toBe(false);
    expect(result.current.isLinux).toBe(false);

    globalThis.navigator = originalNavigator;
  });

  it('should detect Mac platform', () => {
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
    });

    const { result } = renderHook(() => usePlatform());
    expect(result.current.isMac).toBe(true);
    expect(result.current.isWindows).toBe(false);
    expect(result.current.isLinux).toBe(false);
  });

  it('should detect Windows platform', () => {
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    });

    const { result } = renderHook(() => usePlatform());
    expect(result.current.isWindows).toBe(true);
    expect(result.current.isMac).toBe(false);
    expect(result.current.isLinux).toBe(false);
  });

  it('should detect Linux platform', () => {
    Object.defineProperty(navigator, 'userAgent', {
      writable: true,
      value: 'Mozilla/5.0 (X11; Linux x86_64)',
    });

    const { result } = renderHook(() => usePlatform());
    expect(result.current.isLinux).toBe(true);
    expect(result.current.isMac).toBe(false);
    expect(result.current.isWindows).toBe(false);
  });

  describe('useModifierKey', () => {
    it('should return ⌘ for Mac', () => {
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)',
      });

      const { result } = renderHook(() => useModifierKey());
      expect(result.current).toBe('⌘');
    });

    it('should return Ctrl for Windows', () => {
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      });

      const { result } = renderHook(() => useModifierKey());
      expect(result.current).toBe('Ctrl');
    });

    it('should return Ctrl for Linux', () => {
      Object.defineProperty(navigator, 'userAgent', {
        writable: true,
        value: 'Mozilla/5.0 (X11; Linux x86_64)',
      });

      const { result } = renderHook(() => useModifierKey());
      expect(result.current).toBe('Ctrl');
    });
  });
});
