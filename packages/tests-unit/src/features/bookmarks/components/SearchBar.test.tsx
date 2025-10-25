import { vi } from 'vitest';

import { SearchBar } from '@/features/search/containers/SearchBar';
import { fireEvent, render, screen } from '~test/test-utils';

vi.mock('@/features/bookmarks/hooks/useBookmarks', () => ({
  useBookmarks: vi.fn(),
}));

describe('SearchBar', () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { useBookmarks } = await import('@/features/bookmarks/hooks/useBookmarks');
    vi.mocked(useBookmarks).mockReturnValue({
      currentPage: 'All',
      searchTerm: '',
      setSearchTerm: vi.fn(),
      rawFolders: [],
      create: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
      move: vi.fn(),
      updateLayout: vi.fn(),
      isLoading: false,
      error: null,
      items: [],
      counts: { total: 0, folders: 0, uncategorized: 0 },
      pageContainers: [],
    });
  });

  it('renders with placeholder for "All" page', () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText(/Search/)).toBeInTheDocument();
  });

  it('updates search term on input change', async () => {
    const mockSetSearchTerm = vi.fn();
    const { useBookmarks } = await import('@/features/bookmarks/hooks/useBookmarks');
    vi.mocked(useBookmarks).mockReturnValue({
      currentPage: 'All',
      searchTerm: '',
      setSearchTerm: mockSetSearchTerm,
      rawFolders: [],
      create: vi.fn(),
      update: vi.fn(),
      remove: vi.fn(),
      move: vi.fn(),
      updateLayout: vi.fn(),
      isLoading: false,
      error: null,
      items: [],
      counts: { total: 0, folders: 0, uncategorized: 0 },
      pageContainers: [],
    });

    render(<SearchBar />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(mockSetSearchTerm).toHaveBeenCalledWith('test');
  });
});
