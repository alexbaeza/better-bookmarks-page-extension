import { vi } from 'vitest';

import { IconButton } from '@/shared/ui/IconButton';
import { fireEvent, render, screen } from '~test/test-utils';

describe('IconButton', () => {
  it('renders without crashing', () => {
    const onClick = vi.fn();
    render(<IconButton onClick={onClick} icon={<span>icon</span>} />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('calls onClick when button is clicked', () => {
    const onClick = vi.fn();
    render(<IconButton onClick={onClick} icon={<span>icon</span>} />);

    fireEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalled();
  });

  it('renders with custom className', () => {
    const onClick = vi.fn();
    render(<IconButton onClick={onClick} icon={<span>icon</span>} className="custom-class" />);

    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('renders with data-testid attribute', () => {
    const onClick = vi.fn();
    render(<IconButton onClick={onClick} icon={<span>icon</span>} dataTestId="test-id" />);

    expect(screen.getByTestId('test-id')).toBeInTheDocument();
  });

  it('renders with default class names', () => {
    const onClick = vi.fn();
    render(<IconButton onClick={onClick} icon={<span>icon</span>} />);

    expect(screen.getByRole('button')).toHaveClass(
      'inline-flex items-center rounded-lg bg-bgColor-secondary p-1.5 text-sm text-fgColor-primary hover:bg-fgColor-hover hover:text-white disabled:opacity-50'
    );
  });

  it('renders with custom class names', () => {
    const onClick = vi.fn();
    render(<IconButton onClick={onClick} icon={<span>icon</span>} className="bg-red-500 text-white" />);

    expect(screen.getByRole('button')).toHaveClass(
      'inline-flex items-center rounded-lg bg-bgColor-secondary p-1.5 text-sm text-fgColor-primary hover:bg-fgColor-hover hover:text-white disabled:opacity-50 bg-red-500 text-white'
    );
  });

  it('renders the icon', () => {
    const onClick = vi.fn();
    render(<IconButton onClick={onClick} icon={<span data-testid="icon">icon</span>} />);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('forwards ref correctly', () => {
    const ref = vi.fn();
    render(<IconButton ref={ref} icon={<span>icon</span>} />);
    expect(ref).toHaveBeenCalled();
  });
});
