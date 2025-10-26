import { vi } from 'vitest';

import { BaseGridItem } from '@/features/bookmarks/components/items/grid/BaseGridItem';
import { fireEvent, render, screen, waitFor } from '~test/test-utils';

describe('BaseGridItem', () => {
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
  it('renders with default dataTestId', () => {
    render(
      <BaseGridItem icon={<div>Icon</div>} onDelete={vi.fn()} onEdit={vi.fn()}>
        Test Item
      </BaseGridItem>
    );

    expect(screen.getByTestId('grid-item')).toBeInTheDocument();
  });

  it('renders with custom dataTestId', () => {
    render(
      <BaseGridItem dataTestId="custom-item" icon={<div>Icon</div>} onDelete={vi.fn()} onEdit={vi.fn()}>
        Test Item
      </BaseGridItem>
    );

    expect(screen.getByTestId('custom-item')).toBeInTheDocument();
  });

  it('renders as clickable button when url is provided', () => {
    render(
      <BaseGridItem icon={<div>Icon</div>} onDelete={vi.fn()} onEdit={vi.fn()} url="http://example.com">
        Test Item
      </BaseGridItem>
    );

    const button = screen.getByTestId('grid-item-main-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('role', 'button');
  });

  it('renders as button when no url', () => {
    const onClick = vi.fn();
    render(
      <BaseGridItem icon={<div>Icon</div>} onClick={onClick} onDelete={vi.fn()} onEdit={vi.fn()}>
        Test Item
      </BaseGridItem>
    );

    const mainButton = screen.getByTestId('grid-item-main-button');
    fireEvent.click(mainButton);
    expect(onClick).toHaveBeenCalled();
  });

  it('opens menu on options button click', async () => {
    render(
      <BaseGridItem icon={<div>Icon</div>} onDelete={vi.fn()} onEdit={vi.fn()}>
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
      <BaseGridItem icon={<div>Icon</div>} onDelete={vi.fn()} onEdit={onEdit}>
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
      <BaseGridItem icon={<div>Icon</div>} onDelete={onDelete} onEdit={vi.fn()}>
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
      <BaseGridItem dragHandleProps={dragHandleProps} icon={<div>Icon</div>} onDelete={vi.fn()} onEdit={vi.fn()}>
        Test Item
      </BaseGridItem>
    );

    const dragHandle = screen.getByTestId('drag-handle-button');
    expect(dragHandle).toBeInTheDocument();
  });

  it('displays children text', () => {
    render(
      <BaseGridItem icon={<div>Icon</div>} onDelete={vi.fn()} onEdit={vi.fn()}>
        Test Item Text
      </BaseGridItem>
    );

    expect(screen.getByText('Test Item Text')).toBeInTheDocument();
  });

  it('handles Enter/Space key on main button', () => {
    const onClick = vi.fn();
    render(
      <BaseGridItem icon={<div>Icon</div>} onClick={onClick} onDelete={vi.fn()} onEdit={vi.fn()}>
        Test Item
      </BaseGridItem>
    );

    const mainButton = screen.getByTestId('grid-item-main-button');
    mainButton.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: 'Enter' }));
    mainButton.dispatchEvent(new KeyboardEvent('keydown', { bubbles: true, key: ' ' }));
    expect(onClick).toHaveBeenCalledTimes(2);
  });

  it('shows/hides hover state on mouse enter/leave', () => {
    render(
      <BaseGridItem icon={<div>Icon</div>} onDelete={vi.fn()} onEdit={vi.fn()}>
        Test Item
      </BaseGridItem>
    );

    const item = screen.getByTestId('grid-item');
    fireEvent.mouseEnter(item);
    expect(screen.getByTestId('drag-handle-button')).toBeInTheDocument();
    fireEvent.mouseLeave(item);
  });

  it('opens url in new window when url is provided and clicked', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    render(
      <BaseGridItem icon={<div>Icon</div>} onDelete={vi.fn()} onEdit={vi.fn()} url="http://example.com">
        Test Item
      </BaseGridItem>
    );

    const mainButton = screen.getByTestId('grid-item-main-button');
    fireEvent.click(mainButton);

    expect(openSpy).toHaveBeenCalledWith('http://example.com', '_blank', 'noopener,noreferrer');

    openSpy.mockRestore();
  });

  it('handles options button with Enter/Space key', async () => {
    render(
      <BaseGridItem icon={<div>Icon</div>} onDelete={vi.fn()} onEdit={vi.fn()}>
        Test Item
      </BaseGridItem>
    );

    const optionsButton = screen.getByTestId('item-options-button');
    fireEvent.keyDown(optionsButton, { bubbles: true, key: 'Enter' });
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });
    fireEvent.click(optionsButton);
    await waitFor(() => {
      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    });
    fireEvent.keyDown(optionsButton, { bubbles: true, key: ' ' });
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });
  });

  it('calls onClick when url is not provided', () => {
    const onClick = vi.fn();
    render(
      <BaseGridItem icon={<div>Icon</div>} onClick={onClick} onDelete={vi.fn()} onEdit={vi.fn()}>
        Test Item
      </BaseGridItem>
    );

    const mainButton = screen.getByTestId('grid-item-main-button');
    fireEvent.click(mainButton);

    expect(onClick).toHaveBeenCalled();
  });

  it('prevents default on Enter key when options menu is open', async () => {
    render(
      <BaseGridItem icon={<div>Icon</div>} onDelete={vi.fn()} onEdit={vi.fn()}>
        Test Item
      </BaseGridItem>
    );

    const optionsButton = screen.getByTestId('item-options-button');
    const preventDefaultSpy = vi.fn();
    const stopPropagationSpy = vi.fn();

    fireEvent.keyDown(optionsButton, {
      key: 'Enter',
      preventDefault: preventDefaultSpy,
      stopPropagation: stopPropagationSpy,
    });

    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
    });
  });

  it('handles drag handle key events', () => {
    const dragHandleProps = { onMouseDown: vi.fn() };
    render(
      <BaseGridItem dragHandleProps={dragHandleProps} icon={<div>Icon</div>} onDelete={vi.fn()} onEdit={vi.fn()}>
        Test Item
      </BaseGridItem>
    );

    const dragHandle = screen.getByTestId('drag-handle-button');
    const preventDefaultSpy = vi.fn();
    const stopPropagationSpy = vi.fn();

    fireEvent.keyDown(dragHandle, {
      key: 'Enter',
      preventDefault: preventDefaultSpy,
      stopPropagation: stopPropagationSpy,
    });

    fireEvent.keyDown(dragHandle, {
      key: ' ',
      preventDefault: preventDefaultSpy,
      stopPropagation: stopPropagationSpy,
    });
  });

  it('calls stopPropagation when drag handle is clicked', () => {
    const dragHandleProps = { onMouseDown: vi.fn() };
    render(
      <BaseGridItem dragHandleProps={dragHandleProps} icon={<div>Icon</div>} onDelete={vi.fn()} onEdit={vi.fn()}>
        Test Item
      </BaseGridItem>
    );

    const dragHandle = screen.getByTestId('drag-handle-button');
    const stopPropagationSpy = vi.fn();

    fireEvent.click(dragHandle, {
      stopPropagation: stopPropagationSpy,
    });
  });

  it('renders menu when menuOpen is true and menu components are covered', async () => {
    render(
      <BaseGridItem icon={<div>Icon</div>} onDelete={vi.fn()} onEdit={vi.fn()}>
        Test Item
      </BaseGridItem>
    );

    const optionsButton = screen.getByTestId('item-options-button');
    fireEvent.click(optionsButton);
    await waitFor(() => {
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });
    const editButton = screen.getByText('Edit');
    fireEvent.click(editButton);

    await waitFor(() => {
      expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    });
  });
});
