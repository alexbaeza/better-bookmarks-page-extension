import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BookmarkListItemDivider } from '@/features/bookmarks/components/dnd/BookmarkListItemDivider';
import { AllProviders } from '~test/test-utils';

const mockUseDrop = vi.fn();
const mockOnReorder = vi.fn();

vi.mock('react-dnd', () => ({
  useDrop: () => mockUseDrop(),
}));

describe('BookmarkListItemDivider', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseDrop.mockReturnValue([
      { isOver: false, draggingItem: null },
      vi.fn(), // drop function
    ]);
  });

  it('should render without crashing', () => {
    const { container } = render(
      <AllProviders>
        <BookmarkListItemDivider folderId="folder-1" insertIndex={0} onReorder={mockOnReorder} />
      </AllProviders>
    );

    const divider = container.querySelector('.relative');
    expect(divider).toBeInTheDocument();
  });

  it('should apply dataTestId', () => {
    render(
      <AllProviders>
        <BookmarkListItemDivider
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
    mockUseDrop.mockReturnValue([
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
        <BookmarkListItemDivider folderId="folder-1" insertIndex={0} onReorder={mockOnReorder} />
      </AllProviders>
    );

    expect(screen.getByTestId('reorder-divider-indicator-list')).toBeInTheDocument();
  });

  it('should not show indicator when not dragging over', () => {
    render(
      <AllProviders>
        <BookmarkListItemDivider folderId="folder-1" insertIndex={0} onReorder={mockOnReorder} />
      </AllProviders>
    );

    expect(screen.queryByTestId('reorder-divider-indicator-list')).not.toBeInTheDocument();
  });
});
