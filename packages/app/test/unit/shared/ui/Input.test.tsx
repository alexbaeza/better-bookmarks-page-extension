import { vi } from 'vitest';

import { Input } from '@/shared/ui/Input';
import { fireEvent, render, screen } from '~test/test-utils';

describe('Input', () => {
  it('renders with default props', () => {
    render(<Input dataTestId="test-input" />);

    const input = screen.getByTestId('test-input');
    expect(input).toHaveClass(
      'w-full rounded-lg px-3 py-2 text-fgColor-primary placeholder:text-fgColor-secondary focus:outline-none focus:ring-2 focus:ring-fgColor-accent bg-bgColor-tertiary border border-fgColor-muted cursor-text'
    );
  });

  it('renders with custom className', () => {
    render(<Input className="custom-class" dataTestId="test-input" />);

    const input = screen.getByTestId('test-input');
    expect(input).toHaveClass('custom-class');
  });

  it('handles value changes', () => {
    const onChange = vi.fn();
    render(<Input dataTestId="test-input" onChange={onChange} />);

    const input = screen.getByTestId('test-input');
    fireEvent.change(input, { target: { value: 'test' } });

    expect(onChange).toHaveBeenCalled();
  });

  it('displays value', () => {
    const onChange = vi.fn();
    render(<Input dataTestId="test-input" onChange={onChange} value="test value" />);

    const input = screen.getByTestId('test-input');
    expect(input).toHaveValue('test value');
  });

  it('shows placeholder', () => {
    render(<Input dataTestId="test-input" placeholder="Enter text" />);

    const input = screen.getByTestId('test-input');
    expect(input).toHaveAttribute('placeholder', 'Enter text');
  });

  it('is disabled when disabled prop is true', () => {
    render(<Input dataTestId="test-input" disabled />);

    const input = screen.getByTestId('test-input');
    expect(input).toBeDisabled();
    expect(input).toHaveClass('bg-bgColor-muted border border-fgColor-muted cursor-not-allowed opacity-50');
  });

  it('applies enabled styles when not disabled', () => {
    render(<Input dataTestId="test-input" />);

    const input = screen.getByTestId('test-input');
    expect(input).toHaveClass('bg-bgColor-tertiary border border-fgColor-muted cursor-text');
    expect(input).not.toHaveClass('cursor-not-allowed opacity-50');
  });

  it('forwards other props', () => {
    render(<Input dataTestId="test-input" name="email" type="email" />);

    const input = screen.getByTestId('test-input');
    expect(input).toHaveAttribute('type', 'email');
    expect(input).toHaveAttribute('name', 'email');
  });
});
