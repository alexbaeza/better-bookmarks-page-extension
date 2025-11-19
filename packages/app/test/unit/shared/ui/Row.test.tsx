import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Row } from '@/shared/ui/Row';

describe('Row', () => {
  it('should render without crashing', () => {
    render(<Row>Content</Row>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    render(<Row data-testid="row">Content</Row>);
    const row = screen.getByTestId('row');
    expect(row).toHaveClass('flex', 'flex-row', 'gap-2', 'items-start', 'justify-start');
  });

  it('should not apply gap class when gap="none"', () => {
    render(
      <Row data-testid="row" gap="none">
        Content
      </Row>
    );
    const row = screen.getByTestId('row');
    expect(row.className).not.toContain('gap-');
  });

  it.each([
    ['sm', 'gap-1'],
    ['md', 'gap-2'],
    ['lg', 'gap-4'],
    ['xl', 'gap-6'],
  ])('should apply gap class "%s" when gap="%s"', (gap, expectedClass) => {
    render(
      // @ts-expect-error - Testing invalid prop value
      <Row data-testid="row" gap={gap}>
        Content
      </Row>
    );
    const row = screen.getByTestId('row');
    expect(row).toHaveClass(expectedClass);
  });

  it.each([
    ['start', 'items-start'],
    ['center', 'items-center'],
    ['end', 'items-end'],
    ['stretch', 'items-stretch'],
    ['baseline', 'items-baseline'],
  ])('should apply alignItems class "%s" when alignItems="%s"', (alignment, expectedClass) => {
    render(
      // @ts-expect-error - Testing invalid prop value
      <Row alignItems={alignment} data-testid="row">
        Content
      </Row>
    );
    const row = screen.getByTestId('row');
    expect(row).toHaveClass(expectedClass);
  });

  it.each([
    ['start', 'justify-start'],
    ['center', 'justify-center'],
    ['end', 'justify-end'],
    ['between', 'justify-between'],
    ['around', 'justify-around'],
    ['evenly', 'justify-evenly'],
  ])('should apply justifyContent class "%s" when justifyContent="%s"', (justification, expectedClass) => {
    render(
      // @ts-expect-error - Testing invalid prop value
      <Row data-testid="row" justifyContent={justification}>
        Content
      </Row>
    );
    const row = screen.getByTestId('row');
    expect(row).toHaveClass(expectedClass);
  });

  it('should apply flex-wrap when wrap is true', () => {
    render(
      <Row data-testid="row" wrap>
        Content
      </Row>
    );
    const row = screen.getByTestId('row');
    expect(row).toHaveClass('flex-wrap');
  });

  it('should not apply flex-wrap when wrap is false', () => {
    render(
      <Row data-testid="row" wrap={false}>
        Content
      </Row>
    );
    const row = screen.getByTestId('row');
    expect(row).not.toHaveClass('flex-wrap');
  });

  it('should apply custom className', () => {
    render(
      <Row className="custom-class" data-testid="row">
        Content
      </Row>
    );
    const row = screen.getByTestId('row');
    expect(row).toHaveClass('custom-class');
  });

  it('should apply data-testid', () => {
    render(<Row data-testid="test-row">Content</Row>);
    expect(screen.getByTestId('test-row')).toBeInTheDocument();
  });

  it('should render children correctly', () => {
    render(
      <Row>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
      </Row>
    );
    expect(screen.getByTestId('child1')).toBeInTheDocument();
    expect(screen.getByTestId('child2')).toBeInTheDocument();
  });
});
