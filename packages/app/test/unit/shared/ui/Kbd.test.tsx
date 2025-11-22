import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Kbd } from '@/shared/ui/Kbd';

describe('Kbd', () => {
  it('should render keyboard key text', () => {
    render(<Kbd>Enter</Kbd>);
    expect(screen.getByText('Enter')).toBeInTheDocument();
  });

  it('should apply default classes', () => {
    const { container } = render(<Kbd>Key</Kbd>);
    const kbd = container.querySelector('kbd');
    expect(kbd).toHaveClass(
      'inline-flex',
      'items-center',
      'justify-center',
      'px-2',
      'py-1.5',
      'text-xs',
      'font-semibold',
      'rounded-lg',
      'border',
      'transition-all',
      'duration-150',
      'bg-bgColor-secondary',
      'text-fgColor-secondary',
      'border-bgColor-tertiary'
    );
  });

  it('should apply active classes when active is true', () => {
    const { container } = render(<Kbd active>Key</Kbd>);
    const kbd = container.querySelector('kbd');
    expect(kbd).toHaveClass(
      'bg-fgColor-accent',
      'text-fgColor-primary',
      'border-fgColor-accent',
      'shadow-lg',
      'shadow-fgColor-accent/50',
      'scale-105'
    );
  });

  it('should not apply active classes when active is false', () => {
    const { container } = render(<Kbd active={false}>Key</Kbd>);
    const kbd = container.querySelector('kbd');
    expect(kbd).not.toHaveClass('bg-fgColor-accent', 'scale-105');
    expect(kbd).toHaveClass('bg-bgColor-secondary');
  });

  it('should apply custom className', () => {
    const { container } = render(<Kbd className="custom-class">Key</Kbd>);
    const kbd = container.querySelector('kbd');
    expect(kbd).toHaveClass('custom-class');
  });

  it('should render children correctly', () => {
    render(
      <Kbd>
        <span data-testid="child">Ctrl</span>
      </Kbd>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
  });
});
