import { vi } from 'vitest';

import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { SearchBar } from '@/features/search/containers/SearchBar';
import { fireEvent, render, screen } from '~test/test-utils';

vi.mock('@/features/bookmarks/hooks/useBookmarks', () => ({
  useBookmarks: vi.fn(),
}));

describe('SearchBar', () => {
  let mockUseBookmarks: ReturnType<typeof vi.mocked<typeof useBookmarks>>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseBookmarks = vi.mocked(useBookmarks);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders with placeholder for "All" page', () => {
    mockUseBookmarks.mockReturnValue({
      counts: { folders: 0, total: 0, uncategorized: 0 },
      create: vi.fn(),
      currentPage: 'All',
      error: null,
      isLoading: false,
      items: [],
      move: vi.fn(),
      pageContainers: [],
      rawFolders: [],
      remove: vi.fn(),
      searchTerm: '',
      setSearchTerm: vi.fn(),
      update: vi.fn(),
      updateLayout: vi.fn(),
    });

    render(<SearchBar />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('updates search term on input change', () => {
    const mockSetSearchTerm = vi.fn();
    mockUseBookmarks.mockReturnValue({
      counts: { folders: 0, total: 0, uncategorized: 0 },
      create: vi.fn(),
      currentPage: 'All',
      error: null,
      isLoading: false,
      items: [],
      move: vi.fn(),
      pageContainers: [],
      rawFolders: [],
      remove: vi.fn(),
      searchTerm: '',
      setSearchTerm: mockSetSearchTerm,
      update: vi.fn(),
      updateLayout: vi.fn(),
    });

    render(<SearchBar />);

    const input = screen.getByTestId('search-input');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(mockSetSearchTerm).toHaveBeenCalledWith('test');
  });

  it('renders folder placeholder when on a specific folder page', () => {
    mockUseBookmarks.mockReturnValue({
      counts: { folders: 0, total: 0, uncategorized: 0 },
      create: vi.fn(),
      currentPage: 'folder-1',
      error: null,
      isLoading: false,
      items: [],
      move: vi.fn(),
      pageContainers: [],
      rawFolders: [{ children: [], id: 'folder-1', title: 'My Folder' }],
      remove: vi.fn(),
      searchTerm: '',
      setSearchTerm: vi.fn(),
      update: vi.fn(),
      updateLayout: vi.fn(),
    });

    render(<SearchBar />);
    const input = screen.getByTestId('search-input') as HTMLInputElement;
    expect(input.placeholder).toContain('My Folder');
  });

  it('renders "Uncategorized" placeholder when on Uncategorized page', () => {
    mockUseBookmarks.mockReturnValue({
      counts: { folders: 0, total: 0, uncategorized: 0 },
      create: vi.fn(),
      currentPage: 'Uncategorized',
      error: null,
      isLoading: false,
      items: [],
      move: vi.fn(),
      pageContainers: [],
      rawFolders: [],
      remove: vi.fn(),
      searchTerm: '',
      setSearchTerm: vi.fn(),
      update: vi.fn(),
      updateLayout: vi.fn(),
    });

    render(<SearchBar />);
    const input = screen.getByTestId('search-input') as HTMLInputElement;
    expect(input.placeholder).toBe('Search within "Uncategorized"');
  });

  it('renders currentPage title when folder is not found', () => {
    mockUseBookmarks.mockReturnValue({
      counts: { folders: 0, total: 0, uncategorized: 0 },
      create: vi.fn(),
      currentPage: 'unknown-folder',
      error: null,
      isLoading: false,
      items: [],
      move: vi.fn(),
      pageContainers: [],
      rawFolders: [],
      remove: vi.fn(),
      searchTerm: '',
      setSearchTerm: vi.fn(),
      update: vi.fn(),
      updateLayout: vi.fn(),
    });

    render(<SearchBar />);
    const input = screen.getByTestId('search-input') as HTMLInputElement;
    expect(input.placeholder).toBe('Search within "unknown-folder"');
  });
});
