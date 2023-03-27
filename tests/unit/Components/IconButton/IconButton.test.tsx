import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { IconButton } from '../../../../src/Components/IconButton/IconButton';
import { HeartIcon } from '../../../../src/Components/IconButton/Icons/Icons';

describe('IconButton', () => {
  it('renders without crashing', () => {
    const onClick = jest.fn();
    render(<IconButton onClick={onClick} icon={<HeartIcon />} />);
  });

  it('calls onClick when button is clicked', () => {
    const onClick = jest.fn();
    render(<IconButton onClick={onClick} icon={<HeartIcon />} />);

    fireEvent.click(screen.getByRole('button'));

    expect(onClick).toHaveBeenCalled();
  });

  it('renders with custom className', () => {
    const onClick = jest.fn();
    render(
      <IconButton
        onClick={onClick}
        icon={<HeartIcon />}
        className="custom-class"
      />
    );

    expect(screen.getByRole('button')).toHaveClass('custom-class');
  });

  it('renders with data-testid attribute', () => {
    const onClick = jest.fn();
    render(
      <IconButton onClick={onClick} icon={<HeartIcon />} dataTestId="test-id" />
    );

    expect(screen.getByTestId('test-id')).toBeInTheDocument();
  });

  it('renders with default class names', () => {
    const onClick = jest.fn();
    render(<IconButton onClick={onClick} icon={<HeartIcon />} />);

    expect(screen.getByRole('button')).toHaveClass(
      'absolute top-3 right-2.5 ml-auto inline-flex items-center rounded-lg bg-custom-secondary-dark p-1.5 text-sm text-custom-text-primary hover:bg-custom-secondary-dark-active hover:text-white'
    );
  });

  it('renders with custom class names', () => {
    const onClick = jest.fn();
    render(
      <IconButton
        onClick={onClick}
        icon={<HeartIcon />}
        className="bg-red-500 text-white"
      />
    );

    expect(screen.getByRole('button')).toHaveClass(
      'absolute top-3 right-2.5 ml-auto inline-flex items-center rounded-lg bg-red-500 text-white'
    );
  });

  it('renders with data-testid and custom class names', () => {
    const onClick = jest.fn();
    render(
      <IconButton
        onClick={onClick}
        icon={<HeartIcon />}
        dataTestId="test-id"
        className="bg-red-500 text-white"
      />
    );

    const button = screen.getByTestId('test-id');

    expect(button).toBeInTheDocument();
    expect(button).toHaveClass(
      'absolute top-3 right-2.5 ml-auto inline-flex items-center rounded-lg bg-red-500 text-white'
    );
  });
});
