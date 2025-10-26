// biome-ignore lint/correctness/noUnusedImports: required for mocking
import { useSortable } from '@dnd-kit/sortable';
import { viewModeAtom } from '@/app/providers/atoms';
import { DraggableBookmarkItem } from '@/features/bookmarks/components/items/DraggableBookmarkItem';
import { BookmarkDisplayMode } from '@/shared/types/ui';
import { render, screen } from '~test/test-utils';

vi.mock('@dnd-kit/sortable', () => ({
  useSortable: vi.fn(),
}));

describe('DraggableBookmarkItem', () => {
  const mockItem = {
    id: '1',
    title: 'Test Bookmark',
    url: 'http://example.com',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    const mockUseSortable = vi.mocked(useSortable);
    mockUseSortable.mockReturnValue({
      attributes: {} as any,
      isDragging: false,
      listeners: { onMouseDown: vi.fn() },
      setNodeRef: vi.fn(),
      transform: null,
      transition: undefined,
    } as unknown as ReturnType<typeof useSortable>);
  });

  it('renders BookmarkItem when not ghost', () => {
    render(<DraggableBookmarkItem item={mockItem} />, {
      initialValues: [[viewModeAtom, BookmarkDisplayMode.List]],
    });

    expect(screen.getByTestId('bookmark-item-1')).toBeInTheDocument();
  });

  it('renders SkeletonBookmarkItem when ghost', () => {
    render(<DraggableBookmarkItem isGhost item={mockItem} />, {
      initialValues: [[viewModeAtom, BookmarkDisplayMode.Grid]],
    });

    expect(screen.getByTestId('bookmark-skeleton-item')).toBeInTheDocument();
  });
});
