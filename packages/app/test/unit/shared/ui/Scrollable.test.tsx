import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Scrollable } from '@/shared/ui/Scrollable';

describe('Scrollable', () => {
  it('should apply default classes', () => {
    render(<Scrollable data-testid="scrollable">Content</Scrollable>);
    const scrollable = screen.getByTestId('scrollable');
    expect(scrollable).toHaveClass('min-h-0', 'flex-1', 'overflow-y-auto');
  });

  it('should apply custom className', () => {
    render(
      <Scrollable className="custom-class" data-testid="scrollable">
        Content
      </Scrollable>
    );
    const scrollable = screen.getByTestId('scrollable');
    expect(scrollable).toHaveClass('custom-class');
  });

  it('should apply data-testid', () => {
    render(<Scrollable data-testid="test-scrollable">Content</Scrollable>);
    expect(screen.getByTestId('test-scrollable')).toBeInTheDocument();
  });

  it('should render children correctly', () => {
    render(
      <Scrollable>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
      </Scrollable>
    );
    expect(screen.getByTestId('child1')).toBeInTheDocument();
    expect(screen.getByTestId('child2')).toBeInTheDocument();
  });
});
