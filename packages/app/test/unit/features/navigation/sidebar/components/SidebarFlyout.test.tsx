import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { useBookmarkNavigation } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { useFavicon } from '@/features/bookmarks/hooks/useFavicon';
import { SidebarFlyout } from '@/features/navigation/sidebar/components/SidebarFlyout';
import { AllProviders } from '~test/test-utils';

vi.mock('@/features/bookmarks/contexts/BookmarkNavigationContext', () => ({
  useBookmarkNavigation: vi.fn(),
}));

vi.mock('@/features/bookmarks/hooks/useFavicon', () => ({
  useFavicon: vi.fn(),
}));

vi.mock('@/shared/ui/Flyout', () => ({
  InlineFlyout: ({ children, widthClass }: { children: React.ReactNode; widthClass: string }) => (
    <div className={widthClass} data-testid="inline-flyout">
      {children}
    </div>
  ),
}));

vi.mock('@/shared/ui/ImageWithFallback', () => ({
  ImageWithFallback: ({ src, alt, className }: { src: string; fallback: string; alt: string; className: string }) => (
    <img alt={alt} className={className} data-testid="favicon" src={src} />
  ),
}));

describe('SidebarFlyout', () => {
  let mockUseBookmarkNavigation: ReturnType<typeof vi.mocked<typeof useBookmarkNavigation>>;
  let _mockUseFavicon: ReturnType<typeof vi.mocked<typeof useFavicon>>;
  const mockFolder = {
    children: [
      {
        children: [],
        id: 'subfolder-1',
        title: 'Subfolder 1',
      },
      {
        id: 'bookmark-1',
        title: 'Test Bookmark',
        url: 'https://example.com',
      },
    ],
    id: 'folder-1',
    title: 'Test Folder',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseBookmarkNavigation = vi.mocked(useBookmarkNavigation);
    mockUseBookmarkNavigation.mockReturnValue({
      currentPage: 'folder-1',
      setCurrentPage: vi.fn(),
    });
    _mockUseFavicon = vi.mocked(useFavicon);
    _mockUseFavicon.mockReturnValue('https://example.com/favicon.ico');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const mockOnClose = vi.fn();
  const mockClickFolder = vi.fn();

  it('renders the flyout with folder title and close button', () => {
    render(
      <AllProviders>
        <SidebarFlyout clickFolder={mockClickFolder} folder={mockFolder} onClose={mockOnClose} />
      </AllProviders>
    );

    expect(screen.getByTestId('inline-flyout')).toBeInTheDocument();
    expect(screen.getByText('Test Folder')).toBeInTheDocument();
    expect(screen.getByTestId('flyout-close-button')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    render(
      <AllProviders>
        <SidebarFlyout clickFolder={mockClickFolder} folder={mockFolder} onClose={mockOnClose} />
      </AllProviders>
    );

    const closeButton = screen.getByTestId('flyout-close-button');
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders folders section with correct count', () => {
    render(
      <AllProviders>
        <SidebarFlyout clickFolder={mockClickFolder} folder={mockFolder} onClose={mockOnClose} />
      </AllProviders>
    );

    expect(screen.getByText('Folders (1)')).toBeInTheDocument();
  });

  it('renders items section with correct count', () => {
    render(
      <AllProviders>
        <SidebarFlyout clickFolder={mockClickFolder} folder={mockFolder} onClose={mockOnClose} />
      </AllProviders>
    );

    expect(screen.getByText('Items (1)')).toBeInTheDocument();
  });

  it('renders subfolder items', () => {
    render(
      <AllProviders>
        <SidebarFlyout clickFolder={mockClickFolder} folder={mockFolder} onClose={mockOnClose} />
      </AllProviders>
    );

    expect(screen.getByText('Subfolder 1')).toBeInTheDocument();
  });

  it('renders bookmark items with favicon', () => {
    render(
      <AllProviders>
        <SidebarFlyout clickFolder={mockClickFolder} folder={mockFolder} onClose={mockOnClose} />
      </AllProviders>
    );

    expect(screen.getByText('Test Bookmark')).toBeInTheDocument();
    expect(screen.getByTestId('favicon')).toBeInTheDocument();
  });

  it('calls clickFolder when subfolder is clicked', () => {
    render(
      <AllProviders>
        <SidebarFlyout clickFolder={mockClickFolder} folder={mockFolder} onClose={mockOnClose} />
      </AllProviders>
    );

    const subfolderItem = screen.getByText('Subfolder 1');
    fireEvent.click(subfolderItem);

    expect(mockClickFolder).toHaveBeenCalledWith('subfolder-1');
  });

  it('calls clickFolder when bookmark is clicked', () => {
    render(
      <AllProviders>
        <SidebarFlyout clickFolder={mockClickFolder} folder={mockFolder} onClose={mockOnClose} />
      </AllProviders>
    );

    const bookmarkItem = screen.getByText('Test Bookmark');
    fireEvent.click(bookmarkItem);

    expect(mockClickFolder).toHaveBeenCalledWith('bookmark-1');
  });

  it('handles empty folder gracefully', () => {
    const emptyFolder = {
      children: [],
      id: 'empty-folder',
      title: 'Empty Folder',
    };

    render(
      <AllProviders>
        <SidebarFlyout clickFolder={mockClickFolder} folder={emptyFolder} onClose={mockOnClose} />
      </AllProviders>
    );

    expect(screen.getByText('Empty Folder')).toBeInTheDocument();
    expect(screen.getByText('Folders (0)')).toBeInTheDocument();
    expect(screen.getByText('Items (0)')).toBeInTheDocument();
  });

  it('handles folder with undefined children', () => {
    const folderWithUndefinedChildren = {
      children: undefined,
      id: 'folder-undefined',
      title: 'Folder with undefined children',
    };

    render(
      <AllProviders>
        <SidebarFlyout clickFolder={mockClickFolder} folder={folderWithUndefinedChildren} onClose={mockOnClose} />
      </AllProviders>
    );

    expect(screen.getByText('Folder with undefined children')).toBeInTheDocument();
    expect(screen.getByText('Folders (0)')).toBeInTheDocument();
    expect(screen.getByText('Items (0)')).toBeInTheDocument();
  });
});
