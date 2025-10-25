import { vi } from 'vitest';

import { BaseListItem } from '@/features/bookmarks/components/items/list/BaseListItem';
import { fireEvent, render, screen } from '~test/test-utils';

describe('BaseListItem', () => {
  beforeEach(() => {
    const portalRoot = document.createElement('div');
    portalRoot.id = 'bookmark-menu-portal';
    document.body.appendChild(portalRoot);
  });

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
      <BaseListItem icon={<div>Icon</div>} href="http://example.com">
        Test Item
      </BaseListItem>
    );

    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', 'http://example.com');
  });

  it('renders as button when no href', () => {
    const onClick = vi.fn();
    render(
      <BaseListItem dataTestId="list-item" icon={<div>Icon</div>} onClick={onClick}>
        Test Item
      </BaseListItem>
    );

    const button = screen.getByTestId('list-item').querySelector('button:not([data-testid="drag-handle-button"])');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });

  it('shows actions overlay on hover', async () => {
    render(
      <BaseListItem dataTestId="list-item" icon={<div>Icon</div>} onEdit={vi.fn()} onDelete={vi.fn()}>
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
      <BaseListItem icon={<div>Icon</div>} dragHandleProps={dragHandleProps}>
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
});
