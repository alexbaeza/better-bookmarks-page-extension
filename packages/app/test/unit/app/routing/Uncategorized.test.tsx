import { vi } from 'vitest';
import { when } from 'vitest-when';

import { UncategorizedPage } from '@/app/routing/Uncategorized';
import { render } from '~test/test-utils';

vi.mock('@/features/bookmarks/contexts/BookmarkNavigationContext', () => ({
  useBookmarkNavigation: vi.fn(),
}));
vi.mock('@/features/bookmarks/containers/Content', () => ({
  Content: () => <div data-testid="content">Content</div>,
}));

import { useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';

describe('UncategorizedPage', () => {
  let mockUseBookmarkNavigation: ReturnType<typeof vi.mocked<typeof useBookmarkNavigation>>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseBookmarkNavigation = vi.mocked(useBookmarkNavigation);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls setCurrentPage with "Uncategorized" on mount', () => {
    const setCurrentPage = vi.fn();
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn({
        currentPage: 'Uncategorized',
        setCurrentPage,
        navigationStack: ['All', 'Uncategorized'],
      } as any);

    render(<UncategorizedPage />);

    expect(setCurrentPage).toHaveBeenCalledWith('Uncategorized');
  });
});
