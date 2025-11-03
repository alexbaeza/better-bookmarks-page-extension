import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { List } from '@/shared/ui/List';

describe('List', () => {
  it('should render without crashing', () => {
    render(<List>Content</List>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    render(<List data-testid="list">Content</List>);
    const list = screen.getByTestId('list');
    expect(list).toHaveClass('flex', 'flex-col', 'gap-2');
  });

  it('should not apply gap class when gap="none"', () => {
    render(
      <List data-testid="list" gap="none">
        Content
      </List>
    );
    const list = screen.getByTestId('list');
    expect(list.className).not.toContain('gap-');
  });

  it.each([
    ['xs', 'gap-px'],
    ['sm', 'gap-1'],
    ['md', 'gap-2'],
    ['lg', 'gap-4'],
    ['xl', 'gap-6'],
  ])('should apply gap class "%s" when gap="%s"', (gap, expectedClass) => {
    render(
      <List data-testid="list" gap={gap as any}>
        Content
      </List>
    );
    const list = screen.getByTestId('list');
    expect(list).toHaveClass(expectedClass);
  });

  it('should apply custom className', () => {
    render(
      <List className="custom-class" data-testid="list">
        Content
      </List>
    );
    const list = screen.getByTestId('list');
    expect(list).toHaveClass('custom-class');
  });

  it('should apply data-testid', () => {
    render(<List data-testid="test-list">Content</List>);
    expect(screen.getByTestId('test-list')).toBeInTheDocument();
  });

  it('should render children correctly', () => {
    render(
      <List>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
      </List>
    );
    expect(screen.getByTestId('child1')).toBeInTheDocument();
    expect(screen.getByTestId('child2')).toBeInTheDocument();
  });

  it('should render dividers when renderDivider is provided', () => {
    const renderDivider = vi.fn(({ index, position }) => (
      <div data-testid={`divider-${index}-${position}`}>Divider</div>
    ));
    render(
      <List renderDivider={renderDivider}>
        <div>Item 1</div>
        <div>Item 2</div>
      </List>
    );
    expect(renderDivider).toHaveBeenCalled();
    expect(screen.getByTestId('divider-0-top')).toBeInTheDocument();
  });
});
