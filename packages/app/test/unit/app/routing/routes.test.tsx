import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseBookmarkNavigation = vi.mocked(useBookmarkNavigation);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render AllPage when currentPage is "All"', () => {
    mockUseBookmarkNavigation.mockReturnValue({
      currentPage: 'All',
      setCurrentPage: vi.fn(),
      navigationStack: ['All'],
    } as any);

    render(<AppRoutes />);

    expect(screen.getByTestId('all-page')).toBeInTheDocument();
    expect(screen.getByText('All Page')).toBeInTheDocument();
  });

  it('should render UncategorizedPage when currentPage is "Uncategorized"', () => {
    mockUseBookmarkNavigation.mockReturnValue({
      currentPage: 'Uncategorized',
      setCurrentPage: vi.fn(),
      navigationStack: ['All', 'Uncategorized'],
    } as any);

    render(<AppRoutes />);

    expect(screen.getByTestId('uncategorized-page')).toBeInTheDocument();
    expect(screen.getByText('Uncategorized Page')).toBeInTheDocument();
  });

  it('should render FolderPage when currentPage is a folder ID string', () => {
    mockUseBookmarkNavigation.mockReturnValue({
      currentPage: 'folder-123',
      setCurrentPage: vi.fn(),
      navigationStack: ['All', 'folder-123'],
    } as any);

    render(<AppRoutes />);

    expect(screen.getByTestId('folder-page')).toBeInTheDocument();
    expect(screen.getByText('Folder Page: folder-123')).toBeInTheDocument();
  });

  it('should render FolderPage for any string that is not "All" or "Uncategorized"', () => {
    mockUseBookmarkNavigation.mockReturnValue({
      currentPage: 'another-folder',
      setCurrentPage: vi.fn(),
      navigationStack: ['All', 'another-folder'],
    } as any);

    render(<AppRoutes />);

    expect(screen.getByTestId('folder-page')).toBeInTheDocument();
    expect(screen.getByText('Folder Page: another-folder')).toBeInTheDocument();
  });

  it('should handle different folder IDs correctly', () => {
    const folderIds = ['folder-1', 'my-folder', '123', 'special-folder-name'];

    folderIds.forEach((folderId) => {
      mockUseBookmarkNavigation.mockReturnValue({
        currentPage: folderId,
        setCurrentPage: vi.fn(),
        navigationStack: ['All', folderId],
      } as any);

      const { container } = render(<AppRoutes />);

      expect(screen.getByTestId('folder-page')).toBeInTheDocument();
      expect(screen.getByText(`Folder Page: ${folderId}`)).toBeInTheDocument();

      container.remove();
    });
  });

  it('should call useBookmarkNavigation hook', () => {
    mockUseBookmarkNavigation.mockReturnValue({
      currentPage: 'All',
      setCurrentPage: vi.fn(),
      navigationStack: ['All'],
    } as any);

    render(<AppRoutes />);

    expect(mockUseBookmarkNavigation).toHaveBeenCalled();
  });

  it('should render NotFoundPage in default fallback case', () => {
    mockUseBookmarkNavigation.mockReturnValue({
      currentPage: null as unknown as string, // TypeScript will complain but we're testing runtime behavior
      setCurrentPage: vi.fn(),
      navigationStack: [],
    } as any);

    render(<AppRoutes />);

    expect(screen.getByTestId('not-found-page')).toBeInTheDocument();
  });
});
