import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SearchBar } from '@/features/search/containers/SearchBar';

// Mock dependencies
const mockSetSearchTerm = vi.fn();
const mockFindFolderById = vi.fn();

vi.mock('@/features/bookmarks/hooks/useBookmarks', () => ({
  useBookmarks: () => ({
    currentPage: 'All',
    searchTerm: '',
    setSearchTerm: mockSetSearchTerm,
    rawFolders: [],
  }),
}));

vi.mock('@/features/bookmarks/lib/browser/utils/bookmark-tree-utils', () => ({
  findFolderById: (...args: any[]) => mockFindFolderById(...args),
}));

vi.mock('@/shared/ui/SearchInput', () => ({
  SearchInput: ({ placeholder, value, onChange, 'data-testid': dataTestId }: any) => (
    <input data-testid={dataTestId} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} type="text" value={value} />
  ),
}));

describe('SearchBar', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<SearchBar />);
    expect(screen.getByTestId('search-input')).toBeInTheDocument();
  });

  it('should display placeholder for "All" page', () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText('Search "All" items…')).toBeInTheDocument();
  });

  it('should handle search input changes', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    const input = screen.getByTestId('search-input');
    await user.type(input, 'test query');

    expect(mockSetSearchTerm).toHaveBeenCalled();
  });

  it('should display current search term', () => {
    const { unmount } = render(<SearchBar />);
    const input = screen.getByTestId('search-input');
    expect(input).toHaveValue('');
    unmount();
  });

  it('should render search input with correct attributes', () => {
    render(<SearchBar />);

    const input = screen.getByTestId('search-input');
    expect(input).toHaveAttribute('type', 'text');
    expect(input).toHaveAttribute('placeholder');
  });
});
