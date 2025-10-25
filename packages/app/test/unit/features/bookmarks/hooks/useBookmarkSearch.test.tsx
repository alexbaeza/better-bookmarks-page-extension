import { renderHook } from '@testing-library/react';
import { vi } from 'vitest';
import { when } from 'vitest-when';

import { useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { useBookmarkSearchTerm } from '@/features/bookmarks/contexts/BookmarkSearchContext';
import { useBookmarkSearch } from '@/features/bookmarks/hooks/useBookmarkSearch';

vi.mock('@/features/bookmarks/contexts/BookmarkSearchContext');
vi.mock('@/features/bookmarks/contexts/BookmarkNavigationContext');

describe('useBookmarkSearch', () => {
  let mockSearchTerm: vi.MockedFunction<typeof useBookmarkSearchTerm>;
  let mockNavigation: vi.MockedFunction<typeof useBookmarkNavigation>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockSearchTerm = vi.mocked(useBookmarkSearchTerm);
    mockNavigation = vi.mocked(useBookmarkNavigation);
  });

  it('returns basic properties from hooks', () => {
    when(mockSearchTerm).calledWith().thenReturn({
      searchTerm: '',
      setSearchTerm: vi.fn(),
      resetSearch: vi.fn(),
    });

    when(mockNavigation).calledWith().thenReturn({
      currentPage: 'All',
    });

    const { result } = renderHook(() => useBookmarkSearch({ rawFolders: [], rawUncategorized: undefined }));

    expect(result.current).toHaveProperty('searchTerm');
    expect(result.current).toHaveProperty('setSearchTerm');
    expect(result.current).toHaveProperty('pageContainers');
    expect(result.current).toHaveProperty('items');
    expect(result.current).toHaveProperty('counts');
  });
});
