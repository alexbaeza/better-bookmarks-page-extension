import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Col } from '@/shared/ui/Col';

describe('Col', () => {
  it('should render without crashing', () => {
    render(<Col>Content</Col>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should apply default flex-1 class when no span is provided', () => {
    render(<Col data-testid="col">Content</Col>);
    const col = screen.getByTestId('col');
    expect(col).toHaveClass('flex-1');
  });

  it('should apply span class for auto', () => {
    render(
      <Col data-testid="col" span="auto">
        Content
      </Col>
    );
    const col = screen.getByTestId('col');
    expect(col).toHaveClass('flex-1');
  });

  it('should apply span class for full', () => {
    render(
      <Col data-testid="col" span="full">
        Content
      </Col>
    );
    const col = screen.getByTestId('col');
    expect(col).toHaveClass('w-full');
  });

  it('should apply inline style for numeric span', () => {
    render(
      <Col data-testid="col" span={6}>
        Content
      </Col>
    );
    const col = screen.getByTestId('col');
    expect(col).toHaveStyle({ flex: '0 0 50%', maxWidth: '50%' });
  });

  it('should apply sm::flex-1 class when sm="auto"', () => {
    render(
      <Col data-testid="col" sm="auto">
        Content
      </Col>
    );
    const col = screen.getByTestId('col');
    expect(col).toHaveClass('sm::flex-1');
  });

  it('should apply md::flex-1 class when md="auto"', () => {
    render(
      <Col data-testid="col" md="auto">
        Content
      </Col>
    );
    const col = screen.getByTestId('col');
    expect(col).toHaveClass('md::flex-1');
  });

  it('should apply lg::flex-1 class when lg="auto"', () => {
    render(
      <Col data-testid="col" lg="auto">
        Content
      </Col>
    );
    const col = screen.getByTestId('col');
    expect(col).toHaveClass('lg::flex-1');
  });

  it('should apply custom className', () => {
    render(
      <Col className="custom-class" data-testid="col">
        Content
      </Col>
    );
    const col = screen.getByTestId('col');
    expect(col).toHaveClass('custom-class');
  });

  it('should apply order style when provided', () => {
    render(
      <Col data-testid="col" order={2}>
        Content
      </Col>
    );
    const col = screen.getByTestId('col');
    expect(col).toHaveStyle({ order: 2 });
  });

  it('should apply data-testid', () => {
    render(<Col data-testid="test-col">Content</Col>);
    expect(screen.getByTestId('test-col')).toBeInTheDocument();
  });

  it('should render children correctly', () => {
    render(
      <Col>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
      </Col>
    );
    expect(screen.getByTestId('child1')).toBeInTheDocument();
    expect(screen.getByTestId('child2')).toBeInTheDocument();
  });

  it('should apply xl::flex-1 class when xl="auto"', () => {
    render(
      <Col data-testid="col" xl="auto">
        Content
      </Col>
    );
    const col = screen.getByTestId('col');
    expect(col).toHaveClass('xl::flex-1');
  });

  it('should apply 2xl::flex-1 class when 2xl="auto"', () => {
    render(
      <Col data-testid="col" {...{ '2xl': 'auto' }}>
        Content
      </Col>
    );
    const col = screen.getByTestId('col');
    expect(col).toHaveClass('2xl::flex-1');
  });

  it('should apply sm::w-full class when sm="full"', () => {
    render(
      <Col data-testid="col" sm="full">
        Content
      </Col>
    );
    const col = screen.getByTestId('col');
    expect(col).toHaveClass('sm::w-full');
  });

  it('should apply md::w-full class when md="full"', () => {
    render(
      <Col data-testid="col" md="full">
        Content
      </Col>
    );
    const col = screen.getByTestId('col');
    expect(col).toHaveClass('md::w-full');
  });

  it('should apply lg::w-full class when lg="full"', () => {
    render(
      <Col data-testid="col" lg="full">
        Content
      </Col>
    );
    const col = screen.getByTestId('col');
    expect(col).toHaveClass('lg::w-full');
  });

  it('should apply xl::w-full class when xl="full"', () => {
    render(
      <Col data-testid="col" xl="full">
        Content
      </Col>
    );
    const col = screen.getByTestId('col');
    expect(col).toHaveClass('xl::w-full');
  });

  it('should apply 2xl::w-full class when 2xl="full"', () => {
    render(
      <Col data-testid="col" {...{ '2xl': 'full' }}>
        Content
      </Col>
    );
    const col = screen.getByTestId('col');
    expect(col).toHaveClass('2xl::w-full');
  });
});
