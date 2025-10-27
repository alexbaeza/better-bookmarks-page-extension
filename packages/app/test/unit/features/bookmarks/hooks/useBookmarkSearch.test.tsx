import { renderHook } from '@testing-library/react';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import type React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { viewModeAtom } from '@/app/providers/atoms';
import { BookmarkNavigationProvider } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { BookmarkSearchProvider } from '@/features/bookmarks/contexts/BookmarkSearchContext';
import { useBookmarkSearch } from '@/features/bookmarks/hooks/useBookmarkSearch';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { BookmarkDisplayMode } from '@/shared/types/ui';

const mockFolders: IBookmarkItem[] = [
  {
    id: 'folder1',
    title: 'Folder 1',
    children: [
      { id: 'b1', title: 'Bookmark 1', url: 'https://example.com', dateAdded: Date.now() },
      { id: 'b2', title: 'Bookmark 2', url: 'https://example2.com', dateAdded: Date.now() },
    ],
  },
];

const mockUncategorized: IBookmarkItem = {
  id: 'uncat',
  title: 'Uncategorized',
  children: [{ id: 'b3', title: 'Bookmark 3', url: 'https://example3.com', dateAdded: Date.now() }],
};

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

describe('useBookmarkSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return initial state', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useBookmarkSearch({ rawFolders: mockFolders, rawUncategorized: mockUncategorized }), { wrapper });

    expect(result.current.searchTerm).toBe('');
    expect(result.current.pageContainers).toBeDefined();
    expect(result.current.counts).toBeDefined();
  });

  it('should provide search term setter', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useBookmarkSearch({ rawFolders: mockFolders, rawUncategorized: mockUncategorized }), { wrapper });

    expect(typeof result.current.setSearchTerm).toBe('function');
  });

  it('should return counts object', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useBookmarkSearch({ rawFolders: mockFolders, rawUncategorized: mockUncategorized }), { wrapper });

    expect(result.current.counts).toBeDefined();
    expect(typeof result.current.counts).toBe('object');
  });

  it('should return page containers', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useBookmarkSearch({ rawFolders: mockFolders, rawUncategorized: mockUncategorized }), { wrapper });

    expect(Array.isArray(result.current.pageContainers)).toBe(true);
  });

  it('should return items array', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useBookmarkSearch({ rawFolders: mockFolders, rawUncategorized: mockUncategorized }), { wrapper });

    expect(Array.isArray(result.current.items)).toBe(true);
  });

  it('should handle empty folders', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useBookmarkSearch({ rawFolders: [], rawUncategorized: undefined }), { wrapper });

    expect(Array.isArray(result.current.pageContainers)).toBe(true);
  });

  it('should handle undefined uncategorized', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useBookmarkSearch({ rawFolders: mockFolders, rawUncategorized: undefined }), { wrapper });

    expect(result.current.counts.uncategorized).toBe(0);
  });
});
