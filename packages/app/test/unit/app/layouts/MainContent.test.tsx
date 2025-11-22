import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { MainContent } from '@/app/layouts/MainContent';

vi.mock('@/app/layouts/Header', () => ({
  Header: () => <div data-testid="header">Header</div>,
}));

describe('MainContent', () => {
  it('should render Header component', () => {
    render(<MainContent />);
    expect(screen.getByTestId('header')).toBeInTheDocument();
  });

  it('should render content container', () => {
    render(<MainContent />);
    expect(screen.getByTestId('app-content')).toBeInTheDocument();
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
});
