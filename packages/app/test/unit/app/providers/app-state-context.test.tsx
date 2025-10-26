import { renderHook } from '@testing-library/react';
import type React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

vi.mock('@/app/providers/app-state-context', async () => {
  return await vi.importActual('@/app/providers/app-state-context');
});

import { AppStateContext, initialContext, useAppStateContext } from '@/app/providers/app-state-context';

const originalConsoleError = console.error;

describe('AppStateContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    console.error = originalConsoleError;
  });

  it('returns context when wrapped with provider', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => <AppStateContext.Provider value={initialContext}>{children}</AppStateContext.Provider>;

    const { result } = renderHook(() => useAppStateContext(), { wrapper });

    expect(result.current).toBe(initialContext);
  });

  it('initialContext has expected properties', () => {
    expect(initialContext).toHaveProperty('bookmarks');
    expect(initialContext).toHaveProperty('isLoading');
    expect(initialContext).toHaveProperty('error');
    expect(initialContext).toHaveProperty('providerInitialised');
    expect(initialContext).toHaveProperty('refreshBookmarks');
  });

  it('initialContext has correct structure', () => {
    expect(initialContext.bookmarks).toStrictEqual({ folders: [], uncategorized: undefined });
    expect(initialContext.isLoading).toBe(false);
    expect(typeof initialContext.refreshBookmarks).toBe('function');
  });

  it('exposes correct context shape', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => <AppStateContext.Provider value={initialContext}>{children}</AppStateContext.Provider>;

    const { result } = renderHook(() => useAppStateContext(), { wrapper });

    expect(result.current.bookmarks).toStrictEqual({ folders: [], uncategorized: undefined });
    expect(result.current.isLoading).toBe(false);
    expect(typeof result.current.refreshBookmarks).toBe('function');
    expect(result.current).toHaveProperty('providerInitialised');
  });

  it('should throw error when refreshBookmarks is called from initialContext', () => {
    expect(() => {
      initialContext.refreshBookmarks();
    }).toThrow('App must be wrapped with <AppStateProvider> to access AppStateContext');
  });

  it('returns initialContext when used without provider wrapper', () => {
    const { result } = renderHook(() => useAppStateContext());

    expect(result.current).toBeDefined();
    expect(result.current.bookmarks).toStrictEqual({ folders: [], uncategorized: undefined });
    expect(result.current.isLoading).toBe(false);

    expect(() => {
      result.current.refreshBookmarks();
    }).toThrow('App must be wrapped with <AppStateProvider> to access AppStateContext');
  });

  it('throws when context is null from Provider', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const TestProvider = ({ children }: { children: React.ReactNode }) => (
      <AppStateContext.Provider value={null as unknown as typeof initialContext}>{children}</AppStateContext.Provider>
    );

    expect(() => {
      renderHook(() => useAppStateContext(), { wrapper: TestProvider });
    }).toThrow('App must be wrapped with <AppStateProvider> to access AppStateContext');

    consoleErrorSpy.mockRestore();
  });
});
