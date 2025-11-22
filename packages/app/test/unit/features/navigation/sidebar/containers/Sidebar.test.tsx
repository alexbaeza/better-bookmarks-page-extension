import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { when } from 'vitest-when';
import { useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { Sidebar } from '@/features/navigation/sidebar/containers/Sidebar';
import { AllProviders } from '~test/test-utils';

vi.mock('@/features/bookmarks/contexts/BookmarkNavigationContext', async () => {
  const actual = await vi.importActual<typeof import('@/features/bookmarks/contexts/BookmarkNavigationContext')>(
    '@/features/bookmarks/contexts/BookmarkNavigationContext'
  );
  return {
    ...actual,
    useBookmarkNavigation: vi.fn(),
  };
});

vi.mock('@/features/bookmarks/hooks/useBookmarks', () => ({
  useBookmarks: vi.fn(),
}));

vi.mock('@/features/navigation/sidebar/components/SidebarFlyout', () => ({
  SidebarFlyout: ({ folder, onClose }: { folder: any; onClose: () => void }) => (
    <div data-testid="sidebar-flyout">
      <div data-testid="flyout-title">{folder.title}</div>
      <button data-testid="flyout-close-button" onClick={onClose} type="button">
        Close
      </button>
    </div>
  ),
}));

vi.mock('@/features/navigation/sidebar/components/SidebarItem', () => ({
  SidebarItem: ({ label, onClick, isSelected }: { label: string; onClick: () => void; isSelected: boolean }) => (
    <button
      data-selected={isSelected}
      data-testid={`sidebar-item-${label.toLowerCase().replace(/\s+/g, '-')}`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  ),
}));

vi.mock('@/features/navigation/sidebar/components/SidebarFolderNode', () => ({
  SidebarFolderNode: ({ folder, clickFolder }: { folder: any; clickFolder: (id: string) => void }) => {
    const renderFolder = (folder: any) => (
      <div key={folder.id}>
        <button data-testid={`sidebar-folder-${folder.id}`} onClick={() => clickFolder(folder.id)} type="button">
          {folder.title}
        </button>
        {folder.children
          ?.filter((child: any) => Array.isArray(child.children))
          .map((nestedFolder: any) => renderFolder(nestedFolder))}
      </div>
    );
    return renderFolder(folder);
  },
}));

describe('Sidebar', () => {
  let mockUseBookmarkNavigation: ReturnType<typeof vi.mocked<typeof useBookmarkNavigation>>;
  let mockUseBookmarks: ReturnType<typeof vi.mocked<typeof useBookmarks>>;
  const mockSetCurrentPage = vi.fn();

  beforeEach(() => {
    mockUseBookmarkNavigation = vi.mocked(useBookmarkNavigation);
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn({
        currentPage: 'All',
        setCurrentPage: mockSetCurrentPage,
        navigateToFolder: vi.fn(),
        navigateToPage: vi.fn(),
        navigateBack: vi.fn(),
        navigateToFolderWithPath: vi.fn(),
        canGoBack: false,
        navigationStack: ['All'],
      });
    mockUseBookmarks = vi.mocked(useBookmarks);
    when(mockUseBookmarks)
      .calledWith()
      .thenReturn({
        counts: { all: 10, uncategorized: 3 },
        isLoading: false,
        rawFolders: [
          { children: [], id: 'folder-1', title: 'Test Folder 1' },
          { children: [], id: 'folder-2', title: 'Test Folder 2' },
        ],
        currentPage: 'All',
        error: undefined,
        items: [],
        pageContainers: [],
        searchTerm: '',
        setSearchTerm: vi.fn(),
        setCurrentPage: vi.fn(),
        create: vi.fn(),
        move: vi.fn(),
        remove: vi.fn(),
        update: vi.fn(),
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
    when(mockUseBookmarks)
      .calledWith()
      .thenReturn({
        ...mockBookmarksData,
        isLoading: true,
      } as Partial<ReturnType<typeof useBookmarks>>);

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
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn({
        currentPage: 'All',
        setCurrentPage: mockSetCurrentPage,
        navigateToFolder: vi.fn(),
        navigateToPage: vi.fn(),
        navigateBack: vi.fn(),
        navigateToFolderWithPath: vi.fn(),
        canGoBack: false,
        navigationStack: ['All'],
      });
    render(
      <AllProviders>
        <Sidebar />
      </AllProviders>
    );

    expect(screen.getByTestId('sidebar-folder-folder-1')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-folder-folder-2')).toBeInTheDocument();
    expect(screen.getByText('Test Folder 1')).toBeInTheDocument();
    expect(screen.getByText('Test Folder 2')).toBeInTheDocument();
  });

  it('calls navigateToPage when All Items is clicked', () => {
    const mockNavigateToPage = vi.fn();
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn({
        currentPage: 'All',
        setCurrentPage: mockSetCurrentPage,
        navigateToFolder: vi.fn(),
        navigateToPage: mockNavigateToPage,
        navigateBack: vi.fn(),
        navigateToFolderWithPath: vi.fn(),
        canGoBack: false,
        navigationStack: ['All'],
      });

    render(
      <AllProviders>
        <Sidebar />
      </AllProviders>
    );

    const allItemsButton = screen.getByTestId('sidebar-item-all-items');
    fireEvent.click(allItemsButton);

    expect(mockNavigateToPage).toHaveBeenCalledWith('All');
  });

  it('calls navigateToPage when Uncategorized is clicked', () => {
    const mockNavigateToPage = vi.fn();
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn({
        currentPage: 'All',
        setCurrentPage: mockSetCurrentPage,
        navigateToFolder: vi.fn(),
        navigateToPage: mockNavigateToPage,
        navigateBack: vi.fn(),
        navigateToFolderWithPath: vi.fn(),
        canGoBack: false,
        navigationStack: ['All'],
      });

    render(
      <AllProviders>
        <Sidebar />
      </AllProviders>
    );

    const uncategorizedButton = screen.getByTestId('sidebar-item-uncategorized');
    fireEvent.click(uncategorizedButton);

    expect(mockNavigateToPage).toHaveBeenCalledWith('Uncategorized');
  });

  it('calls navigateToFolderWithPath with correct path when root folder is clicked', () => {
    const mockNavigateToFolderWithPath = vi.fn();
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn({
        currentPage: 'All',
        setCurrentPage: mockSetCurrentPage,
        navigateToFolder: vi.fn(),
        navigateToPage: vi.fn(),
        navigateBack: vi.fn(),
        navigateToFolderWithPath: mockNavigateToFolderWithPath,
        canGoBack: false,
        navigationStack: ['All'],
      });

    when(mockUseBookmarks)
      .calledWith()
      .thenReturn({
        ...mockBookmarksData,
        rawFolders: [
          {
            id: 'folder-1',
            title: 'Folder 1',
            children: [],
          },
        ],
      } as Partial<ReturnType<typeof useBookmarks>>);

    render(
      <AllProviders>
        <Sidebar />
      </AllProviders>
    );

    const folderButton = screen.getByTestId('sidebar-folder-folder-1');
    fireEvent.click(folderButton);

    expect(mockNavigateToFolderWithPath).toHaveBeenCalledWith('folder-1', ['All', 'folder-1']);
  });

  it('calls navigateToFolderWithPath with correct nested path when nested folder is clicked', () => {
    const mockNavigateToFolderWithPath = vi.fn();
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn({
        currentPage: 'All',
        setCurrentPage: mockSetCurrentPage,
        navigateToFolder: vi.fn(),
        navigateToPage: vi.fn(),
        navigateBack: vi.fn(),
        navigateToFolderWithPath: mockNavigateToFolderWithPath,
        canGoBack: false,
        navigationStack: ['All'],
      });

    when(mockUseBookmarks)
      .calledWith()
      .thenReturn({
        ...mockBookmarksData,
        rawFolders: [
          {
            id: 'folder-1',
            title: 'Folder 1',
            children: [
              {
                id: 'subfolder-1',
                title: 'Subfolder 1',
                children: [],
              },
            ],
          },
        ],
      } as Partial<ReturnType<typeof useBookmarks>>);

    render(
      <AllProviders>
        <Sidebar />
      </AllProviders>
    );

    const folderButton = screen.getByTestId('sidebar-folder-subfolder-1');
    fireEvent.click(folderButton);

    expect(mockNavigateToFolderWithPath).toHaveBeenCalledWith('subfolder-1', ['All', 'folder-1', 'subfolder-1']);
  });

  it('shows selected state for All Items when currentPage is All', () => {
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn({
        currentPage: 'All',
        setCurrentPage: mockSetCurrentPage,
        navigateToFolder: vi.fn(),
        navigateToPage: vi.fn(),
        navigateBack: vi.fn(),
        navigateToFolderWithPath: vi.fn(),
        canGoBack: false,
        navigationStack: ['All'],
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
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn({
        currentPage: 'Uncategorized',
        setCurrentPage: mockSetCurrentPage,
        navigateToFolder: vi.fn(),
        navigateToPage: vi.fn(),
        navigateBack: vi.fn(),
        navigateToFolderWithPath: vi.fn(),
        canGoBack: false,
        navigationStack: ['All', 'Uncategorized'],
      });

    render(
      <AllProviders>
        <Sidebar />
      </AllProviders>
    );

    const uncategorizedButton = screen.getByTestId('sidebar-item-uncategorized');
    expect(uncategorizedButton).toHaveAttribute('data-selected', 'true');
  });

  it.skip('renders SidebarFlyout when a folder is clicked', async () => {
    render(
      <AllProviders>
        <Sidebar />
      </AllProviders>
    );

    const folderButton = screen.getByTestId('sidebar-folder-folder-1');
    fireEvent.click(folderButton);

    await waitFor(() => {
      expect(screen.getByTestId('sidebar-flyout')).toBeInTheDocument();
    });

    expect(screen.getByTestId('flyout-title')).toHaveTextContent('Test Folder 1');
  });

  it.skip('closes flyout when close button is clicked', async () => {
    render(
      <AllProviders>
        <Sidebar />
      </AllProviders>
    );

    const folderButton = screen.getByTestId('sidebar-folder-folder-1');
    fireEvent.click(folderButton);

    await waitFor(() => {
      expect(screen.getByTestId('sidebar-flyout')).toBeInTheDocument();
    });

    const closeButton = screen.getByTestId('flyout-close-button');
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
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn({
        currentPage: 'All',
        setCurrentPage: mockSetCurrentPage,
        navigateToFolder: vi.fn(),
        navigateToPage: vi.fn(),
        navigateBack: vi.fn(),
        navigateToFolderWithPath: vi.fn(),
        canGoBack: false,
        navigationStack: ['All'],
      });

    render(
      <AllProviders>
        <Sidebar />
      </AllProviders>
    );

    expect(screen.queryByTestId('sidebar-flyout')).not.toBeInTheDocument();
  });

  it('does not render flyout when currentPage is Uncategorized', () => {
    when(mockUseBookmarkNavigation)
      .calledWith()
      .thenReturn({
        currentPage: 'Uncategorized',
        setCurrentPage: mockSetCurrentPage,
        navigateToFolder: vi.fn(),
        navigateToPage: vi.fn(),
        navigateBack: vi.fn(),
        navigateToFolderWithPath: vi.fn(),
        canGoBack: false,
        navigationStack: ['All', 'Uncategorized'],
      });

    render(
      <AllProviders>
        <Sidebar />
      </AllProviders>
    );

    expect(screen.queryByTestId('sidebar-flyout')).not.toBeInTheDocument();
  });

  it('handles empty folders array', () => {
    when(mockUseBookmarks)
      .calledWith()
      .thenReturn({
        ...mockBookmarksData,
        rawFolders: [],
      } as Partial<ReturnType<typeof useBookmarks>>);

    render(
      <AllProviders>
        <Sidebar />
      </AllProviders>
    );

    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    expect(screen.queryByTestId('folder-node-folder-1')).not.toBeInTheDocument();
  });
});
