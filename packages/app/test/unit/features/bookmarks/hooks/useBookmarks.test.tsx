import { renderHook } from '@testing-library/react';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import type React from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAppStateContext } from '@/app/providers/app-state-context';
import { bookmarksAtom, viewModeAtom } from '@/app/providers/atoms';
import { BookmarkNavigationProvider } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { BookmarkSearchProvider } from '@/features/bookmarks/contexts/BookmarkSearchContext';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import type { BookmarksData } from '@/features/bookmarks/lib/bookmarks';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { BookmarkDisplayMode } from '@/shared/types/ui';

vi.mock('@/features/bookmarks/lib/bookmarks', () => ({
  create: vi.fn(),
  update: vi.fn(),
  remove: vi.fn(),
  move: vi.fn(),
}));

vi.mock('@/app/providers/app-state-context');

const mockFolders: IBookmarkItem[] = [
  {
    id: 'folder1',
    title: 'Folder 1',
    children: [{ id: 'b1', title: 'Bookmark 1', url: 'https://example.com', dateAdded: Date.now() }],
  },
];

const mockUncategorized: IBookmarkItem = {
  id: 'uncat',
  title: 'Uncategorized',
  children: [],
};

const mockBookmarks: BookmarksData = {
  folders: mockFolders,
  uncategorized: mockUncategorized,
};

const mockUseAppStateContext = vi.mocked(useAppStateContext);

const createWrapper = () => {
  return ({ children }: { children: React.ReactNode }) => {
    const HydrateAtoms: React.FC<{ initialValues: any; children: React.ReactNode }> = ({ initialValues, children }) => {
      useHydrateAtoms(initialValues);
      return <>{children}</>;
    };

    return (
      <Provider>
        <HydrateAtoms
          initialValues={[
            [bookmarksAtom, mockBookmarks],
            [viewModeAtom, BookmarkDisplayMode.Grid],
          ]}
        >
          <BookmarkNavigationProvider>
            <BookmarkSearchProvider>{children}</BookmarkSearchProvider>
          </BookmarkNavigationProvider>
        </HydrateAtoms>
      </Provider>
    );
  };
};

describe('useBookmarks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAppStateContext.mockReturnValue({
      bookmarks: mockBookmarks,
      isLoading: false,
      providerInitialised: true,
      refreshBookmarks: vi.fn().mockResolvedValue(undefined),
    } as ReturnType<typeof useAppStateContext>);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return bookmark data', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useBookmarks(), { wrapper });

    expect(result.current.rawFolders).toBeDefined();
    expect(Array.isArray(result.current.rawFolders)).toBe(true);
  });

  it('should return current page', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useBookmarks(), { wrapper });

    expect(result.current.currentPage).toBeDefined();
  });

  it('should return search term', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useBookmarks(), { wrapper });

    expect(result.current.searchTerm).toBe('');
  });

  it('should return counts', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useBookmarks(), { wrapper });

    expect(result.current.counts).toBeDefined();
    expect(typeof result.current.counts).toBe('object');
  });

  it('should return page containers', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useBookmarks(), { wrapper });

    expect(Array.isArray(result.current.pageContainers)).toBe(true);
  });

  it('should return items', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useBookmarks(), { wrapper });

    expect(Array.isArray(result.current.items)).toBe(true);
  });

  it('should return loading state', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useBookmarks(), { wrapper });

    expect(typeof result.current.isLoading).toBe('boolean');
  });

  it('should provide action functions', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useBookmarks(), { wrapper });

    expect(typeof result.current.create).toBe('function');
    expect(typeof result.current.update).toBe('function');
    expect(typeof result.current.remove).toBe('function');
    expect(typeof result.current.move).toBe('function');
  });

  it('should provide required properties', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useBookmarks(), { wrapper });

    expect(result.current).toHaveProperty('currentPage');
    expect(result.current).toHaveProperty('searchTerm');
    expect(result.current).toHaveProperty('counts');
    expect(result.current).toHaveProperty('items');
  });

  it('should expose all required properties', () => {
    const wrapper = createWrapper();
    const { result } = renderHook(() => useBookmarks(), { wrapper });

    expect(result.current).toHaveProperty('counts');
    expect(result.current).toHaveProperty('currentPage');
    expect(result.current).toHaveProperty('items');
    expect(result.current).toHaveProperty('pageContainers');
    expect(result.current).toHaveProperty('rawFolders');
    expect(result.current).toHaveProperty('searchTerm');
  });
});
