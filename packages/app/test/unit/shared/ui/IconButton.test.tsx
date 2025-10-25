import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { IconButton } from '@/shared/ui/IconButton';
import { HeartIcon } from '@/shared/ui/Icons/Icons';

describe('IconButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders without crashing', () => {
    const onClick = vi.fn();
    render(<IconButton onClick={onClick} icon={<HeartIcon />} dataTestId="test-button" />);
    expect(screen.getByTestId('test-button')).toBeInTheDocument();
  });

  it('calls onClick when button is clicked', () => {
    const onClick = vi.fn();
    render(<IconButton onClick={onClick} icon={<HeartIcon />} dataTestId="test-button" />);

    fireEvent.click(screen.getByTestId('test-button'));

    expect(onClick).toHaveBeenCalled();
  });

  it('renders with custom className', () => {
    const onClick = vi.fn();
    render(<IconButton onClick={onClick} icon={<HeartIcon />} className="custom-class" dataTestId="test-button" />);

    expect(screen.getByTestId('test-button')).toHaveClass('custom-class');
  });

  it('renders with data-testid attribute', () => {
    const onClick = vi.fn();
    render(<IconButton onClick={onClick} icon={<HeartIcon />} dataTestId="test-id" />);

    expect(screen.getByTestId('test-id')).toBeInTheDocument();
  });

  it('renders with default class names', () => {
    const onClick = vi.fn();
    render(<IconButton onClick={onClick} icon={<HeartIcon />} dataTestId="test-button" />);

    expect(screen.getByTestId('test-button')).toHaveClass(
      'inline-flex items-center rounded-lg bg-bgColor-secondary p-1.5 text-sm text-fgColor-primary hover:bg-fgColor-hover hover:text-white disabled:opacity-50'
    );
  });

  it('renders with custom class names', () => {
    const onClick = vi.fn();
    render(<IconButton onClick={onClick} icon={<HeartIcon />} className="bg-red-500 text-white" dataTestId="test-button" />);

    expect(screen.getByTestId('test-button')).toHaveClass(
      'inline-flex items-center rounded-lg bg-bgColor-secondary p-1.5 text-sm text-fgColor-primary hover:bg-fgColor-hover hover:text-white disabled:opacity-50 bg-red-500 text-white'
    );
  });

  it('renders with data-testid and custom class names', () => {
    const onClick = vi.fn();
    render(<IconButton onClick={onClick} icon={<HeartIcon />} dataTestId="test-id" className="bg-red-500 text-white" />);

    const button = screen.getByTestId('test-id');

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(
      'inline-flex items-center rounded-lg bg-bgColor-secondary p-1.5 text-sm text-fgColor-primary hover:bg-fgColor-hover hover:text-white disabled:opacity-50 bg-red-500 text-white'
    );
  });
});
