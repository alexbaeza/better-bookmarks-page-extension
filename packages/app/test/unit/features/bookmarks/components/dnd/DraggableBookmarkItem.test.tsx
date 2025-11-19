import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DraggableBookmarkItem } from '@/features/bookmarks/components/dnd/DraggableBookmarkItem';
import { AllProviders } from '~test/test-utils';

let mockUseDrag = vi.fn();
let mockUseDrop = vi.fn();
let mockMove: ReturnType<typeof vi.fn>;

vi.mock('react-dnd', () => ({
  useDrag: (config: unknown) => mockUseDrag(config),
  useDrop: (config: unknown) => mockUseDrop(config),
}));

vi.mock('@/features/bookmarks/hooks/useBookmarkActions', () => ({
  useBookmarkActions: () => ({
    move: mockMove,
  }),
}));

vi.mock('@/features/bookmarks/components/BookmarkItem', () => ({
  BookmarkItem: ({ item }: { item: any }) => <div data-testid="bookmark-item">{item.title}</div>,
}));

describe('DraggableBookmarkItem', () => {
  beforeEach(() => {
    mockUseDrag = vi.fn(() => [
      { isDragging: false },
      vi.fn(), // drag function
    ]);
    mockUseDrop = vi.fn(() => [
      { isOver: false },
      vi.fn(), // drop function
    ]);
    mockMove = vi.fn();
  });

  it('should render without crashing', () => {
    const item = {
      id: '1',
      title: 'Test Bookmark',
      url: 'https://example.com',
    };

    render(
      <AllProviders>
        <DraggableBookmarkItem folderId="folder-1" index={0} item={item} />
      </AllProviders>
    );

    expect(screen.getByTestId('draggable-1')).toBeInTheDocument();
  });

  it('should render BookmarkItem', () => {
    const item = {
      id: '1',
      title: 'Test Bookmark',
      url: 'https://example.com',
    };

    render(
      <AllProviders>
        <DraggableBookmarkItem folderId="folder-1" index={0} item={item} />
      </AllProviders>
    );

    expect(screen.getByTestId('bookmark-item')).toBeInTheDocument();
  });
});
