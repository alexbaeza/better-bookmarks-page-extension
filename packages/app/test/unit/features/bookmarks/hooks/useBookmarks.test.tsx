import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import * as useBookmarkNavigation from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import * as useBookmarkActions from '@/features/bookmarks/hooks/useBookmarkActions';
import * as useBookmarkSearch from '@/features/bookmarks/hooks/useBookmarkSearch';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import * as useRawBookmarkData from '@/features/bookmarks/hooks/useRawBookmarkData';

vi.mock('@/features/bookmarks/hooks/useBookmarkActions');
vi.mock('@/features/bookmarks/hooks/useBookmarkSearch');
vi.mock('@/features/bookmarks/contexts/BookmarkNavigationContext');
vi.mock('@/features/bookmarks/hooks/useRawBookmarkData');

describe('useBookmarks', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns all required properties', () => {
    vi.mocked(useRawBookmarkData.useRawBookmarkData).mockReturnValue({
      rawFolders: [],
      rawUncategorized: undefined,
      isLoading: false,
      error: null,
      refresh: vi.fn(),
    });

    vi.mocked(useBookmarkNavigation.useBookmarkNavigation).mockReturnValue({
      currentPage: 'All',
      setCurrentPage: vi.fn(),
    });

    vi.mocked(useBookmarkSearch.useBookmarkSearch).mockReturnValue({
      searchTerm: '',
      setSearchTerm: vi.fn(),
      pageContainers: [],
      items: [],
      counts: { all: 0, uncategorized: 0 },
    });

    vi.mocked(useBookmarkActions.useBookmarkActions).mockReturnValue({
      create: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
      move: vi.fn(),
      updateLayout: vi.fn(),
    });

    const { result } = renderHook(() => useBookmarks());

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
    expect(result.current).toHaveProperty('updateLayout');
  });

  it('spreads actions from useBookmarkActions', () => {
    const mockActions = {
      create: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
      move: vi.fn(),
      updateLayout: vi.fn(),
    };

    vi.mocked(useRawBookmarkData.useRawBookmarkData).mockReturnValue({
      rawFolders: [],
      rawUncategorized: undefined,
      isLoading: false,
      error: null,
      refresh: vi.fn(),
    });

    vi.mocked(useBookmarkNavigation.useBookmarkNavigation).mockReturnValue({
      currentPage: 'All',
      setCurrentPage: vi.fn(),
    });

    vi.mocked(useBookmarkSearch.useBookmarkSearch).mockReturnValue({
      searchTerm: '',
      setSearchTerm: vi.fn(),
      pageContainers: [],
      items: [],
      counts: { all: 0, uncategorized: 0 },
    });

    vi.mocked(useBookmarkActions.useBookmarkActions).mockReturnValue(mockActions);

    const { result } = renderHook(() => useBookmarks());

    expect(result.current.create).toBeDefined();
    expect(result.current.update).toBeDefined();
    expect(result.current.remove).toBeDefined();
    expect(result.current.move).toBeDefined();
    expect(result.current.updateLayout).toBeDefined();
  });
});
