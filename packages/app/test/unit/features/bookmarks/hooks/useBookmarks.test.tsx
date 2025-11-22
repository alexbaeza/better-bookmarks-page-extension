import { renderHook } from '@testing-library/react';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import type React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { viewModeAtom } from '@/app/providers/atoms';
import { BookmarkNavigationProvider } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { BookmarkSearchProvider } from '@/features/bookmarks/contexts/BookmarkSearchContext';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { BookmarkDisplayMode } from '@/shared/types/ui';

vi.mock('@/features/bookmarks/hooks/useRawBookmarkData', () => ({
  useRawBookmarkData: () => ({
    rawFolders: [],
    rawUncategorized: undefined,
    isLoading: false,
    error: null,
  }),
}));

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => {
    const HydrateAtoms: React.FC<{ initialValues: any; children: React.ReactNode }> = ({ initialValues, children }) => {
      useHydrateAtoms(initialValues);
      return <>{children}</>;
    };

    return (
      <Provider>
        <HydrateAtoms initialValues={[[viewModeAtom, BookmarkDisplayMode.Grid]]}>
          <BookmarkNavigationProvider>
            <BookmarkSearchProvider>{children}</BookmarkSearchProvider>
          </BookmarkNavigationProvider>
        </HydrateAtoms>
      </Provider>
    );
  };
};

describe('useBookmarks', () => {
  let wrapper: ReturnType<typeof createWrapper>;

  beforeEach(() => {
    wrapper = createWrapper();
  });

  it('should return bookmark data and actions', () => {
    const { result } = renderHook(() => useBookmarks(), { wrapper });

    expect(result.current).toHaveProperty('counts');
    expect(result.current).toHaveProperty('currentPage');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('items');
    expect(result.current).toHaveProperty('pageContainers');
    expect(result.current).toHaveProperty('rawFolders');
    expect(result.current).toHaveProperty('searchTerm');
    expect(result.current).toHaveProperty('setSearchTerm');
    expect(result.current).toHaveProperty('create');
    expect(result.current).toHaveProperty('update');
    expect(result.current).toHaveProperty('remove');
    expect(result.current).toHaveProperty('move');
  });

  it('should return isLoading from raw data', () => {
    const { result } = renderHook(() => useBookmarks(), { wrapper });

    expect(result.current.isLoading).toBe(false);
  });

  it('should return error from raw data', () => {
    const { result } = renderHook(() => useBookmarks(), { wrapper });

    expect(result.current.error).toBeNull();
  });

  it('should return rawFolders from raw data', () => {
    const { result } = renderHook(() => useBookmarks(), { wrapper });

    expect(Array.isArray(result.current.rawFolders)).toBe(true);
  });

  it('should return search functionality', () => {
    const { result } = renderHook(() => useBookmarks(), { wrapper });

    expect(typeof result.current.setSearchTerm).toBe('function');
    expect(typeof result.current.searchTerm).toBe('string');
  });

  it('should return navigation functionality', () => {
    const { result } = renderHook(() => useBookmarks(), { wrapper });

    expect(typeof result.current.currentPage).toBe('string');
  });
});
