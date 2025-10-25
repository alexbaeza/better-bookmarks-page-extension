import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { when } from 'vitest-when';

import { AppStateContext, initialContext, useAppStateContext } from '@/app/providers/app-state-context';

const mockUseAppStateContext = vi.mocked(useAppStateContext);

describe('AppStateContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
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
