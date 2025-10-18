import { vi } from 'vitest';

import { Toggle } from '@/shared/ui/Toggle';
import { fireEvent, render, screen } from '~test/test-utils';

describe('Toggle', () => {
  it('renders unchecked by default', () => {
    render(<Toggle checked={false} onChange={() => {}} />);

    const input = screen.getByRole('checkbox');
    expect(input).not.toBeChecked();
  });

  it('renders checked when checked prop is true', () => {
    render(<Toggle checked onChange={() => {}} />);

    const input = screen.getByRole('checkbox');
    expect(input).toBeChecked();
  });

  it('calls onChange with true when unchecked toggle is clicked', () => {
    const onChange = vi.fn();
    render(<Toggle checked={false} onChange={onChange} />);

    const checkbox = screen.getByRole('checkbox');
    const label = checkbox.parentElement;
    expect(label).toBeTruthy();
    fireEvent.click(label as HTMLElement);

    expect(onChange).toHaveBeenCalledWith(true);
  });

  it('calls onChange with false when checked toggle is clicked', () => {
    const onChange = vi.fn();
    render(<Toggle checked onChange={onChange} />);

    const checkbox = screen.getByRole('checkbox');
    const label = checkbox.parentElement;
    expect(label).toBeTruthy();
    fireEvent.click(label as HTMLElement);

    expect(onChange).toHaveBeenCalledWith(false);
  });

  it('applies custom className', () => {
    render(<Toggle checked={false} onChange={() => {}} className="custom-class" />);

    const checkbox = screen.getByRole('checkbox');
    const label = checkbox.parentElement;
    expect(label).toBeTruthy();
    expect(label).toHaveClass('custom-class');
  });

  it('has correct base classes', () => {
    render(<Toggle checked={false} onChange={() => {}} />);

    const checkbox = screen.getByRole('checkbox');
    const label = checkbox.parentElement;
    expect(label).toBeTruthy();
    expect(label).toHaveClass('relative inline-flex cursor-pointer items-center');
  });

  it('has correct toggle classes when unchecked', () => {
    render(<Toggle checked={false} onChange={() => {}} />);

    const checkbox = screen.getByRole('checkbox');
    const toggle = checkbox.nextElementSibling;
    expect(toggle).toBeTruthy();
    expect(toggle).toHaveClass('peer h-6 w-11 rounded-full bg-bgColor-tertiary');
  });

  it('has correct toggle classes when checked', () => {
    render(<Toggle checked onChange={() => {}} />);

    const checkbox = screen.getByRole('checkbox');
    const toggle = checkbox.nextElementSibling;
    expect(toggle).toBeTruthy();
    expect(toggle).toHaveClass('peer h-6 w-11 rounded-full bg-bgColor-tertiary peer-checked:bg-bgColor-accent');
  });

  it('forwards other props to input', () => {
    render(<Toggle checked={false} onChange={() => {}} disabled />);

    const input = screen.getByRole('checkbox');
    expect(input).toBeDisabled();
  });
});
