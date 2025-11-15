import { act, render, screen } from '@testing-library/react';
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

import { BookmarkMasonryColumn } from '@/features/bookmarks/components/layout/BookmarkMasonryColumn';
import type { IBookmarkItem } from '@/shared/types/bookmarks';

const moveMock = vi.fn();
const droppableProps: { onDrop?: (id: string, parentId: string, index: number) => void } = {};
const displayAreaProps: { folderContents?: IBookmarkItem[]; folderId?: string } = {};

vi.mock('@/features/bookmarks/hooks/useBookmarks', () => ({
  useBookmarks: () => ({
    searchTerm: 'term',
  }),
}));

vi.mock('@/features/bookmarks/hooks/useBookmarkActions', () => ({
  useBookmarkActions: () => ({
    move: moveMock,
  }),
}));

vi.mock('@/features/bookmarks/components/dnd/DroppableFolder', () => ({
  DroppableFolder: ({ children, onDrop }: { children: React.ReactNode; onDrop?: typeof droppableProps.onDrop }) => {
    droppableProps.onDrop = onDrop;
    return <div data-testid="droppable">{children}</div>;
  },
}));

vi.mock('@/features/bookmarks/components/BookmarkFolderContainer', () => ({
  BookmarkFolderContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="folder-container">{children}</div>
  ),
}));

vi.mock('@/features/bookmarks/containers/BookmarkDisplayArea', () => ({
  BookmarkDisplayArea: (props: { folderContents?: IBookmarkItem[]; folderId: string }) => {
    displayAreaProps.folderContents = props.folderContents;
    displayAreaProps.folderId = props.folderId;
    return <div data-testid="display-area" />;
  },
}));

const folderContents: IBookmarkItem[] = [
  { id: 'bookmark-1', title: 'Bookmark 1', url: 'https://example.com/1', dateAdded: Date.now() },
];

const folderId = 'folder-1';

const defaultRect: DOMRect = {
  x: 0,
  y: 0,
  width: 0,
  height: 250,
  top: 0,
  left: 0,
  right: 0,
  bottom: 250,
  toJSON: () => ({}),
};

let resizeObservers: Array<{
  callback: ResizeObserverCallback;
  observe: ReturnType<typeof vi.fn>;
  disconnect: ReturnType<typeof vi.fn>;
}> = [];
const originalResizeObserver = global.ResizeObserver;

beforeAll(() => {
  class MockResizeObserver {
    callback: ResizeObserverCallback;
    observe: ReturnType<typeof vi.fn>;
    disconnect: ReturnType<typeof vi.fn>;
    constructor(callback: ResizeObserverCallback) {
      this.callback = callback;
      this.observe = vi.fn();
      this.disconnect = vi.fn();
      resizeObservers.push({ callback, observe: this.observe, disconnect: this.disconnect });
    }
  }
  (global as any).ResizeObserver = MockResizeObserver;
});

afterAll(() => {
  global.ResizeObserver = originalResizeObserver;
});

beforeEach(() => {
  moveMock.mockReset();
  droppableProps.onDrop = undefined;
  displayAreaProps.folderContents = undefined;
  displayAreaProps.folderId = undefined;
  resizeObservers = [];
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('BookmarkMasonryColumn', () => {
  it('renders folder information and passes folder contents to BookmarkDisplayArea', () => {
    render(<BookmarkMasonryColumn folderContents={folderContents} folderId={folderId} name="My Folder" />);

    expect(screen.getByText('My Folder')).toBeInTheDocument();
    expect(screen.getByTestId('display-area')).toBeInTheDocument();
    expect(displayAreaProps.folderContents).toEqual(folderContents);
    expect(displayAreaProps.folderId).toBe(folderId);
  });

  it('moves dragged items to the current folder when dropped', async () => {
    moveMock.mockResolvedValue(undefined);

    render(<BookmarkMasonryColumn folderContents={folderContents} folderId={folderId} name="My Folder" />);

    await act(async () => {
      await droppableProps.onDrop?.('dragged-id', 'from-folder', 0);
    });

    expect(moveMock).toHaveBeenCalledWith('dragged-id', { parentId: folderId });
  });

  it('reports height via ResizeObserver and initial measurement', () => {
    const onHeightChange = vi.fn();
    const getBoundingClientRectSpy = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue(defaultRect);

    render(
      <BookmarkMasonryColumn
        folderContents={folderContents}
        folderId={folderId}
        name="My Folder"
        onHeightChange={onHeightChange}
      />
    );

    expect(onHeightChange).toHaveBeenCalledWith(folderId, 250);
    expect(resizeObservers).toHaveLength(1);

    act(() => {
      resizeObservers[0].callback(
        [
          {
            target: document.createElement('div'),
            contentRect: { ...defaultRect, height: 375 },
          } as unknown as ResizeObserverEntry,
        ],
        {} as ResizeObserver
      );
    });

    expect(onHeightChange).toHaveBeenCalledWith(folderId, 375);
    getBoundingClientRectSpy.mockRestore();
  });

  it('skips ResizeObserver wiring when onHeightChange is not provided', () => {
    const getBoundingClientRectSpy = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue(defaultRect);

    render(<BookmarkMasonryColumn folderContents={folderContents} folderId={folderId} name="My Folder" />);

    expect(resizeObservers).toHaveLength(0);
    getBoundingClientRectSpy.mockRestore();
  });

  it('falls back to getBoundingClientRect when ResizeObserver is unavailable', () => {
    const onHeightChange = vi.fn();
    const getBoundingClientRectSpy = vi
      .spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue(defaultRect);
    // @ts-expect-error force undefined
    global.ResizeObserver = undefined;

    render(
      <BookmarkMasonryColumn
        folderContents={folderContents}
        folderId={folderId}
        name="My Folder"
        onHeightChange={onHeightChange}
      />
    );

    expect(onHeightChange).toHaveBeenCalledWith(folderId, 250);

    getBoundingClientRectSpy.mockRestore();
  });
});
