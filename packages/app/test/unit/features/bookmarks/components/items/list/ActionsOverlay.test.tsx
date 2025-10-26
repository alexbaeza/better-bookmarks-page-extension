import { vi } from 'vitest';

import { ActionsOverlay } from '@/features/bookmarks/components/items/list/ActionsOverlay';
import { fireEvent, render, screen, waitFor } from '~test/test-utils';

describe('ActionsOverlay', () => {
  beforeEach(() => {
    if (!document.getElementById('bookmark-menu-portal')) {
      const portal = document.createElement('div');
      portal.setAttribute('id', 'bookmark-menu-portal');
      document.body.appendChild(portal);
    }
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });
  it('does not render when not visible', () => {
    render(<ActionsOverlay onDelete={vi.fn()} onEdit={vi.fn()} visible={false} />);

    expect(screen.queryByTestId('item-options-button')).not.toBeInTheDocument();
  });

  it('renders when visible', () => {
    render(<ActionsOverlay onDelete={vi.fn()} onEdit={vi.fn()} visible />);

    expect(screen.getByTestId('item-options-button')).toBeInTheDocument();
  });

  it('opens menu on button click', async () => {
    render(<ActionsOverlay onDelete={vi.fn()} onEdit={vi.fn()} visible />);

    const button = screen.getByTestId('item-options-button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });
  });

  it('calls onEdit when edit is clicked', async () => {
    const onEdit = vi.fn();
    render(<ActionsOverlay onDelete={vi.fn()} onEdit={onEdit} visible />);

    const button = screen.getByTestId('item-options-button');
    fireEvent.click(button);

    const editItem = await screen.findByText('Edit');
    fireEvent.click(editItem);

    expect(onEdit).toHaveBeenCalled();
  });

  it('calls onDelete when delete is confirmed', async () => {
    const onDelete = vi.fn();
    render(<ActionsOverlay onDelete={onDelete} onEdit={vi.fn()} visible />);

    const button = screen.getByTestId('item-options-button');
    fireEvent.click(button);

    const deleteItem = await screen.findByText('Delete');
    fireEvent.click(deleteItem);

    await waitFor(() => {
      expect(screen.getByText('Confirm delete?')).toBeInTheDocument();
    });

    const confirmButton = screen.getByTestId('bookmark-delete-confirm-button');
    fireEvent.click(confirmButton);

    expect(onDelete).toHaveBeenCalled();
  });

  it('calls onMouseEnter and onMouseLeave', () => {
    const onMouseEnter = vi.fn();
    const onMouseLeave = vi.fn();

    render(<ActionsOverlay onDelete={vi.fn()} onEdit={vi.fn()} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} visible />);

    const overlay = screen.getByTestId('item-options-button').closest('div');
    fireEvent.mouseEnter(overlay);
    fireEvent.mouseLeave(overlay);

    expect(onMouseEnter).toHaveBeenCalled();
    expect(onMouseLeave).toHaveBeenCalled();
  });
});
