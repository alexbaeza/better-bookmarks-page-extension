import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GridItem } from '@/shared/ui/GridItem';

describe('GridItem', () => {
  it('should render without crashing', () => {
    render(<GridItem>Content</GridItem>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should apply colSpan classes correctly', () => {
    render(
      <GridItem colSpan={3} data-testid="grid-item">
        Content
      </GridItem>
    );
    const item = screen.getByTestId('grid-item');
    expect(item).toHaveClass('col-span-3');
  });

  it('should apply rowSpan classes correctly', () => {
    render(
      <GridItem data-testid="grid-item" rowSpan={2}>
        Content
      </GridItem>
    );
    const item = screen.getByTestId('grid-item');
    expect(item).toHaveClass('row-span-2');
  });

  it('should apply full span classes', () => {
    render(
      <GridItem colSpan="full" data-testid="grid-item">
        Content
      </GridItem>
    );
    const item = screen.getByTestId('grid-item');
    expect(item).toHaveClass('col-span-full');
  });

  it('should apply md::col-span class when md colSpan prop is provided', () => {
    render(
      <GridItem data-testid="grid-item" md={{ colSpan: 2 }}>
        Content
      </GridItem>
    );
    const item = screen.getByTestId('grid-item');
    expect(item).toHaveClass('md::col-span-2');
  });

  it('should apply lg::col-span class when lg colSpan prop is provided', () => {
    render(
      <GridItem data-testid="grid-item" lg={{ colSpan: 3 }}>
        Content
      </GridItem>
    );
    const item = screen.getByTestId('grid-item');
    expect(item).toHaveClass('lg::col-span-3');
  });

  it('should apply inline styles for values > 12', () => {
    render(
      <GridItem colSpan={15} data-testid="grid-item">
        Content
      </GridItem>
    );
    const item = screen.getByTestId('grid-item');
    expect(item).toHaveStyle({ gridColumn: 'span 15' });
  });

  it('should apply custom className', () => {
    render(
      <GridItem className="custom-class" data-testid="grid-item">
        Content
      </GridItem>
    );
    const item = screen.getByTestId('grid-item');
    expect(item).toHaveClass('custom-class');
  });

  it('should apply data-testid', () => {
    render(<GridItem data-testid="test-grid-item">Content</GridItem>);
    expect(screen.getByTestId('test-grid-item')).toBeInTheDocument();
  });

  it('should render children correctly', () => {
    render(
      <GridItem>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
      </GridItem>
    );
    expect(screen.getByTestId('child1')).toBeInTheDocument();
    expect(screen.getByTestId('child2')).toBeInTheDocument();
  });

  it('should apply xl::col-span class when xl colSpan prop is provided', () => {
    render(
      <GridItem data-testid="grid-item" xl={{ colSpan: 2 }}>
        Content
      </GridItem>
    );
    const item = screen.getByTestId('grid-item');
    expect(item).toHaveClass('xl::col-span-2');
  });

  it('should apply 2xl::col-span class when 2xl colSpan prop is provided', () => {
    render(
      <GridItem {...{ '2xl': { colSpan: 3 } }} data-testid="grid-item">
        Content
      </GridItem>
    );
    const item = screen.getByTestId('grid-item');
    expect(item).toHaveClass('2xl::col-span-3');
  });

  it('should apply sm::col-span class when sm colSpan prop is provided', () => {
    render(
      <GridItem data-testid="grid-item" sm={{ colSpan: 2 }}>
        Content
      </GridItem>
    );
    const item = screen.getByTestId('grid-item');
    expect(item).toHaveClass('sm::col-span-2');
  });

  it('should apply sm::row-span class when sm rowSpan prop is provided', () => {
    render(
      <GridItem data-testid="grid-item" sm={{ rowSpan: 2 }}>
        Content
      </GridItem>
    );
    const item = screen.getByTestId('grid-item');
    expect(item).toHaveClass('sm::row-span-2');
  });

  it('should apply md::row-span class when md rowSpan prop is provided', () => {
    render(
      <GridItem data-testid="grid-item" md={{ rowSpan: 2 }}>
        Content
      </GridItem>
    );
    const item = screen.getByTestId('grid-item');
    expect(item).toHaveClass('md::row-span-2');
  });

  it('should apply lg::row-span class when lg rowSpan prop is provided', () => {
    render(
      <GridItem data-testid="grid-item" lg={{ rowSpan: 3 }}>
        Content
      </GridItem>
    );
    const item = screen.getByTestId('grid-item');
    expect(item).toHaveClass('lg::row-span-3');
  });

  it('should apply xl::row-span class when xl rowSpan prop is provided', () => {
    render(
      <GridItem data-testid="grid-item" xl={{ rowSpan: 2 }}>
        Content
      </GridItem>
    );
    const item = screen.getByTestId('grid-item');
    expect(item).toHaveClass('xl::row-span-2');
  });

  it('should apply 2xl::row-span class when 2xl rowSpan prop is provided', () => {
    render(
      <GridItem {...{ '2xl': { rowSpan: 3 } }} data-testid="grid-item">
        Content
      </GridItem>
    );
    const item = screen.getByTestId('grid-item');
    expect(item).toHaveClass('2xl::row-span-3');
  });
});
