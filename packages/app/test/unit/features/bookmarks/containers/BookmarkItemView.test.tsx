import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BookmarkItemView } from '@/features/bookmarks/containers/BookmarkItemView';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { BookmarkDisplayMode } from '@/shared/types/ui';

// Mock dependencies
const mockOpenFolderModal = vi.fn();
const mockOpenEditModal = vi.fn();
const mockRemove = vi.fn();
let mockViewMode = BookmarkDisplayMode.Grid;

vi.mock('jotai', async (importOriginal) => {
  const actual = await importOriginal<typeof import('jotai')>();
  return {
    ...actual,
    useAtomValue: () => mockViewMode,
  };
});

vi.mock('@/features/bookmarks/hooks/useBookmarkModals', () => ({
  useBookmarkModals: () => ({
    openFolderModal: mockOpenFolderModal,
    openEditModal: mockOpenEditModal,
    remove: mockRemove,
  }),
}));

vi.mock('@/features/bookmarks/components/items/BookmarkFolderGridItem', () => ({
  BookmarkFolderGridItem: ({ onClick, title }: any) => (
    <div data-testid="folder-grid-item" onClick={onClick} onKeyDown={onClick} role="button" tabIndex={0}>
      {title}
    </div>
  ),
}));

vi.mock('@/features/bookmarks/components/items/grid/BookmarkGridItem', () => ({
  BookmarkGridItem: ({ title, onEdit, onDelete, dataTestId }: any) => (
    <div data-testid={dataTestId || 'bookmark-grid-item'}>
      <span>{title}</span>
      <button onClick={onEdit} type="button">
        Edit
      </button>
      <button onClick={onDelete} type="button">
        Delete
      </button>
    </div>
  ),
}));

vi.mock('@/features/bookmarks/components/items/list/BookmarkListItem', () => ({
  BookmarkListItem: ({ title, onClick, onEdit, onDelete, dataTestId }: any) => (
    <div data-testid={dataTestId || 'bookmark-list-item'} onClick={onClick} onKeyDown={onClick} role="button" tabIndex={0}>
      <span>{title}</span>
      <button onClick={onEdit} type="button">
        Edit
      </button>
      <button onClick={onDelete} type="button">
        Delete
      </button>
    </div>
  ),
}));

describe('BookmarkItemView', () => {
  const mockBookmark: IBookmarkItem = {
    id: 'bookmark1',
    title: 'Test Bookmark',
    url: 'https://example.com',
  };

  const mockFolder: IBookmarkItem = {
    id: 'folder1',
    title: 'Test Folder',
    children: [],
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockViewMode = BookmarkDisplayMode.Grid;
    mockRemove.mockResolvedValue(undefined);
  });

  describe('Grid View', () => {
    it('should render bookmark in grid mode', () => {
      render(<BookmarkItemView item={mockBookmark} />);
      expect(screen.getByTestId('bookmark-grid-item')).toBeInTheDocument();
    });

    it('should render folder in grid mode', () => {
      render(<BookmarkItemView item={mockFolder} />);
      expect(screen.getByTestId('folder-grid-item')).toBeInTheDocument();
    });

    it('should handle folder click in grid mode', async () => {
      const user = userEvent.setup();
      render(<BookmarkItemView item={mockFolder} />);

      await user.click(screen.getByTestId('folder-grid-item'));
      expect(mockOpenFolderModal).toHaveBeenCalledWith(mockFolder);
    });

    it('should handle custom folder click handler', async () => {
      const customHandler = vi.fn();
      const user = userEvent.setup();
      render(<BookmarkItemView item={mockFolder} onFolderClick={customHandler} />);

      await user.click(screen.getByTestId('folder-grid-item'));
      expect(customHandler).toHaveBeenCalledWith(mockFolder);
      expect(mockOpenFolderModal).not.toHaveBeenCalled();
    });
  });

  describe('List View', () => {
    beforeEach(() => {
      mockViewMode = BookmarkDisplayMode.List;
    });

    it('should render bookmark in list mode', () => {
      render(<BookmarkItemView item={mockBookmark} />);
      expect(screen.getByTestId('bookmark-list-item')).toBeInTheDocument();
    });

    it('should render folder in list mode', () => {
      render(<BookmarkItemView item={mockFolder} />);
      expect(screen.getByTestId('bookmark-list-item')).toBeInTheDocument();
    });

    it('should handle folder click in list mode', async () => {
      const user = userEvent.setup();
      render(<BookmarkItemView item={mockFolder} />);

      await user.click(screen.getByTestId('bookmark-list-item'));
      expect(mockOpenFolderModal).toHaveBeenCalledWith(mockFolder);
    });
  });

  describe('Edit and Delete', () => {
    it('should handle edit action', async () => {
      const user = userEvent.setup();
      render(<BookmarkItemView dataTestId="test-item" item={mockBookmark} />);

      await user.click(screen.getByText('Edit'));
      expect(mockOpenEditModal).toHaveBeenCalledWith(mockBookmark);
    });

    it('should handle delete action', async () => {
      const user = userEvent.setup();
      render(<BookmarkItemView dataTestId="test-item" item={mockBookmark} />);

      await user.click(screen.getByText('Delete'));
      expect(mockRemove).toHaveBeenCalledWith('bookmark1');
    });
  });

  describe('Props', () => {
    it('should pass dataTestId prop', () => {
      render(<BookmarkItemView dataTestId="custom-test-id" item={mockBookmark} />);
      expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
    });

    it('should pass dragHandleProps', () => {
      const dragHandleProps = { 'data-drag-handle': 'true' };
      render(<BookmarkItemView dragHandleProps={dragHandleProps} item={mockBookmark} />);
      expect(screen.getByTestId('bookmark-grid-item')).toBeInTheDocument();
    });
  });
});
