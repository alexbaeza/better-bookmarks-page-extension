import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { when } from 'vitest-when';

import { useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { useBookmarkActions } from '@/features/bookmarks/hooks/useBookmarkActions';
import { useBookmarkSearch } from '@/features/bookmarks/hooks/useBookmarkSearch';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { useRawBookmarkData } from '@/features/bookmarks/hooks/useRawBookmarkData';

vi.mock('@/features/bookmarks/hooks/useRawBookmarkData');
vi.mock('@/features/bookmarks/contexts/BookmarkNavigationContext');
vi.mock('@/features/bookmarks/hooks/useBookmarkSearch');
vi.mock('@/features/bookmarks/hooks/useBookmarkActions');

describe('useBookmarks', () => {
  let mockUseRawBookmarkData: vi.MockedFunction<typeof useRawBookmarkData>;
  let mockUseBookmarkNavigation: vi.MockedFunction<typeof useBookmarkNavigation>;
  let mockUseBookmarkSearch: vi.MockedFunction<typeof useBookmarkSearch>;
  let mockUseBookmarkActions: vi.MockedFunction<typeof useBookmarkActions>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseRawBookmarkData = vi.mocked(useRawBookmarkData);
    mockUseBookmarkNavigation = vi.mocked(useBookmarkNavigation);
    mockUseBookmarkSearch = vi.mocked(useBookmarkSearch);
    mockUseBookmarkActions = vi.mocked(useBookmarkActions);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns all required properties', () => {
    when(mockUseRawBookmarkData).calledWith().thenReturn({
      error: null,
      isLoading: false,
      rawFolders: [],
      rawUncategorized: undefined,
      refresh: vi.fn(),
    });

    when(mockUseBookmarkNavigation).calledWith().thenReturn({
      currentPage: 'All',
      setCurrentPage: vi.fn(),
    });

    when(mockUseBookmarkSearch)
      .calledWith()
      .thenReturn({
        counts: { all: 0, uncategorized: 0 },
        items: [],
        pageContainers: [],
        searchTerm: '',
        setSearchTerm: vi.fn(),
      });

    when(mockUseBookmarkActions).calledWith().thenReturn({
      create: vi.fn(),
      move: vi.fn(),
      remove: vi.fn(),
      update: vi.fn(),
      updateLayout: vi.fn(),
    });

    const { result } = renderHook(() => useBookmarks());

    expect(result.current).toHaveProperty('rawFolders');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('currentPage');
    expect(result.current).toHaveProperty('searchTerm');
    expect(result.current).toHaveProperty('setSearchTerm');
    expect(result.current).toHaveProperty('items');
    expect(result.current).toHaveProperty('counts');
    expect(result.current).toHaveProperty('pageContainers');
    expect(result.current).toHaveProperty('create');
    expect(result.current).toHaveProperty('update');
    expect(result.current).toHaveProperty('remove');
    expect(result.current).toHaveProperty('move');
    expect(result.current).toHaveProperty('updateLayout');
  });
});
