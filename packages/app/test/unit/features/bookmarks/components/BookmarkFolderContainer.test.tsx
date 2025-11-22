import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { BookmarkFolderContainer } from '@/features/bookmarks/components/BookmarkFolderContainer';

describe('BookmarkFolderContainer', () => {
  it('should apply default classes', () => {
    const { container } = render(<BookmarkFolderContainer>Content</BookmarkFolderContainer>);
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveClass(
      'min-h-64',
      'w-full',
      'overflow-hidden',
      'rounded-lg',
      'border-4',
      'border-bgColor-secondary/80'
    );
  });

  it('should apply overflow-visible when overflowVisible is true', () => {
    const { container } = render(<BookmarkFolderContainer overflowVisible>Content</BookmarkFolderContainer>);
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveClass('overflow-visible');
    expect(div).not.toHaveClass('overflow-hidden');
  });

  it('should apply custom className', () => {
    const { container } = render(<BookmarkFolderContainer className="custom-class">Content</BookmarkFolderContainer>);
    const div = container.firstChild as HTMLElement;
    expect(div).toHaveClass('custom-class');
  });

  it('should render children correctly', () => {
    render(
      <BookmarkFolderContainer>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
      </BookmarkFolderContainer>
    );
    expect(screen.getByTestId('child1')).toBeInTheDocument();
    expect(screen.getByTestId('child2')).toBeInTheDocument();
  });
});
