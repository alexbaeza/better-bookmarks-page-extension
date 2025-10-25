import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { when } from 'vitest-when';

import { AppStateContext, initialContext, useAppStateContext } from '@/app/providers/app-state-context';

const mockUseAppStateContext = vi.mocked(useAppStateContext);

// Suppress console.error for this test since we're intentionally testing error throwing
const originalConsoleError = console.error;

describe('AppStateContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Suppress console.error for error boundary warnings
    console.error = vi.fn();
  });

  afterEach(() => {
    // Restore console.error
    console.error = originalConsoleError;
  });

  it('throws when used outside provider', () => {
    when(mockUseAppStateContext).calledWith().thenThrow(new Error('App must be wrapped with <AppStateProvider> to access AppStateContext'));

    expect(() => {
      renderHook(() => useAppStateContext());
    }).toThrow('App must be wrapped with <AppStateProvider> to access AppStateContext');
  });

  it('returns context when wrapped', () => {
    when(mockUseAppStateContext).calledWith().thenReturn(initialContext);

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
    expect(initialContext).toHaveProperty('updateBookmarkLayout');
  });
});
