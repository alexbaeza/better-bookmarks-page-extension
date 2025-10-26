import { act } from 'react';
import { vi } from 'vitest';
import { viewModeAtom } from '@/app/providers/atoms';
import { BookmarkItem } from '@/features/bookmarks/components/items/BookmarkItem';
import { BookmarkDisplayMode } from '@/shared/types/ui';
import { AllProviders, fireEvent, render, screen, waitFor } from '~test/test-utils';

vi.mock('@/features/bookmarks/hooks/useBookmarks', () => ({
  useBookmarks: vi.fn(() => ({
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
  })),
}));

const mockOpenFolderModal = vi.fn();
const mockOpenEditModal = vi.fn();
const _mockOpenCreateModal = vi.fn();
const mockRemove = vi.fn();

vi.mock('@/features/bookmarks/hooks/useBookmarkModals', () => ({
  useBookmarkModals: vi.fn(() => ({
    openFolderModal: mockOpenFolderModal,
    openEditModal: mockOpenEditModal,
    openCreateModal: _mockOpenCreateModal,
    remove: mockRemove,
  })),
}));

describe('BookmarkItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should render BookmarkListItem when view mode is list and type is item', () => {
    const mockItem = {
      id: '1',
      title: 'Test Bookmark',
      url: 'https://www.example.com',
    };

    render(
      <AllProviders>
        <BookmarkItem dataTestId="bookmark-list-item" item={mockItem} />
      </AllProviders>,
      {
        initialValues: [[viewModeAtom, BookmarkDisplayMode.List]],
      }
    );
    expect(screen.getByTestId('bookmark-list-item')).toBeInTheDocument();
    expect(screen.queryByTestId('bookmark-grid-item')).toBeNull();
  });

  it('should render BookmarkGridItem when view mode is grid and type is item', () => {
    const mockItem = {
      id: '1',
      title: 'Test Bookmark',
      url: 'https://www.example.com',
    };

    render(
      <AllProviders>
        <BookmarkItem dataTestId="bookmark-grid-item" item={mockItem} />
      </AllProviders>,
      {
        initialValues: [[viewModeAtom, BookmarkDisplayMode.Grid]],
      }
    );
    expect(screen.getByTestId('bookmark-grid-item')).toBeInTheDocument();
    expect(screen.queryByTestId('bookmark-list-item')).toBeNull();
  });

  it('should render BookmarkFolderListItem when view mode is list and type is folder', () => {
    const mockItem = {
      children: [],
      id: '1',
      title: 'Test Folder',
    };

    render(
      <AllProviders>
        <BookmarkItem dataTestId="bookmark-folder-list-item" item={mockItem} onFolderClick={vi.fn()} />
      </AllProviders>,
      {
        initialValues: [[viewModeAtom, BookmarkDisplayMode.List]],
      }
    );
    expect(screen.getByTestId('bookmark-folder-list-item')).toBeInTheDocument();
    expect(screen.queryByTestId('bookmark-folder-grid-item')).toBeNull();
  });

  it('should render BookmarkFolderGridItem when view mode is grid and type is folder', () => {
    const mockItem = {
      children: [],
      id: '1',
      title: 'Test Folder',
    };

    render(
      <AllProviders>
        <BookmarkItem dataTestId="bookmark-folder-grid-item" item={mockItem} onFolderClick={vi.fn()} />
      </AllProviders>,
      {
        initialValues: [[viewModeAtom, BookmarkDisplayMode.Grid]],
      }
    );
    expect(screen.getByTestId('bookmark-folder-grid-item')).toBeInTheDocument();
    expect(screen.queryByTestId('bookmark-folder-list-item')).toBeNull();
  });

  it('should call onClickAction when BookmarkFolderListItem is clicked', () => {
    const mockOnClick = vi.fn();
    const mockItem = {
      children: [],
      id: '1',
      title: 'Test Folder',
    };

    render(
      <AllProviders>
        <BookmarkItem dataTestId="bookmark-folder-list-item" item={mockItem} onFolderClick={mockOnClick} />
      </AllProviders>,
      {
        initialValues: [[viewModeAtom, BookmarkDisplayMode.List]],
      }
    );
    const button = screen.getByTestId('bookmark-folder-list-item').querySelector('button:not([data-testid="drag-handle-button"])');
    void act(() => {
      button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should call onClickAction when BookmarkFolderGridItem is clicked', () => {
    const mockOnClick = vi.fn();
    const mockItem = {
      children: [],
      id: '1',
      title: 'Test Folder',
    };

    render(
      <AllProviders>
        <BookmarkItem dataTestId="bookmark-folder-grid-item" item={mockItem} onFolderClick={mockOnClick} />
      </AllProviders>,
      {
        initialValues: [[viewModeAtom, BookmarkDisplayMode.Grid]],
      }
    );

    const folderButton = screen.getByTestId('grid-item-main-button');
    fireEvent.click(folderButton);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should handle Edit action by calling openEditModal', async () => {
    const mockItem = {
      children: [],
      id: '1',
      title: 'Test Folder',
    };

    render(
      <AllProviders>
        <BookmarkItem dataTestId="bookmark-folder-grid-item" item={mockItem} />
      </AllProviders>,
      {
        initialValues: [[viewModeAtom, BookmarkDisplayMode.Grid]],
      }
    );

    const optionsButton = screen.getByTestId('item-options-button');
    fireEvent.click(optionsButton);

    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });

    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    expect(mockOpenEditModal).toHaveBeenCalledWith(mockItem);
  });

  it('should handle Delete action by calling remove', async () => {
    const mockItem = {
      children: [],
      id: '1',
      title: 'Test Folder',
    };

    render(
      <AllProviders>
        <BookmarkItem dataTestId="bookmark-folder-grid-item" item={mockItem} />
      </AllProviders>,
      {
        initialValues: [[viewModeAtom, BookmarkDisplayMode.Grid]],
      }
    );

    const optionsButton = screen.getByTestId('item-options-button');
    fireEvent.click(optionsButton);

    await waitFor(() => {
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText('Confirm delete?')).toBeInTheDocument();
    });

    const confirmButton = screen.getByTestId('bookmark-delete-confirm-button');
    fireEvent.click(confirmButton);

    expect(mockRemove).toHaveBeenCalledWith('1');
  });

  it('should use onAddChild prop when provided for folder with ID', () => {
    const mockOnAddChild = vi.fn();
    const mockItem = {
      children: [],
      id: 'folder-1',
      title: 'Test Folder',
    };

    render(
      <AllProviders>
        <BookmarkItem dataTestId="bookmark-folder-grid-item" item={mockItem} onAddChild={mockOnAddChild} />
      </AllProviders>,
      {
        initialValues: [[viewModeAtom, BookmarkDisplayMode.Grid]],
      }
    );

    const folderButton = screen.getByTestId('grid-item-main-button');
    expect(folderButton).toBeInTheDocument();
    expect(screen.getByTestId('bookmark-folder-grid-item')).toBeInTheDocument();
  });

  it('should handle folder without ID in handleAddChild', () => {
    const mockItem = {
      children: [],
      id: '',
      title: 'Test Folder',
    };

    render(
      <AllProviders>
        <BookmarkItem dataTestId="bookmark-folder-grid-item" item={mockItem} />
      </AllProviders>,
      {
        initialValues: [[viewModeAtom, BookmarkDisplayMode.Grid]],
      }
    );

    expect(screen.getByTestId('bookmark-folder-grid-item')).toBeInTheDocument();
  });

  it('should call openCreateModal through handleAddChild when onAddChild is not provided', () => {
    const mockItem = {
      children: [],
      id: 'folder-1',
      title: 'Test Folder',
    };

    const { container } = render(
      <AllProviders>
        <BookmarkItem dataTestId="bookmark-folder-grid-item" item={mockItem} />
      </AllProviders>,
      {
        initialValues: [[viewModeAtom, BookmarkDisplayMode.Grid]],
      }
    );

    const folderButton = container.querySelector('[data-testid="bookmark-folder-grid-item"]') as HTMLElement;
    expect(folderButton).toBeInTheDocument();
  });

  it('should call openFolderModal when folder is clicked without onFolderClick prop', () => {
    const mockItem = {
      children: [],
      id: '1',
      title: 'Test Folder',
    };

    render(
      <AllProviders>
        <BookmarkItem dataTestId="bookmark-folder-list-item" item={mockItem} />
      </AllProviders>,
      {
        initialValues: [[viewModeAtom, BookmarkDisplayMode.List]],
      }
    );

    const button = screen.getByTestId('bookmark-folder-list-item').querySelector('button:not([data-testid="drag-handle-button"])');
    void act(() => {
      button?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(mockOpenFolderModal).toHaveBeenCalledWith(mockItem);
  });
});
