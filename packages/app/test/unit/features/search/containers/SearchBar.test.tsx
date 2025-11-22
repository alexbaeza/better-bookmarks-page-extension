import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { when } from 'vitest-when';
import { useBookmarks } from '@/features/bookmarks/hooks/useBookmarks';
import { findFolderById } from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';
import { SearchBar } from '@/features/search/containers/SearchBar';

const mockSetSearchTerm = vi.fn();
const mockFindFolderById = vi.fn();

vi.mock('@/features/bookmarks/hooks/useBookmarks', () => ({
  useBookmarks: vi.fn(),
}));

vi.mock('@/features/bookmarks/lib/browser/utils/bookmark-tree-utils', () => ({
  findFolderById: vi.fn(),
}));

vi.mock('@/shared/ui/SearchInput', () => ({
  SearchInput: React.forwardRef(({ placeholder, value, onChange, 'data-testid': dataTestId }: any, ref: any) => (
    <input
      data-testid={dataTestId}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      ref={ref}
      type="text"
      value={value}
    />
  )),
}));

describe('SearchBar', () => {
  beforeEach(() => {
    mockSetSearchTerm.mockClear();
    mockFindFolderById.mockClear();

    const mockUseBookmarks = vi.mocked(useBookmarks);
    when(mockUseBookmarks)
      .calledWith()
      .thenReturn({
        currentPage: 'All',
        searchTerm: '',
        setSearchTerm: mockSetSearchTerm,
        rawFolders: [],
      } as ReturnType<typeof useBookmarks>);

    const mockFindFolderByIdFn = vi.mocked(findFolderById);
    when(mockFindFolderByIdFn).calledWith(expect.anything(), expect.anything()).thenReturn(undefined);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should display placeholder for "All" page', () => {
    render(<SearchBar />);
    expect(screen.getByPlaceholderText('Search within "All Items"')).toBeInTheDocument();
  });

  it('should handle search input changes', async () => {
    const user = userEvent.setup();
    render(<SearchBar />);

    const input = screen.getByTestId('search-input');
    await user.type(input, 'test query');

    await waitFor(() => {
      expect(mockSetSearchTerm).toHaveBeenCalledTimes(1);
    });
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

  it('should focus input on Cmd+Shift+K (Mac)', () => {
    render(<SearchBar />);
    const input = screen.getByTestId('search-input') as HTMLInputElement;
    const focusSpy = vi.spyOn(input, 'focus');
    const preventDefaultSpy = vi.fn();

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      shiftKey: true,
      metaKey: true,
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(event, 'preventDefault', { value: preventDefaultSpy });
    document.dispatchEvent(event);

    expect(focusSpy).toHaveBeenCalled();
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should focus input on Ctrl+Shift+K (Windows/Linux)', () => {
    render(<SearchBar />);
    const input = screen.getByTestId('search-input') as HTMLInputElement;
    const focusSpy = vi.spyOn(input, 'focus');
    const preventDefaultSpy = vi.fn();

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      shiftKey: true,
      ctrlKey: true,
      bubbles: true,
      cancelable: true,
    });
    Object.defineProperty(event, 'preventDefault', { value: preventDefaultSpy });
    document.dispatchEvent(event);

    expect(focusSpy).toHaveBeenCalled();
    expect(preventDefaultSpy).toHaveBeenCalled();
  });

  it('should not focus input when user is typing in an input', () => {
    render(<SearchBar />);
    const input = screen.getByTestId('search-input') as HTMLInputElement;
    const focusSpy = vi.spyOn(input, 'focus');

    const inputEvent = new KeyboardEvent('keydown', {
      key: 'k',
      shiftKey: true,
      metaKey: true,
      bubbles: true,
    });
    Object.defineProperty(inputEvent, 'target', { value: input, enumerable: true });
    document.dispatchEvent(inputEvent);

    expect(focusSpy).toHaveBeenCalledTimes(0);
  });

  it('should not focus input when user is typing in a textarea', () => {
    render(<SearchBar />);
    const input = screen.getByTestId('search-input') as HTMLInputElement;
    const focusSpy = vi.spyOn(input, 'focus');
    const textarea = document.createElement('textarea');

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      shiftKey: true,
      metaKey: true,
      bubbles: true,
    });
    Object.defineProperty(event, 'target', { value: textarea, enumerable: true });
    document.dispatchEvent(event);

    expect(focusSpy).toHaveBeenCalledTimes(0);
  });

  it('should not focus input when key is not K', () => {
    render(<SearchBar />);
    const input = screen.getByTestId('search-input') as HTMLInputElement;
    const focusSpy = vi.spyOn(input, 'focus');

    const event = new KeyboardEvent('keydown', {
      key: 'j',
      shiftKey: true,
      metaKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);

    expect(focusSpy).toHaveBeenCalledTimes(0);
  });

  it('should not focus input when Shift is not pressed', () => {
    render(<SearchBar />);
    const input = screen.getByTestId('search-input') as HTMLInputElement;
    const focusSpy = vi.spyOn(input, 'focus');

    const event = new KeyboardEvent('keydown', {
      key: 'k',
      metaKey: true,
      bubbles: true,
    });
    document.dispatchEvent(event);

    expect(focusSpy).toHaveBeenCalledTimes(0);
  });

  it('should display placeholder for folder page', () => {
    const mockUseBookmarks = vi.mocked(useBookmarks);
    const mockRawFolders = [{ id: 'folder-1', title: 'Test Folder' }];
    when(mockUseBookmarks)
      .calledWith()
      .thenReturn({
        currentPage: 'folder-1',
        searchTerm: '',
        setSearchTerm: mockSetSearchTerm,
        rawFolders: mockRawFolders,
      } as ReturnType<typeof useBookmarks>);

    const mockFindFolderByIdFn = vi.mocked(findFolderById);
    when(mockFindFolderByIdFn)
      .calledWith(mockRawFolders, 'folder-1')
      .thenReturn({ id: 'folder-1', title: 'Test Folder' } as any);

    render(<SearchBar />);
    expect(screen.getByPlaceholderText('Search within "Test Folder"')).toBeInTheDocument();
  });

  it('should display placeholder for Uncategorized page', () => {
    const mockUseBookmarks = vi.mocked(useBookmarks);
    when(mockUseBookmarks)
      .calledWith()
      .thenReturn({
        currentPage: 'Uncategorized',
        searchTerm: '',
        setSearchTerm: mockSetSearchTerm,
        rawFolders: [],
      } as ReturnType<typeof useBookmarks>);

    render(<SearchBar />);
    expect(screen.getByPlaceholderText('Search within "Uncategorized"')).toBeInTheDocument();
  });
});
