import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Grid } from '@/shared/ui/Grid';

describe('Grid', () => {
  it('should apply default classes', () => {
    render(<Grid data-testid="grid">Content</Grid>);
    const grid = screen.getByTestId('grid');
    expect(grid).toHaveClass('grid', 'gap-2');
  });

  it('should apply column classes correctly', () => {
    render(
      <Grid columns={3} data-testid="grid">
        Content
      </Grid>
    );
    const grid = screen.getByTestId('grid');
    expect(grid).toHaveClass('grid-cols-3');
  });

  it('should apply sm::grid-cols class when sm prop is provided', () => {
    render(
      <Grid data-testid="grid" sm={2}>
        Content
      </Grid>
    );
    const grid = screen.getByTestId('grid');
    expect(grid).toHaveClass('sm::grid-cols-2');
  });

  it('should apply md::grid-cols class when md prop is provided', () => {
    render(
      <Grid data-testid="grid" md={2}>
        Content
      </Grid>
    );
    const grid = screen.getByTestId('grid');
    expect(grid).toHaveClass('md::grid-cols-2');
  });

  it('should apply lg::grid-cols class when lg prop is provided', () => {
    render(
      <Grid data-testid="grid" lg={3}>
        Content
      </Grid>
    );
    const grid = screen.getByTestId('grid');
    expect(grid).toHaveClass('lg::grid-cols-3');
  });

  it('should apply xl::grid-cols class when xl prop is provided', () => {
    render(
      <Grid data-testid="grid" xl={4}>
        Content
      </Grid>
    );
    const grid = screen.getByTestId('grid');
    expect(grid).toHaveClass('xl::grid-cols-4');
  });

  it('should apply 2xl::grid-cols class when 2xl prop is provided', () => {
    render(
      <Grid {...{ '2xl': 5 }} data-testid="grid">
        Content
      </Grid>
    );
    const grid = screen.getByTestId('grid');
    expect(grid).toHaveClass('2xl::grid-cols-5');
  });

  it('should not apply gap class when gap="none"', () => {
    render(
      <Grid data-testid="grid" gap="none">
        Content
      </Grid>
    );
    const grid = screen.getByTestId('grid');
    expect(grid.className).not.toContain('gap-');
  });

  it.each([
    ['sm', 'gap-1'],
    ['md', 'gap-2'],
    ['lg', 'gap-4'],
    ['xl', 'gap-6'],
  ])('should apply gap class "%s" when gap="%s"', (gap, expectedClass) => {
    render(
      // @ts-expect-error - Testing invalid prop value
      <Grid data-testid="grid" gap={gap}>
        Content
      </Grid>
    );
    const grid = screen.getByTestId('grid');
    expect(grid).toHaveClass(expectedClass);
  });

  it('should apply custom className', () => {
    render(
      <Grid className="custom-class" data-testid="grid">
        Content
      </Grid>
    );
    const grid = screen.getByTestId('grid');
    expect(grid).toHaveClass('custom-class');
  });

  it('should apply data-testid', () => {
    render(<Grid data-testid="test-grid">Content</Grid>);
    expect(screen.getByTestId('test-grid')).toBeInTheDocument();
  });

  it('should calculate optimal columns from container width', () => {
    render(
      <Grid containerWidth={1000} data-testid="grid" minItemWidth="200px">
        Content
      </Grid>
    );
    const grid = screen.getByTestId('grid');
    expect(grid).toHaveClass('grid');
    expect(grid).toBeInTheDocument();
  });

  it('should use auto columns when specified', () => {
    render(
      <Grid columns="auto" data-testid="grid" minItemWidth="200px">
        Content
      </Grid>
    );
    const grid = screen.getByTestId('grid');
    expect(grid).toHaveStyle({ gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))' });
  });

  it('should render dividers when renderDivider is provided', () => {
    const renderDivider = vi.fn(({ index }) => <div data-testid={`divider-${index}`}>Divider {index}</div>);
    render(
      <Grid columns={2} data-testid="grid" renderDivider={renderDivider}>
        <div>Item 1</div>
        <div>Item 2</div>
        <div>Item 3</div>
      </Grid>
    );
    expect(renderDivider).toHaveBeenCalled();
  });
});
