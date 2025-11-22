import { renderHook, waitFor } from '@testing-library/react';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import type React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { when } from 'vitest-when';
import { useAppStateContext } from '@/app/providers/app-state-context';
import { AppStateProvider } from '@/app/providers/app-state-provider';
import { bookmarksAtom } from '@/app/providers/atoms';

vi.mock('@/features/bookmarks/lib/bookmarks', () => ({
  loadBookmarksTree: vi.fn(),
}));

import { loadBookmarksTree } from '@/features/bookmarks/lib/bookmarks';

const mockLoadBookmarksTree = vi.mocked(loadBookmarksTree);

const createWrapper =
  (initialBookmarks?: { folders: any[]; uncategorized?: any }): React.FC<{ children: React.ReactNode }> =>
  ({ children }) => {
    const HydrateAtoms: React.FC<{ initialValues: any; children: React.ReactNode }> = ({ initialValues, children }) => {
      useHydrateAtoms(initialValues);
      return <>{children}</>;
    };

    const initialValues = initialBookmarks ? [[bookmarksAtom, initialBookmarks]] : [];

    return (
      <Provider>
        <HydrateAtoms initialValues={initialValues}>
          <AppStateProvider>{children}</AppStateProvider>
        </HydrateAtoms>
      </Provider>
    );
  };

describe('AppStateProvider', () => {
  const mockBookmarksData = {
    folders: [],
    uncategorized: undefined,
  };

  let defaultWrapper: ReturnType<typeof createWrapper>;

  beforeEach(() => {
    when(mockLoadBookmarksTree).calledWith().thenResolve(mockBookmarksData);
    defaultWrapper = createWrapper();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should dispatch PROVIDER_INITIALISED on mount', async () => {
    const { result } = renderHook(() => useAppStateContext(), { wrapper: defaultWrapper });

    await waitFor(() => {
      expect(result.current.providerInitialised).toBe(true);
    });
  });

  it('should load bookmarks on mount', async () => {
    renderHook(() => useAppStateContext(), { wrapper: defaultWrapper });

    await waitFor(() => {
      expect(mockLoadBookmarksTree).toHaveBeenCalledTimes(1);
    });
  });

  it('should start with loading state and then complete', async () => {
    const { result } = renderHook(() => useAppStateContext(), { wrapper: defaultWrapper });

    await waitFor(
      () => {
        expect(result.current.isLoading).toBe(false);
      },
      { timeout: 3000 }
    );
  });

  it('should handle errors during fetch', async () => {
    const mockError = new Error('Failed to load bookmarks');
    when(mockLoadBookmarksTree).calledWith().thenReject(mockError);

    const { result } = renderHook(() => useAppStateContext(), { wrapper: defaultWrapper });

    await waitFor(
      () => {
        expect(result.current.error).toBeDefined();
      },
      { timeout: 3000 }
    );
  });

  it('should call getBookmarksData even when persisted data exists', async () => {
    const persistedData = {
      folders: [{ id: 'persisted', title: 'Persisted', url: '', dateAdded: Date.now() }],
      uncategorized: undefined,
    };

    const wrapper = createWrapper(persistedData);
    renderHook(() => useAppStateContext(), { wrapper });

    await waitFor(() => {
      expect(mockLoadBookmarksTree).toHaveBeenCalledTimes(1);
    });
  });

  it('should handle refresh errors gracefully', async () => {
    const mockError = new Error('Refresh failed');
    when(mockLoadBookmarksTree).calledWith().thenReject(mockError);

    const { result } = renderHook(() => useAppStateContext(), { wrapper: defaultWrapper });

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });

    await result.current.refreshBookmarks();

    await waitFor(() => {
      expect(result.current.error).toBeDefined();
    });
  });

  it('should handle empty persisted data', () => {
    const emptyData = {
      folders: [],
      uncategorized: undefined,
    };

    const wrapper = createWrapper(emptyData);
    const { result } = renderHook(() => useAppStateContext(), { wrapper });

    expect(result.current.bookmarks).toEqual(emptyData);
    expect(result.current.bookmarks.folders).toHaveLength(0);
  });

  it('should provide refreshBookmarks function', async () => {
    const { result } = renderHook(() => useAppStateContext(), { wrapper: defaultWrapper });

    await waitFor(() => {
      expect(typeof result.current.refreshBookmarks).toBe('function');
    });

    await result.current.refreshBookmarks();
  });
});
