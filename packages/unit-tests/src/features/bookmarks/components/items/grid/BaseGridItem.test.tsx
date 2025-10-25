import { vi } from 'vitest';

import { BaseGridItem } from '@/features/bookmarks/components/items/grid/BaseGridItem';
import { fireEvent, render, screen, waitFor } from '~test/test-utils';

describe('BaseGridItem', () => {
  beforeEach(() => {
    const portalRoot = document.createElement('div');
    portalRoot.id = 'bookmark-menu-portal';
    document.body.appendChild(portalRoot);
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });
  it('renders with default dataTestId', () => {
    render(
      <BaseGridItem icon={<div>Icon</div>} onEdit={vi.fn()} onDelete={vi.fn()}>
        Test Item
      </BaseGridItem>
    );

    expect(screen.getByTestId('grid-item')).toBeInTheDocument();
  });

  it('renders with custom dataTestId', () => {
    render(
      <BaseGridItem dataTestId="custom-item" icon={<div>Icon</div>} onEdit={vi.fn()} onDelete={vi.fn()}>
        Test Item
      </BaseGridItem>
    );

    expect(screen.getByTestId('custom-item')).toBeInTheDocument();
  });

  it('renders as clickable button when url is provided', () => {
    render(
      <BaseGridItem icon={<div>Icon</div>} url="http://example.com" onEdit={vi.fn()} onDelete={vi.fn()}>
        Test Item
      </BaseGridItem>
    );

    const button = screen.getByRole('button', { name: /test item/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('role', 'button');
  });

  it('renders as button when no url', () => {
    const onClick = vi.fn();
    render(
      <BaseGridItem icon={<div>Icon</div>} onClick={onClick} onEdit={vi.fn()} onDelete={vi.fn()}>
        Test Item
      </BaseGridItem>
    );

    // Click the main clickable area (not the options button)
    const mainButton = screen.getByRole('button', { name: /test item/i });
    fireEvent.click(mainButton);
    expect(onClick).toHaveBeenCalled();
  });

  it('opens menu on options button click', async () => {
    render(
      <BaseGridItem icon={<div>Icon</div>} onEdit={vi.fn()} onDelete={vi.fn()}>
        Test Item
      </BaseGridItem>
    );

    const optionsButton = screen.getByTestId('item-options-button');
    fireEvent.click(optionsButton);

    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });
  });

  it('calls onEdit when edit menu item is clicked', async () => {
    const onEdit = vi.fn();
    render(
      <BaseGridItem icon={<div>Icon</div>} onEdit={onEdit} onDelete={vi.fn()}>
        Test Item
      </BaseGridItem>
    );

    const optionsButton = screen.getByTestId('item-options-button');
    fireEvent.click(optionsButton);

    const editButton = await screen.findByText('Edit');
    fireEvent.click(editButton);

    expect(onEdit).toHaveBeenCalled();
  });

  it('calls onDelete when delete is confirmed', async () => {
    const onDelete = vi.fn();
    render(
      <BaseGridItem icon={<div>Icon</div>} onEdit={vi.fn()} onDelete={onDelete}>
        Test Item
      </BaseGridItem>
    );

    const optionsButton = screen.getByTestId('item-options-button');
    fireEvent.click(optionsButton);

    const deleteButton = await screen.findByText('Delete');
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.getByText('Confirm delete?')).toBeInTheDocument();
    });

    const confirmButton = screen.getByTestId('bookmark-delete-confirm-button');
    fireEvent.click(confirmButton);

    expect(onDelete).toHaveBeenCalled();
  });

  it('passes dragHandleProps to drag handle', () => {
    const dragHandleProps = { onMouseDown: vi.fn() };
    render(
      <BaseGridItem icon={<div>Icon</div>} onEdit={vi.fn()} onDelete={vi.fn()} dragHandleProps={dragHandleProps}>
        Test Item
      </BaseGridItem>
    );

    const dragHandle = screen.getByTestId('drag-handle-button');
    expect(dragHandle).toBeInTheDocument();
  });

  it('displays children text', () => {
    render(
      <BaseGridItem icon={<div>Icon</div>} onEdit={vi.fn()} onDelete={vi.fn()}>
        Test Item Text
      </BaseGridItem>
    );

    expect(screen.getByText('Test Item Text')).toBeInTheDocument();
  });
});
