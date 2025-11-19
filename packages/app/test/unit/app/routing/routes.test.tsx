import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { when } from 'vitest-when';
import { AppRoutes } from '@/app/routing/routes';

vi.mock('@/features/bookmarks/contexts/BookmarkNavigationContext', () => ({
  useBookmarkNavigation: vi.fn(),
  BookmarkPage: {
    All: 'All',
    Uncategorized: 'Uncategorized',
  },
}));

vi.mock('@/app/routing/Page', () => ({
  Page: ({ pageId }: { pageId: string }) => {
    if (pageId === 'All') return <div data-testid="all-page">All Page</div>;
    if (pageId === 'Uncategorized') return <div data-testid="uncategorized-page">Uncategorized Page</div>;
    return <div data-testid="folder-page">Folder Page: {pageId}</div>;
  },
}));

vi.mock('@/app/routing/NotFound', () => ({
  NotFoundPage: () => <div data-testid="not-found-page">NotFound Page</div>,
}));

import { useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';

describe('AppRoutes', () => {
  let mockUseBookmarkNavigation: ReturnType<typeof vi.mocked<typeof useBookmarkNavigation>>;

  const createMockReturn = (currentPage: string, navigationStack: string[]) => ({
    currentPage,
    setCurrentPage: vi.fn(),
    navigationStack,
    navigateToFolder: vi.fn(),
    navigateBack: vi.fn(),
    navigateToPage: vi.fn(),
    navigateToFolderWithPath: vi.fn(),
    canGoBack: navigationStack.length > 1,
  });

  beforeEach(() => {
    mockUseBookmarkNavigation = vi.mocked(useBookmarkNavigation);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render AllPage when currentPage is "All"', () => {
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn(createMockReturn('All', ['All']));

    render(<AppRoutes />);

    expect(screen.getByTestId('all-page')).toBeInTheDocument();
    expect(screen.getByText('All Page')).toBeInTheDocument();
  });

  it('should render UncategorizedPage when currentPage is "Uncategorized"', () => {
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn(createMockReturn('Uncategorized', ['All', 'Uncategorized']));

    render(<AppRoutes />);

    expect(screen.getByTestId('uncategorized-page')).toBeInTheDocument();
    expect(screen.getByText('Uncategorized Page')).toBeInTheDocument();
  });

  it('should render FolderPage when currentPage is a folder ID string', () => {
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn(createMockReturn('folder-123', ['All', 'folder-123']));

    render(<AppRoutes />);

    expect(screen.getByTestId('folder-page')).toBeInTheDocument();
    expect(screen.getByText('Folder Page: folder-123')).toBeInTheDocument();
  });

  it('should render FolderPage for any string that is not "All" or "Uncategorized"', () => {
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn(createMockReturn('another-folder', ['All', 'another-folder']));

    render(<AppRoutes />);

    expect(screen.getByTestId('folder-page')).toBeInTheDocument();
    expect(screen.getByText('Folder Page: another-folder')).toBeInTheDocument();
  });

  it.each(['folder-1', 'my-folder', '123', 'special-folder-name'])(
    'should handle folder ID "%s" correctly',
    (folderId) => {
      when(mockUseBookmarkNavigation)
        .calledWith()
        .thenReturn(createMockReturn(folderId, ['All', folderId]));

      render(<AppRoutes />);

      expect(screen.getByTestId('folder-page')).toBeInTheDocument();
      expect(screen.getByText(`Folder Page: ${folderId}`)).toBeInTheDocument();
    }
  );

  it('should call useBookmarkNavigation hook', () => {
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn(createMockReturn('All', ['All']));

    render(<AppRoutes />);

    expect(mockUseBookmarkNavigation).toHaveBeenCalled();
  });

  it('should render NotFoundPage in default fallback case', () => {
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn({
        ...createMockReturn('', []),
        currentPage: null as unknown as string, // TypeScript will complain but we're testing runtime behavior
      });

    render(<AppRoutes />);

    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
  });
});
