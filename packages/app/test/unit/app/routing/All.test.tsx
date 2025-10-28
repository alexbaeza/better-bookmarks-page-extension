import { vi } from 'vitest';
import { when } from 'vitest-when';

import { AllPage } from '@/app/routing/All';
import { render, screen } from '~test/test-utils';

vi.mock('@/features/bookmarks/contexts/BookmarkNavigationContext', () => ({
  useBookmarkNavigation: vi.fn(),
}));
vi.mock('@/features/bookmarks/containers/BookmarkFolderContent', () => ({
  BookmarkFolderContent: () => <div data-testid="content">Content</div>,
}));

import { useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';

describe('AllPage', () => {
  let mockUseBookmarkNavigation: ReturnType<typeof vi.mocked<typeof useBookmarkNavigation>>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseBookmarkNavigation = vi.mocked(useBookmarkNavigation);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders Content component', () => {
    const setCurrentPage = vi.fn();
    when(mockUseBookmarkNavigation).calledWith().thenReturn({
      currentPage: 'All',
      setCurrentPage,
    });

    render(<AllPage />);
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('calls setCurrentPage with "All" on mount', () => {
    const setCurrentPage = vi.fn();
    when(mockUseBookmarkNavigation).calledWith().thenReturn({
      currentPage: 'All',
      setCurrentPage,
    });

    render(<AllPage />);

    expect(setCurrentPage).toHaveBeenCalledWith('All');
  });
});
