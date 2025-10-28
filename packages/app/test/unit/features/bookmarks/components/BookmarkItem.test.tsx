import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BookmarkItem } from '@/features/bookmarks/components/BookmarkItem';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

// Mock dependencies
vi.mock('@/features/bookmarks/hooks/useBookmarkDrag', () => ({
  useBookmarkDrag: () => ({
    dragProps: { 'data-draggable': 'true' },
    dragHandleProps: { 'data-drag-handle': 'true' },
  }),
}));

vi.mock('@/features/bookmarks/hooks/useBookmarkIcon', () => ({
  useBookmarkIcon: () => <span data-testid="mock-icon">Icon</span>,
}));

vi.mock('@/features/bookmarks/hooks/useBookmarks', () => ({
  useBookmarks: () => ({
    searchTerm: 'test',
  }),
}));

vi.mock('@/features/bookmarks/lib/highlighter', () => ({
  highlighter: (text: string, _searchTerm: string) => text,
}));

describe('BookmarkItem', () => {
  const mockItem: IBookmarkItem = {
    id: '1',
    title: 'Test Bookmark',
    url: 'https://example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Root component', () => {
    it('should render without crashing', () => {
      render(
        <BookmarkItem dataTestId="test-bookmark" item={mockItem}>
          <div>Child content</div>
        </BookmarkItem>
      );

      expect(screen.getByTestId('test-bookmark')).toBeInTheDocument();
    });

    it('should render children', () => {
      render(
        <BookmarkItem item={mockItem}>
          <div data-testid="test-child">Test Content</div>
        </BookmarkItem>
      );

      expect(screen.getByTestId('test-child')).toBeInTheDocument();
    });

    it('should apply drag props', () => {
      render(
        <BookmarkItem dataTestId="draggable-item" item={mockItem}>
          Content
        </BookmarkItem>
      );

      const element = screen.getByTestId('draggable-item');
      expect(element).toHaveAttribute('data-draggable', 'true');
    });
  });

  describe('Icon component', () => {
    it('should render icon', () => {
      render(<BookmarkItem.Icon item={mockItem} />);
      expect(screen.getByTestId('favicon')).toBeInTheDocument();
      expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
    });

    it('should render with default size', () => {
      render(<BookmarkItem.Icon item={mockItem} />);
      expect(screen.getByTestId('favicon')).toBeInTheDocument();
    });

    it('should render with small size', () => {
      render(<BookmarkItem.Icon item={mockItem} size="sm" />);
      expect(screen.getByTestId('favicon')).toBeInTheDocument();
    });

    it('should render with large size', () => {
      render(<BookmarkItem.Icon item={mockItem} size="lg" />);
      expect(screen.getByTestId('favicon')).toBeInTheDocument();
    });
  });

  describe('Title component', () => {
    it('should render title with highlighting by default', () => {
      const { container } = render(<BookmarkItem.Title item={mockItem} />);
      expect(container).toHaveTextContent('Test Bookmark');
    });

    it('should render title without highlighting when disabled', () => {
      const { container } = render(<BookmarkItem.Title highlighted={false} item={mockItem} />);
      expect(container).toHaveTextContent('Test Bookmark');
    });

    it('should render title with highlighting when enabled', () => {
      const { container } = render(<BookmarkItem.Title highlighted={true} item={mockItem} />);
      expect(container).toHaveTextContent('Test Bookmark');
    });
  });

  describe('Actions component', () => {
    it('should render without buttons when no handlers provided', () => {
      const { container } = render(<BookmarkItem.Actions />);
      expect(container.querySelector('button')).not.toBeInTheDocument();
    });

    it('should render edit button when onEdit provided', () => {
      const onEdit = vi.fn();
      render(<BookmarkItem.Actions onEdit={onEdit} />);

      const editButton = screen.getByLabelText('Edit bookmark');
      expect(editButton).toBeInTheDocument();
    });

    it('should render delete button when onDelete provided', () => {
      const onDelete = vi.fn();
      render(<BookmarkItem.Actions onDelete={onDelete} />);

      const deleteButton = screen.getByLabelText('Delete bookmark');
      expect(deleteButton).toBeInTheDocument();
    });

    it('should call onEdit when edit button clicked', async () => {
      const user = userEvent.setup();
      const onEdit = vi.fn();

      render(<BookmarkItem.Actions onEdit={onEdit} />);

      await user.click(screen.getByLabelText('Edit bookmark'));
      expect(onEdit).toHaveBeenCalledTimes(1);
    });

    it('should call onDelete when delete button clicked', async () => {
      const user = userEvent.setup();
      const onDelete = vi.fn();

      render(<BookmarkItem.Actions onDelete={onDelete} />);

      await user.click(screen.getByLabelText('Delete bookmark'));
      expect(onDelete).toHaveBeenCalledTimes(1);
    });

    it('should render both buttons when both handlers provided', () => {
      render(<BookmarkItem.Actions onDelete={vi.fn()} onEdit={vi.fn()} />);

      expect(screen.getByLabelText('Edit bookmark')).toBeInTheDocument();
      expect(screen.getByLabelText('Delete bookmark')).toBeInTheDocument();
    });
  });

  describe('DragHandle component', () => {
    it('should render drag handle', () => {
      render(<BookmarkItem.DragHandle item={mockItem} />);

      const dragHandle = screen.getByRole('button');
      expect(dragHandle).toBeInTheDocument();
      expect(dragHandle).toHaveClass('cursor-grab');
    });

    it('should apply drag handle props', () => {
      render(<BookmarkItem.DragHandle item={mockItem} />);

      const dragHandle = screen.getByRole('button');
      expect(dragHandle).toHaveAttribute('data-drag-handle', 'true');
    });

    it('should be keyboard accessible', () => {
      render(<BookmarkItem.DragHandle item={mockItem} />);

      const dragHandle = screen.getByRole('button');
      expect(dragHandle).toHaveAttribute('tabIndex', '0');
    });

    it('should render drag icon', () => {
      const { container } = render(<BookmarkItem.DragHandle item={mockItem} />);
      expect(container).toHaveTextContent('⋮⋮');
    });
  });

  describe('Compound component pattern', () => {
    it('should have all sub-components attached', () => {
      expect(BookmarkItem.Icon).toBeDefined();
      expect(BookmarkItem.Title).toBeDefined();
      expect(BookmarkItem.Actions).toBeDefined();
      expect(BookmarkItem.DragHandle).toBeDefined();
    });

    it('should render complete bookmark with all components', () => {
      render(
        <BookmarkItem dataTestId="complete-bookmark" item={mockItem}>
          <BookmarkItem.Icon item={mockItem} />
          <BookmarkItem.Title item={mockItem} />
          <BookmarkItem.Actions onDelete={vi.fn()} onEdit={vi.fn()} />
          <BookmarkItem.DragHandle item={mockItem} />
        </BookmarkItem>
      );

      expect(screen.getByTestId('complete-bookmark')).toBeInTheDocument();
      expect(screen.getByTestId('favicon')).toBeInTheDocument();
      expect(screen.getByLabelText('Edit bookmark')).toBeInTheDocument();
      expect(screen.getByLabelText('Delete bookmark')).toBeInTheDocument();
    });
  });
});
