import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type React from 'react';
import { describe, expect, it, vi } from 'vitest';
import { when } from 'vitest-when';

import { BookmarkDisplayArea } from '@/features/bookmarks/containers/BookmarkDisplayArea';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { BookmarkDisplayMode } from '@/shared/types/ui';
import { AllProviders } from '~test/test-utils';

const mockUseAtomValue = vi.fn();
const mockUseAppStateContext = vi.fn();
const mockUseContainerWidth = vi.fn();

vi.mock('@/features/bookmarks/lib/bookmarks', () => {
  const reorderItemsById = vi.fn();
  return { reorderItemsById };
});

import { reorderItemsById } from '@/features/bookmarks/lib/bookmarks';

const mockReorderItemsById = vi.mocked(reorderItemsById);

vi.mock('jotai', () => ({
  atom: vi.fn((defaultValue: any) => ({ defaultValue })),
  useAtomValue: () => mockUseAtomValue(),
  Provider: ({ children }: { children: React.ReactNode }) => children,
}));

vi.mock('@/app/providers/app-state-context', () => ({
  useAppStateContext: () => mockUseAppStateContext(),
}));

vi.mock('@/features/bookmarks/hooks/useContainerWidth', () => ({
  useContainerWidth: () => mockUseContainerWidth(),
}));

vi.mock('@/features/bookmarks/components/dnd/DraggableBookmarkItem', () => ({
  DraggableBookmarkItem: ({
    item,
    onFolderClick,
  }: {
    item: IBookmarkItem;
    onFolderClick?: (item: IBookmarkItem) => void;
  }) => (
    <div data-folder-click={onFolderClick ? 'has-handler' : 'no-handler'} data-testid={`draggable-item-${item.id}`}>
      {item.title}
    </div>
  ),
}));

vi.mock('@/features/bookmarks/components/dnd/BookmarkGridItemDivider', () => ({
  BookmarkGridItemDivider: ({
    dataTestId,
    position,
    index,
    onReorder,
    _folderId,
    insertIndex,
  }: {
    dataTestId: string;
    position: string;
    index: number;
    onReorder: (itemId: string, toIndex: number) => void;
    _folderId: string;
    insertIndex: number;
  }) => (
    <div data-index={index} data-position={position} data-testid={dataTestId}>
      <button
        data-testid={`grid-divider-button-${insertIndex}`}
        onClick={() => {
          onReorder('item-1', 1);
        }}
        type="button"
      >
        Grid Divider
      </button>
    </div>
  ),
}));

vi.mock('@/features/bookmarks/components/dnd/BookmarkListItemDivider', () => ({
  BookmarkListItemDivider: ({
    dataTestId,
    position,
    index,
    onReorder,
    _folderId,
    insertIndex,
  }: {
    dataTestId: string;
    position: string;
    index: number;
    onReorder: (itemId: string, toIndex: number) => void;
    _folderId: string;
    insertIndex: number;
  }) => (
    <div data-index={index} data-position={position} data-testid={dataTestId}>
      <button
        data-testid={`list-divider-button-${insertIndex}`}
        onClick={() => {
          onReorder('item-1', 1);
        }}
        type="button"
      >
        List Divider
      </button>
    </div>
  ),
}));

vi.mock('@/shared/ui/List', () => ({
  List: ({
    children,
    renderDivider,
  }: {
    children: React.ReactNode;
    renderDivider: (props: { index: number; position: string; insertIndex: number }) => React.ReactNode;
  }) => (
    <div data-testid="list-container">
      {children}
      <div data-testid="list-divider-wrapper">{renderDivider({ index: 0, position: 'before', insertIndex: 1 })}</div>
    </div>
  ),
}));

vi.mock('@/shared/ui/Grid', () => ({
  Grid: ({
    children,
    renderDivider,
  }: {
    children: React.ReactNode;
    renderDivider: (props: { index: number; position: string; insertIndex: number }) => React.ReactNode;
  }) => (
    <div data-testid="grid-container">
      {children}
      <div data-testid="grid-divider-wrapper">{renderDivider({ index: 0, position: 'before', insertIndex: 1 })}</div>
    </div>
  ),
}));

