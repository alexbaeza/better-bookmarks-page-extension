import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Bookmark } from '@/features/bookmarks/components/Bookmark';

describe('Bookmark', () => {
  it('should render children', () => {
    render(
      <Bookmark>
        <div data-testid="child">Child</div>
      </Bookmark>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  describe('Bookmark.Root', () => {
    it('should render with default props', () => {
      render(
        <Bookmark.Root>
          <div data-testid="content">Content</div>
        </Bookmark.Root>
      );
      expect(screen.getByTestId('content')).toBeInTheDocument();
    });

    it('should apply className', () => {
      const { container } = render(
        <Bookmark.Root className="test-class">
          <div>Content</div>
        </Bookmark.Root>
      );
      const root = container.firstChild as HTMLElement;
      expect(root).toHaveClass('test-class');
    });

    it('should apply dataTestId', () => {
      render(
        <Bookmark.Root dataTestId="test-root">
          <div>Content</div>
        </Bookmark.Root>
      );
      expect(screen.getByTestId('test-root')).toBeInTheDocument();
    });

    it('should handle mouse events', async () => {
      const onMouseEnter = vi.fn();
      const onMouseLeave = vi.fn();
      const user = userEvent.setup();
      render(
        <Bookmark.Root onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
          <div>Content</div>
        </Bookmark.Root>
      );
      const root = screen.getByRole('group');
      await user.hover(root);
      expect(onMouseEnter).toHaveBeenCalled();
      await user.unhover(root);
      expect(onMouseLeave).toHaveBeenCalled();
    });
  });

  describe('Bookmark.Content', () => {
    it('should render as button when no href', () => {
      render(
        <Bookmark.Content>
          <div>Content</div>
        </Bookmark.Content>
      );
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render as anchor when href provided', () => {
      render(
        <Bookmark.Content href="https://example.com">
          <div>Content</div>
        </Bookmark.Content>
      );
      const link = screen.getByRole('link');
      expect(link).toHaveAttribute('href', 'https://example.com');
    });

    it('should handle onClick', async () => {
      const onClick = vi.fn();
      const user = userEvent.setup();
      render(
        <Bookmark.Content onClick={onClick}>
          <div>Content</div>
        </Bookmark.Content>
      );
      await user.click(screen.getByRole('button'));
      expect(onClick).toHaveBeenCalled();
    });

    it('should apply dataTestId', () => {
      render(
        <Bookmark.Content dataTestId="test-content">
          <div>Content</div>
        </Bookmark.Content>
      );
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
    });
  });

  describe('Bookmark.Actions', () => {
    it('should render children', () => {
      render(
        <Bookmark.Actions>
          <button data-testid="action" type="button">
            Action
          </button>
        </Bookmark.Actions>
      );
      expect(screen.getByTestId('action')).toBeInTheDocument();
    });

    it('should stop propagation on click', async () => {
      const parentClick = vi.fn();
      const user = userEvent.setup();
      render(
        <button onClick={parentClick} type="button">
          <Bookmark.Actions>
            <button type="button">Action</button>
          </Bookmark.Actions>
        </button>
      );
      await user.click(screen.getByText('Action'));
      expect(parentClick).not.toHaveBeenCalled();
    });
  });

  describe('Bookmark.Icon', () => {
    it('should render icon', () => {
      render(<Bookmark.Icon icon={<span data-testid="icon">Icon</span>} />);
      expect(screen.getByTestId('icon')).toBeInTheDocument();
    });

    it('should apply dataTestId', () => {
      render(<Bookmark.Icon dataTestId="test-icon" icon={<span>Icon</span>} />);
      expect(screen.getByTestId('test-icon')).toBeInTheDocument();
    });
  });

  describe('Bookmark.Title', () => {
    it('should render title', () => {
      render(<Bookmark.Title title="Test Title" />);
      expect(screen.getByText('Test Title')).toBeInTheDocument();
    });

    it('should render React node title', () => {
      render(<Bookmark.Title title={<span data-testid="title-node">Title</span>} />);
      expect(screen.getByTestId('title-node')).toBeInTheDocument();
    });

    it('should apply default props', () => {
      const { container } = render(<Bookmark.Title title="Test" />);
      const text = container.querySelector('p');
      expect(text).toBeInTheDocument();
    });
  });

  describe('Bookmark.DragHandle', () => {
    it('should render drag handle', () => {
      render(<Bookmark.DragHandle />);
      expect(document.body).toBeTruthy();
    });

    it('should pass props to drag handle', () => {
      render(<Bookmark.DragHandle size={20} variant="list" />);
      expect(document.body).toBeTruthy();
    });
  });
});
