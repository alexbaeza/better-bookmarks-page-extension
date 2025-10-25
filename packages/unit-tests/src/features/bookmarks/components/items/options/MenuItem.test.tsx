import { fireEvent, render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { MenuItem } from '@/features/bookmarks/components/items/options/MenuItem';

describe('MenuItem', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders simple menu item', () => {
    const onClick = vi.fn();

    render(<MenuItem onClick={onClick}>Test Item</MenuItem>);

    const button = screen.getByRole('button', { name: /test item/i });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it('renders with icon', () => {
    const onClick = vi.fn();

    render(
      <MenuItem icon={<span>Icon</span>} onClick={onClick}>
        Test Item
      </MenuItem>
    );

    expect(screen.getByText('Icon')).toBeInTheDocument();
    expect(screen.getByText('Test Item')).toBeInTheDocument();
  });

  it('renders confirmable menu item', () => {
    const onConfirm = vi.fn();

    render(<MenuItem onConfirm={onConfirm}>Delete Item</MenuItem>);

    const button = screen.getByRole('button', { name: /delete item/i });
    fireEvent.click(button);

    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByTestId('confirm-button')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
  });

  it('calls onConfirm when confirm button is clicked', () => {
    const onConfirm = vi.fn();

    render(<MenuItem onConfirm={onConfirm}>Delete Item</MenuItem>);

    const button = screen.getByRole('button', { name: /delete item/i });
    fireEvent.click(button);

    const confirmButton = screen.getByTestId('confirm-button');
    fireEvent.click(confirmButton);

    expect(onConfirm).toHaveBeenCalled();
  });

  it('calls onCancel when cancel button is clicked', () => {
    const onCancel = vi.fn();

    render(
      <MenuItem onConfirm={vi.fn()} onCancel={onCancel}>
        Delete Item
      </MenuItem>
    );

    const button = screen.getByRole('button', { name: /delete item/i });
    fireEvent.click(button);

    const cancelButton = screen.getByTestId('cancel-button');
    fireEvent.click(cancelButton);

    expect(onCancel).toHaveBeenCalled();
  });

  it('closes confirm on outside click', () => {
    render(<MenuItem onConfirm={vi.fn()}>Delete Item</MenuItem>);

    const button = screen.getByRole('button', { name: /delete item/i });
    fireEvent.click(button);

    expect(screen.getByText('Are you sure?')).toBeInTheDocument();

    fireEvent.mouseDown(document.body);

    expect(screen.queryByText('Are you sure?')).not.toBeInTheDocument();
  });

  it('uses custom confirm label', () => {
    render(
      <MenuItem onConfirm={vi.fn()} confirmLabel="Really delete?">
        Delete Item
      </MenuItem>
    );

    const button = screen.getByRole('button', { name: /delete item/i });
    fireEvent.click(button);

    expect(screen.getByText('Really delete?')).toBeInTheDocument();
  });
});