describe('BookmarkDisplayArea', () => {
  const mockFolderContents: IBookmarkItem[] = [
    {
      id: 'item-1',
      title: 'Test Bookmark 1',
      url: 'https://example1.com',
      parentId: 'folder-1',
    },
    {
      id: 'item-2',
      title: 'Test Bookmark 2',
      url: 'https://example2.com',
      parentId: 'folder-1',
    },
  ];

  const defaultProps = {
    folderContents: mockFolderContents,
    folderId: 'folder-1',
  };

  beforeEach(() => {
    when(mockUseAtomValue).calledWith().thenReturn(BookmarkDisplayMode.Grid);
    when(mockUseAppStateContext).calledWith().thenReturn({ refreshBookmarks: vi.fn() });
    when(mockUseContainerWidth).calledWith().thenReturn({ containerWidth: 1200, containerRef: vi.fn() });
    when(mockReorderItemsById)
      .calledWith(expect.anything(), expect.anything(), expect.anything())
      .thenResolve(undefined);
  });

  it('renders grid container by default', () => {
    render(
      <AllProviders>
        <BookmarkDisplayArea {...defaultProps} />
      </AllProviders>
    );

    expect(screen.getByTestId('grid-container')).toBeInTheDocument();
  });

  it('renders list container when view mode is list', () => {
    when(mockUseAtomValue).calledWith().thenReturn(BookmarkDisplayMode.List);

    render(
      <AllProviders>
        <BookmarkDisplayArea {...defaultProps} />
      </AllProviders>
    );

    expect(screen.getByTestId('list-container')).toBeInTheDocument();
  });

  it('renders draggable items for each bookmark', () => {
    render(
      <AllProviders>
        <BookmarkDisplayArea {...defaultProps} />
      </AllProviders>
    );

    expect(screen.getByTestId('draggable-item-item-1')).toHaveTextContent('Test Bookmark 1');
    expect(screen.getByTestId('draggable-item-item-2')).toHaveTextContent('Test Bookmark 2');
  });

  it('passes folderId and index to DraggableBookmarkItem', () => {
    render(
      <AllProviders>
        <BookmarkDisplayArea {...defaultProps} />
      </AllProviders>
    );

    const draggableItem1 = screen.getByTestId('draggable-item-item-1');
    expect(draggableItem1).toBeInTheDocument();
  });

  it('calls onFolderClick when provided', () => {
    const onFolderClick = vi.fn();
    render(
      <AllProviders>
        <BookmarkDisplayArea {...defaultProps} onFolderClick={onFolderClick} />
      </AllProviders>
    );

    const item = screen.getByTestId('draggable-item-item-1');
    expect(item).toHaveAttribute('data-folder-click', 'has-handler');
  });

  it('handles empty folder contents', () => {
    render(
      <AllProviders>
        <BookmarkDisplayArea {...defaultProps} folderContents={[]} />
      </AllProviders>
    );

    expect(screen.getByTestId('grid-container')).toBeInTheDocument();
    expect(screen.queryByTestId('draggable-item-item-1')).toBeNull();
  });

  it('calls reorderItems when divider is used', async () => {
    when(mockReorderItemsById)
      .calledWith(expect.anything(), expect.anything(), expect.anything())
      .thenResolve(undefined);

    render(
      <AllProviders>
        <BookmarkDisplayArea {...defaultProps} />
      </AllProviders>
    );

    const gridDivider = screen.getByTestId('grid-divider-wrapper');
    expect(gridDivider).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    render(
      <AllProviders>
        <BookmarkDisplayArea {...defaultProps} />
      </AllProviders>
    );

    const container = document.querySelector('.flex.flex-col');
    expect(container).toBeInTheDocument();
    expect(container).toHaveAttribute('data-view-mode', 'grid');
  });

  it('uses container width from hook', () => {
    when(mockUseContainerWidth).calledWith().thenReturn({ containerWidth: 800, containerRef: vi.fn() });

    render(
      <AllProviders>
        <BookmarkDisplayArea {...defaultProps} />
      </AllProviders>
    );

    expect(mockUseContainerWidth).toHaveBeenCalled();
  });

  it('handles async refresh after reorder', async () => {
    const mockRefreshBookmarks = vi.fn();
    when(mockRefreshBookmarks).calledWith().thenResolve(undefined);
    when(mockUseAppStateContext).calledWith().thenReturn({ refreshBookmarks: mockRefreshBookmarks });

    render(
      <AllProviders>
        <BookmarkDisplayArea {...defaultProps} />
      </AllProviders>
    );

    expect(mockUseAppStateContext).toHaveBeenCalled();
  });

  it('passes correct props to grid dividers', () => {
    render(
      <AllProviders>
        <BookmarkDisplayArea {...defaultProps} />
      </AllProviders>
    );

    const gridDividerWrapper = screen.getByTestId('grid-divider-wrapper');
    expect(gridDividerWrapper).toBeInTheDocument();
  });

  it('passes correct props to list dividers', () => {
    when(mockUseAtomValue).calledWith().thenReturn(BookmarkDisplayMode.List);

    render(
      <AllProviders>
        <BookmarkDisplayArea {...defaultProps} />
      </AllProviders>
    );

    const listDividerWrapper = screen.getByTestId('list-divider-wrapper');
    expect(listDividerWrapper).toBeInTheDocument();
  });

  it('calls handleReorder when grid divider is clicked', async () => {
    const user = userEvent.setup();
    const mockRefreshBookmarks = vi.fn();
    when(mockReorderItemsById).calledWith('folder-1', 'item-1', 1).thenResolve(undefined);
    when(mockRefreshBookmarks).calledWith().thenResolve(undefined);
    when(mockUseAppStateContext).calledWith().thenReturn({ refreshBookmarks: mockRefreshBookmarks });

    render(
      <AllProviders>
        <BookmarkDisplayArea {...defaultProps} />
      </AllProviders>
    );

    const gridDividerButton = screen.getByTestId('grid-divider-button-1');
    await user.click(gridDividerButton);

    expect(mockReorderItemsById).toHaveBeenCalledWith('folder-1', 'item-1', 1);
    expect(mockUseAppStateContext).toHaveBeenCalled();
  });

  it('calls handleReorder when list divider is clicked', async () => {
    const user = userEvent.setup();
    const mockRefreshBookmarks = vi.fn();
    when(mockUseAtomValue).calledWith().thenReturn(BookmarkDisplayMode.List);
    when(mockReorderItemsById).calledWith('folder-1', 'item-1', 1).thenResolve(undefined);
    when(mockRefreshBookmarks).calledWith().thenResolve(undefined);
    when(mockUseAppStateContext).calledWith().thenReturn({ refreshBookmarks: mockRefreshBookmarks });

    render(
      <AllProviders>
        <BookmarkDisplayArea {...defaultProps} />
      </AllProviders>
    );

    const listDividerButton = screen.getByTestId('list-divider-button-1');
    await user.click(listDividerButton);

    expect(mockReorderItemsById).toHaveBeenCalledWith('folder-1', 'item-1', 1);
    expect(mockUseAppStateContext).toHaveBeenCalled();
  });

  it('applies correct CSS classes for grid and list modes', () => {
    const { rerender } = render(
      <AllProviders>
        <BookmarkDisplayArea {...defaultProps} />
      </AllProviders>
    );

    let container = document.querySelector('.flex.flex-col') as HTMLElement;
    expect(container).toHaveAttribute('data-view-mode', 'grid');

    when(mockUseAtomValue).calledWith().thenReturn(BookmarkDisplayMode.List);
    rerender(
      <AllProviders>
        <BookmarkDisplayArea {...defaultProps} />
      </AllProviders>
    );

    container = document.querySelector('.flex.flex-col') as HTMLElement;
    expect(container).toHaveAttribute('data-view-mode', 'list');
  });
});
