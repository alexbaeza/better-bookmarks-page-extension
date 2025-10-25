import { vi } from 'vitest';

import { Button } from '@/shared/ui/Button';
import { fireEvent, render, screen } from '~test/test-utils';

describe('Button', () => {
  it('renders with primary variant by default', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toHaveClass('bg-bgColor-accent text-fgColor-primary');
  });

  it('renders with secondary variant', () => {
    render(<Button variant="secondary">Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toHaveClass('bg-bgColor-secondary text-fgColor-secondary');
  });

  it('renders with custom className', () => {
    render(<Button className="custom-class">Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toHaveClass('custom-class');
  });

  it('handles click events', () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Click me
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('applies disabled styles for primary variant', () => {
    render(
      <Button variant="primary" disabled>
        Click me
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toHaveClass('disabled:bg-bgColor-muted disabled:text-fgColor-secondary');
  });

  it('applies disabled styles for secondary variant', () => {
    render(
      <Button variant="secondary" disabled>
        Click me
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toHaveClass('disabled:text-fgColor-muted disabled:bg-transparent');
  });

  it('has base styles', () => {
    render(<Button>Click me</Button>);

    const button = screen.getByRole('button', { name: 'Click me' });
    expect(button).toHaveClass('px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-fgColor-accent transition-colors');
  });
});
