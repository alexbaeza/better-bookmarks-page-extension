import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MainContent } from '@/app/layouts/MainContent';

vi.mock('@/app/layouts/Header', () => ({
  Header: () => <div data-testid="header">Header</div>,
}));

describe('MainContent', () => {
  it('should render without crashing', () => {
    render(<MainContent />);
    expect(screen.getByTestId('app-content-container')).toBeInTheDocument();
  });

  it('should render Header component', () => {
    render(<MainContent />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('should render content container', () => {
    render(<MainContent />);
    expect(screen.getByTestId('app-content')).toBeInTheDocument();
  });

  it('should render children when provided', () => {
    render(
      <MainContent>
        <div data-testid="test-child">Test Child</div>
      </MainContent>
    );
    expect(screen.getByTestId('test-child')).toBeInTheDocument();
  });

  it('should have flex-1 and overflow classes on container', () => {
    render(<MainContent />);
    const container = screen.getByTestId('app-content-container');
    expect(container).toHaveClass('flex-1', 'overflow-hidden', 'flex-col', 'min-h-0');
  });

  it('should have proper overflow classes on scrollable content', () => {
    render(<MainContent />);
    const content = screen.getByTestId('app-content');
    expect(content).toHaveClass('flex-1', 'overflow-y-auto', 'min-h-0');
  });

  it('should render Header before content', () => {
    render(
      <MainContent>
        <div data-testid="test-child">Child</div>
      </MainContent>
    );

    const content = screen.getByTestId('app-content');
    const header = screen.getByTestId('header');
    const child = screen.getByTestId('test-child');

    expect(content).toBeInTheDocument();
    expect(header).toBeInTheDocument();
    expect(child).toBeInTheDocument();

    expect(content).toContainElement(header);
    expect(content).toContainElement(child);
    const children = Array.from(content.children);
    expect(children.length).toBeGreaterThan(0);
    const headerIndex = Array.from(content.childNodes).findIndex((node) => {
      return node.nodeType === 1 && (node as Element).contains?.(header);
    });
    expect(headerIndex).toBeGreaterThanOrEqual(0);
  });

  it('should accept multiple children', () => {
    render(
      <MainContent>
        <div data-testid="child-1">Child 1</div>
        <div data-testid="child-2">Child 2</div>
      </MainContent>
    );

    expect(screen.getByTestId('child-1')).toBeInTheDocument();
    expect(screen.getByTestId('child-2')).toBeInTheDocument();
  });
});
