import { vi } from 'vitest';
import { when } from 'vitest-when';

import { Page } from '@/app/routing/Page';
import { render, screen } from '~test/test-utils';

vi.mock('@/features/bookmarks/contexts/BookmarkNavigationContext', async () => {
  const actual = await vi.importActual<typeof import('@/features/bookmarks/contexts/BookmarkNavigationContext')>(
    '@/features/bookmarks/contexts/BookmarkNavigationContext'
  );
  return {
    ...actual,
    useBookmarkNavigation: vi.fn(),
  };
});
vi.mock('@/features/bookmarks/containers/BookmarkFolderContent', () => ({
  BookmarkFolderContent: () => <div data-testid="content">Content</div>,
}));

import { useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';

describe('Page', () => {
  let mockUseBookmarkNavigation: ReturnType<typeof vi.mocked<typeof useBookmarkNavigation>>;
  let setCurrentPage: ReturnType<typeof vi.fn>;

  const createMockReturn = (currentPage: string, navigationStack: string[]) =>
    ({
      currentPage,
      setCurrentPage,
      navigateToFolder: vi.fn(),
      navigateToPage: vi.fn(),
      navigateBack: vi.fn(),
      navigateToFolderWithPath: vi.fn(),
      canGoBack: navigationStack.length > 1,
      navigationStack,
    }) as ReturnType<typeof useBookmarkNavigation>;

  beforeEach(() => {
    mockUseBookmarkNavigation = vi.mocked(useBookmarkNavigation);
    setCurrentPage = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders Content component', () => {
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn(createMockReturn('All', ['All']));

    render(<Page pageId="All" />);
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('calls setCurrentPage with "All" on mount', () => {
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn(createMockReturn('All', ['All']));

    render(<Page pageId="All" />);

    expect(setCurrentPage).toHaveBeenCalledWith('All');
  });

  it('calls setCurrentPage with "Uncategorized" on mount', () => {
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn(createMockReturn('Uncategorized', ['All', 'Uncategorized']));

    render(<Page pageId="Uncategorized" />);

    expect(setCurrentPage).toHaveBeenCalledWith('Uncategorized');
  });

  it('calls setCurrentPage with folderId on mount', () => {
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn(createMockReturn('test-folder', ['All', 'test-folder']));

    render(<Page pageId="test-folder" />);

    expect(setCurrentPage).toHaveBeenCalledWith('test-folder');
  });

  it('updates setCurrentPage when pageId changes', () => {
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn(createMockReturn('All', ['All']));

    const { rerender } = render(<Page pageId="All" />);
    expect(setCurrentPage).toHaveBeenCalledWith('All');
    setCurrentPage.mockClear();

    rerender(<Page pageId="test-folder" />);
    expect(setCurrentPage).toHaveBeenCalledWith('test-folder');
  });
});
