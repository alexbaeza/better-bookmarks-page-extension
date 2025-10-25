import { vi } from 'vitest';
import { when } from 'vitest-when';

vi.mock('@dnd-kit/sortable', () => ({
  useSortable: vi.fn(),
}));

import { viewModeAtom } from '@/app/providers/atoms';
import { DraggableBookmarkItem } from '@/features/bookmarks/components/items/DraggableBookmarkItem';
import { BookmarkDisplayMode } from '@/shared/types/ui';
import { render, screen } from '~test/test-utils';

import { useSortable } from '@dnd-kit/sortable';
import * as jotai from 'jotai';

type UseSortableReturn = {
  attributes: Record<string, unknown>;
  listeners: Record<string, unknown>;
  setNodeRef: (node: HTMLElement | null) => void;
  transform: { x: number; y: number; scaleX: number; scaleY: number } | null;
  transition: string | null;
  isDragging: boolean;
};

describe('DraggableBookmarkItem', () => {
  let spy: vi.SpyInstance;
  let mockUseSortable: vi.MockedFunction<typeof useSortable>;

  beforeEach(() => {
    vi.clearAllMocks();
    spy = vi.spyOn(jotai, 'useAtomValue');
    mockUseSortable = vi.mocked(useSortable);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders BookmarkItem when not ghost', () => {
    when(spy).calledWith(viewModeAtom).thenReturn(BookmarkDisplayMode.List);

    when(mockUseSortable)
      .calledWith({ id: '1' })
      .thenReturn({
        attributes: {},
        listeners: { onMouseDown: vi.fn() },
        setNodeRef: vi.fn(),
        transform: null,
        transition: null,
        isDragging: false,
      } as UseSortableReturn);

    const item = { id: '1', title: 'Test', url: 'http://example.com' };

    render(<DraggableBookmarkItem item={item} />);

    expect(screen.getByTestId('bookmark-item')).toBeInTheDocument();
  });

  it('renders SkeletonBookmarkItem when ghost', () => {
    when(spy).calledWith(viewModeAtom).thenReturn(BookmarkDisplayMode.Grid);

    when(mockUseSortable)
      .calledWith({ id: '1' })
      .thenReturn({
        attributes: {},
        listeners: {},
        setNodeRef: vi.fn(),
        transform: null,
        transition: null,
        isDragging: false,
      } as UseSortableReturn);

    const item = { id: '1', title: 'Test', url: 'http://example.com' };

    render(<DraggableBookmarkItem item={item} isGhost />);

    expect(screen.getByTestId('bookmark-skeleton-item')).toBeInTheDocument();
  });
});
