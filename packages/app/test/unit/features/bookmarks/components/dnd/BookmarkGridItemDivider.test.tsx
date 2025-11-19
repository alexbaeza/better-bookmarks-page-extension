import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BookmarkGridItemDivider } from '@/features/bookmarks/components/dnd/BookmarkGridItemDivider';
import { AllProviders } from '~test/test-utils';

let mockUseDrop = vi.fn();
let mockOnReorder: ReturnType<typeof vi.fn<() => void>>;

vi.mock('react-dnd', () => ({
  useDrop: (config: unknown) => mockUseDrop(config),
}));

describe('BookmarkGridItemDivider', () => {
  beforeEach(() => {
    mockUseDrop = vi.fn(() => [
      { isOver: false, draggingItem: null },
      vi.fn(), // drop function
    ]);
    mockOnReorder = vi.fn<() => void>();
  });

  it('should render without crashing', () => {
    const { container } = render(
      <AllProviders>
        <BookmarkGridItemDivider folderId="folder-1" insertIndex={0} onReorder={mockOnReorder} />
      </AllProviders>
    );

    const divider = container.querySelector('.absolute');
    expect(divider).toBeInTheDocument();
  });

  it('should apply dataTestId', () => {
    render(
      <AllProviders>
        <BookmarkGridItemDivider
          dataTestId="test-divider"
          folderId="folder-1"
          insertIndex={0}
          onReorder={mockOnReorder}
        />
      </AllProviders>
    );

    expect(screen.getByTestId('test-divider')).toBeInTheDocument();
  });

  it('should show indicator when dragging over', () => {
    mockUseDrop.mockReturnValueOnce([
      {
        isOver: true,
        draggingItem: {
          id: 'item-1',
          folderId: 'folder-1',
          index: 0,
          item: { id: 'item-1', title: 'Test' },
        },
      },
      vi.fn(), // drop function
    ]);

    render(
      <AllProviders>
        <BookmarkGridItemDivider folderId="folder-1" insertIndex={0} onReorder={mockOnReorder} />
      </AllProviders>
    );

    expect(screen.getByTestId('reorder-divider-indicator-grid')).toBeInTheDocument();
  });

  it('should not show indicator when not dragging over', () => {
    render(
      <AllProviders>
        <BookmarkGridItemDivider folderId="folder-1" insertIndex={0} onReorder={mockOnReorder} />
      </AllProviders>
    );

    expect(screen.queryByTestId('reorder-divider-indicator-grid')).not.toBeInTheDocument();
  });
});
