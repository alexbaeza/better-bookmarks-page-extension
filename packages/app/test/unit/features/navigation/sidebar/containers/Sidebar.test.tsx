import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { Sidebar } from '@/features/navigation/sidebar/containers/Sidebar';
import { AllProviders } from '~test/test-utils';

vi.mock('@/features/bookmarks/contexts/BookmarkNavigationContext', () => ({
  useBookmarkNavigation: vi.fn(),
}));

vi.mock('@/features/bookmarks/hooks/useBookmarks', () => ({
  useBookmarks: vi.fn(),
}));

vi.mock('@/features/navigation/sidebar/components/SidebarFlyout', () => ({
  SidebarFlyout: ({ folder, onClose }: { folder: any; onClose: () => void }) => (
    <div data-testid="sidebar-flyout">
      <div data-testid="flyout-folder-title">{folder.title}</div>
      <button data-testid="flyout-close" onClick={onClose} type="button">
        Close
      </button>
    </div>
  ),
}));

vi.mock('@/features/navigation/sidebar/components/SidebarItem', () => ({
  SidebarItem: ({ label, onClick, isSelected }: { label: string; onClick: () => void; isSelected: boolean }) => (
    <button data-selected={isSelected} data-testid={`sidebar-item-${label.toLowerCase().replace(/\s+/g, '-')}`} onClick={onClick} type="button">
      {label}
    </button>
  ),
}));

