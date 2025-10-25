import * as jotai from 'jotai';
import { act } from 'react-dom/test-utils';
import { vi } from 'vitest';
import { when } from 'vitest-when';

import { viewModeAtom } from '@/app/providers/atoms';
import { BookmarkItem } from '@/features/bookmarks/components/items/BookmarkItem';
import { BookmarkDisplayMode } from '@/shared/types/ui';
import { AllProviders, fireEvent, render, screen } from '~test/test-utils';

vi.mock('../../../../../src/hooks/useBookmarks', () => ({
  useBookmarks: vi.fn(() => ({
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
  })),
}));

describe('BookmarkItem', () => {
  let spy: vi.SpyInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    spy = vi.spyOn(jotai, 'useAtomValue');
    when(spy)
      .calledWith(viewModeAtom)
      .thenReturn(['background-image.png', vi.fn() as never]);
  });
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should render BookmarkListItem when view mode is list and type is item', () => {
    when(spy).calledWith(viewModeAtom).thenReturn(BookmarkDisplayMode.List);

    const mockItem = {
      id: '1',
      title: 'Test Bookmark',
      url: 'https://www.example.com',
    };

    render(
      <AllProviders>
        <BookmarkItem dataTestId="bookmark-list-item" item={mockItem} />
      </AllProviders>
    );
    expect(screen.getByTestId('bookmark-list-item')).toBeInTheDocument();
    expect(screen.queryByTestId('bookmark-grid-item')).toBeNull();
  });

  it('should render BookmarkGridItem when view mode is grid and type is item', () => {
    when(spy).calledWith(viewModeAtom).thenReturn(BookmarkDisplayMode.Grid);

    const mockItem = {
      id: '1',
      title: 'Test Bookmark',
      url: 'https://www.example.com',
    };

    render(
      <AllProviders>
        <BookmarkItem dataTestId="bookmark-grid-item" item={mockItem} />
      </AllProviders>
    );
    expect(screen.getByTestId('bookmark-grid-item')).toBeInTheDocument();
    expect(screen.queryByTestId('bookmark-list-item')).toBeNull();
  });

  it('should render BookmarkFolderListItem when view mode is list and type is folder', () => {
    when(spy).calledWith(viewModeAtom).thenReturn(BookmarkDisplayMode.List);

    const mockItem = {
      id: '1',
      title: 'Test Folder',
      children: [],
    };

    render(
      <AllProviders>
        <BookmarkItem dataTestId="bookmark-folder-list-item" item={mockItem} onFolderClick={vi.fn()} />
      </AllProviders>
    );
    expect(screen.getByTestId('bookmark-folder-list-item')).toBeInTheDocument();
    expect(screen.queryByTestId('bookmark-folder-grid-item')).toBeNull();
  });

  it('should render BookmarkFolderGridItem when view mode is grid and type is folder', () => {
    when(spy).calledWith(viewModeAtom).thenReturn(BookmarkDisplayMode.Grid);

    const mockItem = {
      id: '1',
      title: 'Test Folder',
      children: [],
    };

    render(
      <AllProviders>
        <BookmarkItem dataTestId="bookmark-folder-grid-item" item={mockItem} onFolderClick={vi.fn()} />
      </AllProviders>
    );
    expect(screen.getByTestId('bookmark-folder-grid-item')).toBeInTheDocument();
    expect(screen.queryByTestId('bookmark-folder-list-item')).toBeNull();
  });

  it('should call onClickAction when BookmarkFolderListItem is clicked', () => {
    when(spy).calledWith(viewModeAtom).thenReturn(BookmarkDisplayMode.List);

    const mockOnClick = vi.fn();
    const mockItem = {
      id: '1',
      title: 'Test Folder',
      children: [],
    };

    render(
      <AllProviders>
        <BookmarkItem dataTestId="bookmark-folder-list-item" item={mockItem} onFolderClick={mockOnClick} />
      </AllProviders>
    );
    const button = screen.getByTestId('bookmark-folder-list-item').querySelector('button:not([data-testid="drag-handle-button"])');
    act(() => {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should call onClickAction when BookmarkFolderGridItem is clicked', () => {
    when(spy).calledWith(viewModeAtom).thenReturn(BookmarkDisplayMode.Grid);
    const mockOnClick = vi.fn();
    const mockItem = {
      id: '1',
      title: 'Test Folder',
      children: [],
    };

    render(
      <AllProviders>
        <BookmarkItem dataTestId="bookmark-folder-grid-item" item={mockItem} onFolderClick={mockOnClick} />
      </AllProviders>
    );

    // Click the main clickable area (not the options button)
    const folderButton = screen.getByRole('button', { name: /test folder/i });
    fireEvent.click(folderButton);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
