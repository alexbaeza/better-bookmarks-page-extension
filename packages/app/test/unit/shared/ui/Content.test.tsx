import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Content } from '@/shared/ui/Content';

describe('Content', () => {
  it('should render without crashing', () => {
    render(<Content>Content</Content>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('should apply padding by default', () => {
    render(<Content data-testid="content">Content</Content>);
    const content = screen.getByTestId('content');
    expect(content).toHaveClass('p-2');
  });

  it('should not apply padding when padding is false', () => {
    render(
      <Content data-testid="content" padding={false}>
        Content
      </Content>
    );
    const content = screen.getByTestId('content');
    expect(content).not.toHaveClass('p-2');
  });

  it('should apply custom className', () => {
    render(
      <Content className="custom-class" data-testid="content">
        Content
      </Content>
    );
    const content = screen.getByTestId('content');
    expect(content).toHaveClass('custom-class');
  });

  it('should apply data-testid', () => {
    render(<Content data-testid="test-content">Content</Content>);
    expect(screen.getByTestId('test-content')).toBeInTheDocument();
  });

  it('should render children correctly', () => {
    render(
      <Content>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
      </Content>
    );
    expect(screen.getByTestId('child1')).toBeInTheDocument();
    expect(screen.getByTestId('child2')).toBeInTheDocument();
  });
});