describe('Sidebar', () => {
  let mockUseBookmarkNavigation: ReturnType<typeof vi.mocked<typeof useBookmarkNavigation>>;
  let mockUseBookmarks: ReturnType<typeof vi.mocked<typeof useBookmarks>>;
  const mockSetCurrentPage = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseBookmarkNavigation = vi.mocked(useBookmarkNavigation);
    mockUseBookmarkNavigation.mockReturnValue({
      currentPage: 'All',
      setCurrentPage: mockSetCurrentPage,
    });
    mockUseBookmarks = vi.mocked(useBookmarks);
    mockUseBookmarks.mockReturnValue({
      counts: { all: 10, uncategorized: 3 },
      isLoading: false,
      rawFolders: [
        { children: [], id: 'folder-1', title: 'Test Folder 1' },
        { children: [], id: 'folder-2', title: 'Test Folder 2' },
      ],
      currentPage: 'All',
      error: null,
      items: [],
      pageContainers: [],
      searchTerm: '',
      setSearchTerm: vi.fn(),
      setCurrentPage: vi.fn(),
      create: vi.fn(),
      move: vi.fn(),
      remove: vi.fn(),
      update: vi.fn(),
      updateLayout: vi.fn(),
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockBookmarksData = {
    counts: {
      all: 10,
      uncategorized: 3,
    },
    isLoading: false,
    rawFolders: [
      {
        children: [],
        id: 'folder-1',
        title: 'Test Folder 1',
      },
      {
        children: [],
        id: 'folder-2',
        title: 'Test Folder 2',
      },
    ],
  };

  it('renders sidebar with default title', () => {
    render(
      <AllProviders>
        <Sidebar />
      </AllProviders>
    );

    expect(screen.getByText('Better Bookmarks')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('renders sidebar with custom title', () => {
    render(
      <AllProviders>
        <Sidebar title="Custom Title" />
      </AllProviders>
    );

    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('renders loading state when isLoading is true', () => {
    mockUseBookmarks.mockReturnValue({
      ...mockBookmarksData,
      isLoading: true,
    } as any);

    render(
      <AllProviders>
        <Sidebar />
      </AllProviders>
    );

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.getByText('Better Bookmarks')).toBeInTheDocument();
    expect(document.querySelector('.animate-pulse')).toBeInTheDocument();
  });

  it('renders All Items and Uncategorized sections', () => {
    render(
      <AllProviders>
        <Sidebar />
      </AllProviders>
    );

    expect(screen.getByTestId('sidebar-item-all-items')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-item-uncategorized')).toBeInTheDocument();
  });

  it('renders folder nodes', () => {
    render(
      <AllProviders>
        <Sidebar />
      </AllProviders>
    );

    expect(screen.getByText('Test Folder 1')).toBeInTheDocument();
    expect(screen.getByText('Test Folder 2')).toBeInTheDocument();
  });

  it('calls setCurrentPage when All Items is clicked', () => {
    render(
      <AllProviders>
        <Sidebar />
      </AllProviders>
    );

    const allItemsButton = screen.getByTestId('sidebar-item-all-items');
    fireEvent.click(allItemsButton);

    expect(mockSetCurrentPage).toHaveBeenCalledWith('All');
  });

  it('calls setCurrentPage when Uncategorized is clicked', () => {
    render(
      <AllProviders>
        <Sidebar />
      </AllProviders>
    );

    const uncategorizedButton = screen.getByTestId('sidebar-item-uncategorized');
    fireEvent.click(uncategorizedButton);

    expect(mockSetCurrentPage).toHaveBeenCalledWith('Uncategorized');
  });

  it('shows selected state for All Items when currentPage is All', () => {
    mockUseBookmarkNavigation.mockReturnValue({
      currentPage: 'All',
      setCurrentPage: mockSetCurrentPage,
    });

    render(
      <AllProviders>
        <Sidebar />
      </AllProviders>
    );

    const allItemsButton = screen.getByTestId('sidebar-item-all-items');
    expect(allItemsButton).toHaveAttribute('data-selected', 'true');
  });

  it('shows selected state for Uncategorized when currentPage is Uncategorized', () => {
    mockUseBookmarkNavigation.mockReturnValue({
      currentPage: 'Uncategorized',
      setCurrentPage: mockSetCurrentPage,
    });

    render(
      <AllProviders>
        <Sidebar />
      </AllProviders>
    );

    const uncategorizedButton = screen.getByTestId('sidebar-item-uncategorized');
    expect(uncategorizedButton).toHaveAttribute('data-selected', 'true');
  });

  it('renders SidebarFlyout when a folder is clicked', async () => {
    render(
      <AllProviders>
        <Sidebar />
      </AllProviders>
    );

    const folderButton = screen.getByText('Test Folder 1');
    fireEvent.click(folderButton);

    await waitFor(() => {
      expect(screen.getByTestId('sidebar-flyout')).toBeInTheDocument();
    });

    expect(screen.getByTestId('flyout-folder-title')).toHaveTextContent('Test Folder 1');
  });

  it('closes flyout when close button is clicked', async () => {
    render(
      <AllProviders>
        <Sidebar />
      </AllProviders>
    );

    const folderButton = screen.getByText('Test Folder 1');
    fireEvent.click(folderButton);

    await waitFor(() => {
      expect(screen.getByTestId('sidebar-flyout')).toBeInTheDocument();
    });

    const closeButton = screen.getByTestId('flyout-close');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.queryByTestId('sidebar-flyout')).not.toBeInTheDocument();
    });
  });

  it('renders custom footer when provided', () => {
    const customFooter = <div data-testid="custom-footer">Custom Footer</div>;

    render(
      <AllProviders>
        <Sidebar footer={customFooter} />
      </AllProviders>
    );

    expect(screen.getByTestId('custom-footer')).toBeInTheDocument();
  });

  it('does not render flyout when currentPage is All', () => {
    mockUseBookmarkNavigation.mockReturnValue({
      currentPage: 'All',
      setCurrentPage: mockSetCurrentPage,
    });

    render(
      <AllProviders>
        <Sidebar />
      </AllProviders>
    );

    expect(screen.queryByTestId('sidebar-flyout')).not.toBeInTheDocument();
  });

  it('does not render flyout when currentPage is Uncategorized', () => {
    mockUseBookmarkNavigation.mockReturnValue({
      currentPage: 'Uncategorized',
      setCurrentPage: mockSetCurrentPage,
    });

    render(
      <AllProviders>
        <Sidebar />
      </AllProviders>
    );

    expect(screen.queryByTestId('sidebar-flyout')).not.toBeInTheDocument();
  });

  it('handles empty folders array', () => {
    mockUseBookmarks.mockReturnValue({
      ...mockBookmarksData,
      rawFolders: [],
    } as any);

    render(
      <AllProviders>
        <Sidebar />
      </AllProviders>
    );

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.queryByTestId('folder-node-folder-1')).not.toBeInTheDocument();
  });
});
