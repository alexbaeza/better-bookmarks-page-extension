import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MainContent } from '@/app/layouts/MainContent';

// Mock Header component
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

  it('should have flex-1 and overflow-y-auto classes on container', () => {
    render(<MainContent />);
    const container = screen.getByTestId('app-content-container');
    expect(container).toHaveClass('flex-1', 'overflow-y-auto');
  });

  it('should have proper padding and overflow classes on content', () => {
    render(<MainContent />);
    const content = screen.getByTestId('app-content');
    expect(content).toHaveClass('flex-1', 'overflow-y-auto', 'p-2');
  });

  it('should render Header before content', () => {
    const { container } = render(
      <MainContent>
        <div data-testid="test-child">Child</div>
      </MainContent>
    );

    const header = screen.getByTestId('header');
    const content = screen.getByTestId('app-content');

    expect(container.firstChild?.firstChild).toBe(header);
    expect(content).toBeInTheDocument();
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
