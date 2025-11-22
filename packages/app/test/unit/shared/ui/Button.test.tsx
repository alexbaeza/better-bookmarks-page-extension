import { vi } from 'vitest';

import { Button } from '@/shared/ui/Button';
import { fireEvent, render, screen } from '~test/test-utils';

describe('Button', () => {
  it('renders with primary variant by default', () => {
    render(<Button dataTestId="test-button">Click me</Button>);

    const button = screen.getByTestId('test-button');
    expect(button).toHaveClass('bg-bgColor-accent text-fgColor-primary');
  });

  it('renders with secondary variant', () => {
    render(
      <Button dataTestId="test-button" variant="secondary">
        Click me
      </Button>
    );

    const button = screen.getByTestId('test-button');
    expect(button).toHaveClass('bg-bgColor-secondary text-fgColor-secondary');
  });

  it('renders with custom className', () => {
    render(
      <Button className="custom-class" dataTestId="test-button">
        Click me
      </Button>
    );

    const button = screen.getByTestId('test-button');
    expect(button).toHaveClass('custom-class');
  });

  it('handles click events', () => {
    const onClick = vi.fn();
    render(
      <Button dataTestId="test-button" onClick={onClick}>
        Click me
      </Button>
    );

    const button = screen.getByTestId('test-button');
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalled();
  });

  it('is disabled when disabled prop is true', () => {
    const onClick = vi.fn();
    render(
      <Button dataTestId="test-button" disabled onClick={onClick}>
        Click me
      </Button>
    );

    const button = screen.getByTestId('test-button');
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(0);
  });

  it('applies disabled styles for primary variant', () => {
    render(
      <Button dataTestId="test-button" disabled variant="primary">
        Click me
      </Button>
    );

    const button = screen.getByTestId('test-button');
    expect(button).toHaveClass('disabled:bg-bgColor-secondary/50 disabled:text-fgColor-secondary');
  });

  it('applies disabled styles for secondary variant', () => {
    render(
      <Button dataTestId="test-button" disabled variant="secondary">
        Click me
      </Button>
    );

    const button = screen.getByTestId('test-button');
    expect(button).toHaveClass('disabled:text-fgColor-secondary/50 disabled:bg-transparent');
  });

  it('has base styles', () => {
    render(<Button dataTestId="test-button">Click me</Button>);

    const button = screen.getByTestId('test-button');
    expect(button).toHaveClass(
      'px-4 py-2 rounded font-medium focus:outline-none focus:ring-2 focus:ring-fgColor-accent transition-colors'
    );
  });
});
