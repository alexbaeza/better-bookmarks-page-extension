import { vi } from 'vitest';
import { when } from 'vitest-when';

import { AllPage } from '@/app/routing/All';
import { render, screen } from '~test/test-utils';

vi.mock('@/features/bookmarks/contexts/BookmarkNavigationContext', () => ({
  useBookmarkNavigation: vi.fn(),
}));
vi.mock('@/features/bookmarks/containers/Content', () => ({
  Content: () => <div data-testid="content">Content</div>,
}));

import { useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';

const mockUseBookmarkNavigation = vi.mocked(useBookmarkNavigation);

describe('AllPage', () => {
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
