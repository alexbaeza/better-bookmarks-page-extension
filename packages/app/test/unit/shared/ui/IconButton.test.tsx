import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { IconButton } from '@/shared/ui/IconButton';

describe('IconButton', () => {
  const mockIcon = <span data-testid="mock-icon">Icon</span>;

  it('should render without crashing', () => {
    render(<IconButton icon={mockIcon} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should render the provided icon', () => {
    render(<IconButton icon={mockIcon} />);
    expect(screen.getByTestId('mock-icon')).toBeInTheDocument();
  });

  it('should handle click events', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<IconButton icon={mockIcon} onClick={handleClick} />);
    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('should not trigger click when disabled', async () => {
    const handleClick = vi.fn();
    const user = userEvent.setup();

    render(<IconButton disabled icon={mockIcon} onClick={handleClick} />);
    await user.click(screen.getByRole('button'));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('should apply disabled styling when disabled', () => {
    render(<IconButton disabled icon={mockIcon} />);
    const button = screen.getByRole('button');
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });

  it('should apply dataTestId when provided', () => {
    render(<IconButton dataTestId="custom-test-id" icon={mockIcon} />);
    expect(screen.getByTestId('custom-test-id')).toBeInTheDocument();
  });

  it('should apply custom className', () => {
    render(<IconButton className="custom-class" icon={mockIcon} />);
    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  describe('sizes', () => {
    it('should apply medium size by default', () => {
      render(<IconButton icon={mockIcon} />);
      expect(screen.getByRole('button')).toHaveClass('p-1.5', 'text-sm');
    });

    it('should apply small size', () => {
      render(<IconButton icon={mockIcon} size="sm" />);
      expect(screen.getByRole('button')).toHaveClass('p-1', 'text-xs');
    });

    it('should apply medium size', () => {
      render(<IconButton icon={mockIcon} size="md" />);
      expect(screen.getByRole('button')).toHaveClass('p-1.5', 'text-sm');
    });

    it('should apply large size', () => {
      render(<IconButton icon={mockIcon} size="lg" />);
      expect(screen.getByRole('button')).toHaveClass('p-2', 'text-base');
    });
  });

  it('should apply positionClassName when provided', () => {
    render(<IconButton icon={mockIcon} positionClassName="absolute top-3 right-2" />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('absolute', 'top-3', 'right-2');
  });

  it('should have type button by default', () => {
    render(<IconButton icon={mockIcon} />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'button');
  });

  it('should accept custom button type', () => {
    render(<IconButton icon={mockIcon} type="submit" />);
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit');
  });

  it('should forward ref', () => {
    const ref = vi.fn();
    render(<IconButton icon={mockIcon} ref={ref} />);
    expect(ref).toHaveBeenCalled();
  });

  it('should spread additional props', () => {
    render(<IconButton aria-label="Test button" icon={mockIcon} />);
    expect(screen.getByRole('button')).toHaveAttribute('aria-label', 'Test button');
  });

  it('should have base styling classes', () => {
    render(<IconButton icon={mockIcon} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('inline-flex');
    expect(button).toHaveClass('items-center');
    expect(button).toHaveClass('rounded-lg');
    expect(button).toHaveClass('bg-bgColor-accent');
    expect(button).toHaveClass('text-fgColor-primary');
  });

  it('should have hover styling classes', () => {
    render(<IconButton icon={mockIcon} />);
    const button = screen.getByRole('button');
    expect(button).toHaveClass('hover:bg-fgColor-hover');
  });
});
