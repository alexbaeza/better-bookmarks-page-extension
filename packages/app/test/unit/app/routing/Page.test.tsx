import { vi } from 'vitest';
import { when } from 'vitest-when';

import { Page } from '@/app/routing/Page';
import { render, screen } from '~test/test-utils';

vi.mock('@/features/bookmarks/contexts/BookmarkNavigationContext', () => ({
  useBookmarkNavigation: vi.fn(),
}));
vi.mock('@/features/bookmarks/containers/BookmarkFolderContent', () => ({
  BookmarkFolderContent: () => <div data-testid="content">Content</div>,
}));

import { useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';

describe('Page', () => {
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
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn({
        currentPage: 'All',
        setCurrentPage,
        navigateToFolder: vi.fn(),
        navigateToPage: vi.fn(),
        navigateBack: vi.fn(),
        canGoBack: false,
        navigationStack: ['All'],
      } as any);

    render(<Page pageId="All" />);
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('calls setCurrentPage with "All" on mount', () => {
    const setCurrentPage = vi.fn();
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn({
        currentPage: 'All',
        setCurrentPage,
        navigateToFolder: vi.fn(),
        navigateToPage: vi.fn(),
        navigateBack: vi.fn(),
        canGoBack: false,
        navigationStack: ['All'],
      } as any);

    render(<Page pageId="All" />);

    expect(setCurrentPage).toHaveBeenCalledWith('All');
  });

  it('calls setCurrentPage with "Uncategorized" on mount', () => {
    const setCurrentPage = vi.fn();
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn({
        currentPage: 'Uncategorized',
        setCurrentPage,
        navigateToFolder: vi.fn(),
        navigateToPage: vi.fn(),
        navigateBack: vi.fn(),
        canGoBack: false,
        navigationStack: ['All', 'Uncategorized'],
      } as any);

    render(<Page pageId="Uncategorized" />);

    expect(setCurrentPage).toHaveBeenCalledWith('Uncategorized');
  });

  it('calls setCurrentPage with folderId on mount', () => {
    const setCurrentPage = vi.fn();
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn({
        currentPage: 'test-folder',
        setCurrentPage,
        navigateToFolder: vi.fn(),
        navigateToPage: vi.fn(),
        navigateBack: vi.fn(),
        canGoBack: true,
        navigationStack: ['All', 'test-folder'],
      } as any);

    render(<Page pageId="test-folder" />);

    expect(setCurrentPage).toHaveBeenCalledWith('test-folder');
  });

  it('updates setCurrentPage when pageId changes', () => {
    const setCurrentPage = vi.fn();
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn({
        currentPage: 'All',
        setCurrentPage,
        navigateToFolder: vi.fn(),
        navigateToPage: vi.fn(),
        navigateBack: vi.fn(),
        canGoBack: false,
        navigationStack: ['All'],
      } as any);

    const { rerender } = render(<Page pageId="All" />);
    expect(setCurrentPage).toHaveBeenCalledWith('All');
    setCurrentPage.mockClear();

    rerender(<Page pageId="test-folder" />);
    expect(setCurrentPage).toHaveBeenCalledWith('test-folder');
  });
});
