import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { ThemeButton } from '@/features/settings/components/ThemeButton';

describe('ThemeButton', () => {
  const defaultProps = {
    children: 'Test Theme',
    isActive: false,
    onClick: vi.fn(),
  };

  describe('Default variant', () => {
    it('renders with inactive styling', () => {
      render(<ThemeButton {...defaultProps} />);

      const button = screen.getByRole('button', { name: 'Test Theme' });
      expect(button).toBeInTheDocument();
      expect(button).toHaveClass(
        'p-3',
        'rounded-lg',
        'border',
        'text-sm',
        'font-medium',
        'transition-colors',
        'border-fgColor-secondary/30',
        'bg-bgColor-secondary',
        'text-fgColor-primary',
        'hover:bg-bgColor-secondary/80'
      );
    });

    it('renders with active styling', () => {
      render(<ThemeButton {...defaultProps} isActive={true} />);

      const button = screen.getByRole('button', { name: 'Test Theme' });
      expect(button).toHaveClass(
        'p-3',
        'rounded-lg',
        'border',
        'text-sm',
        'font-medium',
        'transition-colors',
        'border-fgColor-accent',
        'bg-fgColor-accent/10',
        'text-fgColor-accent'
      );
    });

    it('calls onClick when clicked', () => {
      render(<ThemeButton {...defaultProps} />);

      const button = screen.getByRole('button', { name: 'Test Theme' });
      fireEvent.click(button);

      expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
    });

    it('passes data-testid correctly', () => {
      render(<ThemeButton {...defaultProps} data-testid="test-button" />);

      expect(screen.getByTestId('test-button')).toBeInTheDocument();
    });

    it('renders children correctly', () => {
      render(
        <ThemeButton {...defaultProps} variant="rainbow">
          <span>Custom Content</span>
        </ThemeButton>
      );

      expect(screen.getByText('Custom Content')).toBeInTheDocument();
    });
  });

  describe('Rainbow variant', () => {
    it('renders inactive rainbow styling', () => {
      render(<ThemeButton {...defaultProps} variant="rainbow" />);

      const button = screen.getByRole('button', { name: 'Test Theme' });
      expect(button).toHaveClass(
        'p-[2px]',
        'rounded-lg',
        'text-sm',
        'font-medium',
        'transition-all',
        'duration-300',
        'w-full'
      );

      // Check for gradient background
      expect(button).toHaveStyle({
        background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57, #ff9ff3)',
      });

      // Check inner div has correct classes
      const innerDiv = button.querySelector('div');
      expect(innerDiv).toHaveClass(
        'p-3',
        'rounded-[6px]',
        'bg-bgColor-secondary',
        'text-fgColor-primary',
        'hover:bg-bgColor-secondary/80'
      );
    });

    it('renders active rainbow styling', () => {
      render(<ThemeButton {...defaultProps} isActive={true} variant="rainbow" />);

      const button = screen.getByRole('button', { name: 'Test Theme' });
      expect(button).toHaveClass(
        'p-3',
        'rounded-lg',
        'border',
        'border-fgColor-accent',
        'bg-fgColor-accent/10',
        'text-fgColor-accent',
        'text-sm',
        'font-medium',
        'transition-all',
        'duration-300',
        'w-full'
      );
    });

    it('calls onClick when rainbow button is clicked', () => {
      render(<ThemeButton {...defaultProps} variant="rainbow" />);

      const button = screen.getByRole('button', { name: 'Test Theme' });
      fireEvent.click(button);

      expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
    });

    it('passes data-testid to rainbow button correctly', () => {
      render(<ThemeButton {...defaultProps} data-testid="rainbow-button" variant="rainbow" />);

      expect(screen.getByTestId('rainbow-button')).toBeInTheDocument();
    });

    it('renders children in rainbow button correctly', () => {
      render(
        <ThemeButton {...defaultProps} variant="rainbow">
          <span>Rainbow Content</span>
        </ThemeButton>
      );

      expect(screen.getByText('Rainbow Content')).toBeInTheDocument();
    });
  });
});
