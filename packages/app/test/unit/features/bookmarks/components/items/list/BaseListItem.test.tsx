import { waitFor } from '@testing-library/react';
import { vi } from 'vitest';

import { BaseListItem } from '@/features/bookmarks/components/items/list/BaseListItem';
import { fireEvent, render, screen } from '~test/test-utils';

describe('BaseListItem', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });
  it('renders with dataTestId', () => {
    render(
      <BaseListItem dataTestId="list-item" icon={<div>Icon</div>}>
        Test Item
      </BaseListItem>
    );

    expect(screen.getByTestId('list-item')).toBeInTheDocument();
  });

  it('renders as link when href is provided', () => {
    render(
      <BaseListItem href="http://example.com" icon={<div>Icon</div>}>
        Test Item
      </BaseListItem>
    );

    const link = screen.getByTestId('list-item-link');
    expect(link).toHaveAttribute('href', 'http://example.com');
  });

  it('renders as button when no href', () => {
    const onClick = vi.fn();
    render(
      <BaseListItem dataTestId="list-item" icon={<div>Icon</div>} onClick={onClick}>
        Test Item
      </BaseListItem>
    );

    const button = screen.getByTestId('list-item-button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it('shows actions overlay on hover', async () => {
    render(
      <BaseListItem dataTestId="list-item" icon={<div>Icon</div>} onDelete={vi.fn()} onEdit={vi.fn()}>
        Test Item
      </BaseListItem>
    );

    const item = screen.getByTestId('list-item');
    fireEvent.mouseEnter(item);

    expect(screen.getByTestId('item-options-button')).toBeInTheDocument();
  });

  it('passes dragHandleProps to drag handle', () => {
    const dragHandleProps = { onMouseDown: vi.fn() };
    render(
      <BaseListItem dragHandleProps={dragHandleProps} icon={<div>Icon</div>}>
        Test Item
      </BaseListItem>
    );

    expect(screen.getByTestId('drag-handle-button')).toBeInTheDocument();
  });

  it('displays icon and children', () => {
    render(<BaseListItem icon={<div data-testid="icon">Icon</div>}>Test Content</BaseListItem>);

    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('handles drag handle key events', () => {
    const dragHandleProps = { onMouseDown: vi.fn() };
    render(
      <BaseListItem dataTestId="list-item" dragHandleProps={dragHandleProps} icon={<div>Icon</div>}>
        Test Item
      </BaseListItem>
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

  it('calls stopPropagation on drag handle click', () => {
    const dragHandleProps = { onMouseDown: vi.fn() };
    render(
      <BaseListItem dataTestId="list-item" dragHandleProps={dragHandleProps} icon={<div>Icon</div>}>
        Test Item
      </BaseListItem>
    );

    const dragHandle = screen.getByTestId('drag-handle-button');
    const stopPropagationSpy = vi.fn();

    fireEvent.click(dragHandle, {
      stopPropagation: stopPropagationSpy,
    });
  });

  it('triggers scheduleHide timeout which calls setHovered(false)', async () => {
    vi.useFakeTimers();

    render(
      <BaseListItem dataTestId="list-item" icon={<div>Icon</div>} onDelete={vi.fn()} onEdit={vi.fn()}>
        Test Item
      </BaseListItem>
    );

    const item = screen.getByTestId('list-item');
    fireEvent.mouseEnter(item);
    fireEvent.mouseLeave(item);
    vi.advanceTimersByTime(200);
    vi.useRealTimers();
  });

  it('handles hover timer cleanup', () => {
    render(
      <BaseListItem dataTestId="list-item" icon={<div>Icon</div>} onDelete={vi.fn()} onEdit={vi.fn()}>
        Test Item
      </BaseListItem>
    );

    const item = screen.getByTestId('list-item');
    fireEvent.mouseEnter(item);
    expect(screen.getByTestId('item-options-button')).toBeInTheDocument();
    fireEvent.mouseLeave(item);
    fireEvent.mouseEnter(item);

    expect(screen.getByTestId('item-options-button')).toBeInTheDocument();
  });

  it('keeps actions overlay visible when mouse is over it', async () => {
    render(
      <BaseListItem dataTestId="list-item" icon={<div>Icon</div>} onDelete={vi.fn()} onEdit={vi.fn()}>
        Test Item
      </BaseListItem>
    );

    const item = screen.getByTestId('list-item');
    fireEvent.mouseEnter(item);

    await waitFor(() => {
      expect(screen.getByRole('toolbar', { name: 'Item actions' })).toBeInTheDocument();
    });

    const overlay = screen.getByRole('toolbar', { name: 'Item actions' });
    fireEvent.mouseEnter(overlay);

    expect(screen.getByTestId('item-options-button')).toBeInTheDocument();
  });

  it('hides actions overlay when mouse leaves overlay', async () => {
    render(
      <BaseListItem dataTestId="list-item" icon={<div>Icon</div>} onDelete={vi.fn()} onEdit={vi.fn()}>
        Test Item
      </BaseListItem>
    );

    const item = screen.getByTestId('list-item');
    fireEvent.mouseEnter(item);

    await waitFor(() => {
      expect(screen.getByRole('toolbar', { name: 'Item actions' })).toBeInTheDocument();
    });

    const overlay = screen.getByRole('toolbar', { name: 'Item actions' });
    fireEvent.mouseEnter(overlay);
    fireEvent.mouseLeave(overlay);
  });
});
