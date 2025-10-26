import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { Content } from '@/features/bookmarks/containers/Content';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { AllProviders } from '~test/test-utils';

vi.mock('@/features/bookmarks/hooks/useBookmarks', () => ({
  useBookmarks: vi.fn(),
}));

vi.mock('@/features/bookmarks/containers/BookmarkContentRenderer', () => ({
  BookmarkContentRenderer: ({ folderContents, folderId }: { folderContents: any[]; folderId: string }) => (
    <div data-testid="bookmark-content-renderer">
      <div data-testid="folder-id">{folderId}</div>
      <div data-testid="folder-contents-count">{folderContents.length}</div>
    </div>
  ),
}));

vi.mock('@/features/bookmarks/containers/RenderFolders', () => ({
  RenderFolders: ({ folders }: { folders: any[] }) => (
    <div data-testid="render-folders">
      <div data-testid="folders-count">{folders.length}</div>
    </div>
  ),
}));

vi.mock('@/features/navigation/components/NotFoundIllustration', () => ({
  NotFoundIllustration: ({ className }: { className: string }) => (
    <div className={className} data-testid="not-found-illustration">
      Not Found Illustration
    </div>
  ),
}));

describe('Content', () => {
  let mockUseBookmarks: ReturnType<typeof vi.mocked<typeof useBookmarks>>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseBookmarks = vi.mocked(useBookmarks);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders empty state when no pageContainers', () => {
    mockUseBookmarks.mockReturnValue({
      currentPage: 'All',
      pageContainers: [],
    } as any);

    render(
      <AllProviders>
        <Content />
      </AllProviders>
    );

    expect(screen.getByTestId('empty-state-container')).toBeInTheDocument();
    expect(screen.getByTestId('empty-state-message')).toBeInTheDocument();
    expect(screen.getByTestId('not-found-illustration')).toBeInTheDocument();
  });

  it('renders empty state when pageContainers has one empty container', () => {
    mockUseBookmarks.mockReturnValue({
      currentPage: 'All',
      pageContainers: [{ children: [], id: 'folder-1' }],
    } as any);

    render(
      <AllProviders>
        <Content />
      </AllProviders>
    );

    expect(screen.getByTestId('empty-state-container')).toBeInTheDocument();
    expect(screen.getByTestId('empty-state-message')).toBeInTheDocument();
    expect(screen.getByTestId('not-found-illustration')).toBeInTheDocument();
  });

  it('renders empty state when pageContainers has one container with undefined children', () => {
    mockUseBookmarks.mockReturnValue({
      currentPage: 'All',
      pageContainers: [{ children: undefined, id: 'folder-1' }],
    } as any);

    render(
      <AllProviders>
        <Content />
      </AllProviders>
    );

    expect(screen.getByTestId('empty-state-container')).toBeInTheDocument();
    expect(screen.getByTestId('empty-state-message')).toBeInTheDocument();
    expect(screen.getByTestId('not-found-illustration')).toBeInTheDocument();
  });

  it('renders RenderFolders for All page', () => {
    const mockFolders = [
      { children: [{ id: 'bookmark-1' }], id: 'folder-1' },
      { children: [{ id: 'bookmark-2' }], id: 'folder-2' },
    ];

    mockUseBookmarks.mockReturnValue({
      currentPage: 'All',
      pageContainers: mockFolders,
    } as any);

    render(
      <AllProviders>
        <Content />
      </AllProviders>
    );

    expect(screen.getByTestId('render-folders')).toBeInTheDocument();
    expect(screen.getByTestId('folders-count')).toHaveTextContent('2');
  });

  it('renders RenderFolders for Uncategorized page', () => {
    const mockFolders = [{ children: [{ id: 'bookmark-1' }], id: 'uncategorized' }];

    mockUseBookmarks.mockReturnValue({
      currentPage: 'Uncategorized',
      pageContainers: mockFolders,
    } as any);

    render(
      <AllProviders>
        <Content />
      </AllProviders>
    );

    expect(screen.getByTestId('render-folders')).toBeInTheDocument();
    expect(screen.getByTestId('folders-count')).toHaveTextContent('1');
  });

  it('renders BookmarkContentRenderer for specific folder page', () => {
    const mockFolders = [
      {
        children: [
          { id: 'bookmark-1', title: 'Bookmark 1' },
          { id: 'bookmark-2', title: 'Bookmark 2' },
        ],
        id: 'folder-123',
      },
    ];

    mockUseBookmarks.mockReturnValue({
      currentPage: 'folder-123',
      pageContainers: mockFolders,
    } as any);

    render(
      <AllProviders>
        <Content />
      </AllProviders>
    );

    expect(screen.getByTestId('bookmark-content-renderer')).toBeInTheDocument();
    expect(screen.getByTestId('folder-id')).toHaveTextContent('folder-123');
    expect(screen.getByTestId('folder-contents-count')).toHaveTextContent('2');
  });

  it('handles folder with undefined children in BookmarkContentRenderer', () => {
    const mockFolders = [
      {
        children: undefined,
        id: 'folder-123',
      },
    ];

    mockUseBookmarks.mockReturnValue({
      currentPage: 'folder-123',
      pageContainers: mockFolders,
    } as any);

    render(
      <AllProviders>
        <Content />
      </AllProviders>
    );

    expect(screen.getByTestId('empty-state-container')).toBeInTheDocument();
    expect(screen.getByTestId('empty-state-message')).toBeInTheDocument();
    expect(screen.getByTestId('not-found-illustration')).toBeInTheDocument();
  });

  it('handles folder with null children in BookmarkContentRenderer', () => {
    const mockFolders = [
      {
        children: null,
        id: 'folder-123',
      },
    ];

    mockUseBookmarks.mockReturnValue({
      currentPage: 'folder-123',
      pageContainers: mockFolders,
    } as any);

    render(
      <AllProviders>
        <Content />
      </AllProviders>
    );

    expect(screen.getByTestId('empty-state-container')).toBeInTheDocument();
    expect(screen.getByTestId('empty-state-message')).toBeInTheDocument();
    expect(screen.getByTestId('not-found-illustration')).toBeInTheDocument();
  });

  it('renders correct CSS classes for All page', () => {
    const mockFolders = [{ children: [{ id: 'bookmark-1' }], id: 'folder-1' }];

    mockUseBookmarks.mockReturnValue({
      currentPage: 'All',
      pageContainers: mockFolders,
    } as any);

    render(
      <AllProviders>
        <Content />
      </AllProviders>
    );

    const renderFolders = screen.getByTestId('render-folders');
    expect(renderFolders.parentElement).toHaveClass('mx-auto flex w-full flex-col justify-center p-2');
  });

  it('renders correct CSS classes for Uncategorized page', () => {
    const mockFolders = [{ children: [{ id: 'bookmark-1' }], id: 'uncategorized' }];

    mockUseBookmarks.mockReturnValue({
      currentPage: 'Uncategorized',
      pageContainers: mockFolders,
    } as any);

    render(
      <AllProviders>
        <Content />
      </AllProviders>
    );

    const renderFolders = screen.getByTestId('render-folders');
    expect(renderFolders.parentElement).toHaveClass('mx-auto flex w-full flex-col justify-center p-2');
  });

  it('renders correct CSS classes for specific folder page', () => {
    const mockFolders = [
      {
        children: [{ id: 'bookmark-1' }],
        id: 'folder-123',
      },
    ];

    mockUseBookmarks.mockReturnValue({
      currentPage: 'folder-123',
      pageContainers: mockFolders,
    } as any);

    render(
      <AllProviders>
        <Content />
      </AllProviders>
    );

    const bookmarkRenderer = screen.getByTestId('bookmark-content-renderer');
    expect(bookmarkRenderer.parentElement?.parentElement).toHaveClass('mx-auto flex w-full flex-col justify-center p-2');
    expect(bookmarkRenderer.parentElement).toHaveClass('min-h-64 w-full overflow-hidden rounded-lg border-4 border-bgColor-tertiary');
  });

  it('renders correct CSS classes for empty state', () => {
    mockUseBookmarks.mockReturnValue({
      currentPage: 'All',
      pageContainers: [],
    } as any);

    render(
      <AllProviders>
        <Content />
      </AllProviders>
    );

    const emptyStateContainer = screen.getByTestId('empty-state-container');
    const emptyStateMessage = screen.getByTestId('empty-state-message');

    expect(emptyStateContainer).toHaveClass('flex w-full items-center justify-center p-2');
    expect(emptyStateMessage.parentElement).toHaveClass('flex flex-col items-center');
  });
});
