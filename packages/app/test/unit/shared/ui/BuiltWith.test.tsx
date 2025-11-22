import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { APP_REPO_URL } from '@/config/constants';
import { BuiltWith } from '@/shared/ui/BuiltWith';

describe('BuiltWith', () => {
  it('should display "Built with" text', () => {
    render(<BuiltWith />);
    expect(screen.getByText(/Built with/i)).toBeInTheDocument();
  });

  it('should display heart icon', () => {
    render(<BuiltWith />);
    const heartIcon = screen.getByTestId('heart-icon');
    expect(heartIcon).toBeInTheDocument();
  });

  it('should display "by" text', () => {
    render(<BuiltWith />);
    expect(screen.getByText(/by/i)).toBeInTheDocument();
  });

  it('should display author link', () => {
    render(<BuiltWith />);
    const authorLink = screen.getByTestId('author-link');
    expect(authorLink).toBeInTheDocument();
    expect(authorLink).toHaveTextContent('alexbaeza.');
  });

  it('should link to the correct repository URL', () => {
    render(<BuiltWith />);
    const authorLink = screen.getByTestId('author-link');
    expect(authorLink).toHaveAttribute('href', APP_REPO_URL);
  });

  it('should apply default className', () => {
    render(<BuiltWith />);
    const container = screen.getByTestId('built-with');
    expect(container).toHaveClass('justify-end');
  });

  it('should apply custom className', () => {
    render(<BuiltWith className="custom-class" />);
    const container = screen.getByTestId('built-with');
    expect(container).toHaveClass('custom-class');
    expect(container).not.toHaveClass('justify-end');
  });

  it('should have proper text styling classes', () => {
    render(<BuiltWith />);
    const container = screen.getByTestId('built-with');
    expect(container).toHaveClass('text-xs');
    expect(container).toHaveClass('text-fgColor-primary');
  });

  it('should have red heart icon styling', () => {
    render(<BuiltWith />);
    const heartIcon = screen.getByTestId('heart-icon');
    expect(heartIcon).toHaveClass('text-red-600');
  });

  it('should have bold author link', () => {
    render(<BuiltWith />);
    const authorLink = screen.getByTestId('author-link');
    expect(authorLink).toHaveClass('font-bold');
  });

  it('should render all elements in correct order', () => {
    const { container } = render(<BuiltWith />);
    const text = container.textContent;
    expect(text).toMatch(/Built with.*by.*alexbaeza\./);
  });
});
