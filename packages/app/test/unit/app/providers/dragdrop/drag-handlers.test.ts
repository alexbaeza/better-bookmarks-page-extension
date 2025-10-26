import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createDragHandlers } from '@/app/providers/dragdrop/drag-handlers';
import { DROPPABLE_ROOT_FOLDER_PREFIX, DROPPABLE_SIDEBAR_FOLDER_PREFIX } from '@/config/dnd-constants';
import * as bookmarks from '@/features/bookmarks/lib/bookmarks';
import { findItemById, findParentOfItem } from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';

vi.mock('@/features/bookmarks/lib/bookmarks', async () => {
  const actual = await vi.importActual('@/features/bookmarks/lib/bookmarks');
  return { ...actual, moveItem: vi.fn(), reorderItems: vi.fn() };
});

vi.mock('@/features/bookmarks/lib/browser/utils/bookmark-tree-utils', () => ({
  findItemById: vi.fn(),
  findParentOfItem: vi.fn(),
}));

describe('createDragHandlers', () => {
  const mockSetActiveId = vi.fn();
  const mockRefreshBookmarks = vi.fn().mockResolvedValue(undefined);
  const rawFolders = [
    {
      id: 'root',
      title: 'Root',
      dateAdded: undefined,
      dateGroupModified: undefined,
      parentId: undefined,
      url: undefined,
      children: [
        {
          id: 'f1',
          title: 'Folder 1',
          dateAdded: undefined,
          dateGroupModified: undefined,
          parentId: 'root',
          url: undefined,
          children: [
            {
              id: 'b1',
              title: 'Bookmark 1',
              url: 'http://example.com',
              children: undefined,
              dateAdded: undefined,
              dateGroupModified: undefined,
              parentId: 'f1',
            },
            {
              id: 'b2',
              title: 'Bookmark 2',
              url: 'http://example.org',
              children: undefined,
              dateAdded: undefined,
              dateGroupModified: undefined,
              parentId: 'f1',
            },
          ],
        },
        { id: 'f2', title: 'Folder 2', children: [], dateAdded: undefined, dateGroupModified: undefined, parentId: 'root', url: undefined },
      ],
    },
  ];

  let handlers: ReturnType<typeof createDragHandlers>;

  beforeEach(() => {
    vi.clearAllMocks();
    handlers = createDragHandlers(rawFolders, mockRefreshBookmarks, mockSetActiveId);
  });

  it('calls setActiveId on drag start', () => {
    handlers.handleDragStart({ active: { id: 'b1' } } as any);
    expect(mockSetActiveId).toHaveBeenCalledWith('b1');
  });

  it('clears active ID even when no active or over', async () => {
    await handlers.handleDragEnd({ active: null, over: null } as any);
    expect(mockSetActiveId).toHaveBeenCalledWith(null);
  });

  it('clears active ID when no over element', async () => {
    await handlers.handleDragEnd({ active: { id: '1' }, over: null } as any);
    expect(mockSetActiveId).toHaveBeenCalledWith(null);
  });

  it('moves folder when dropped into a different folder container', async () => {
    const mockFolder = { id: 'f1', title: 'Folder 1', children: [], dateAdded: undefined, dateGroupModified: undefined, parentId: 'root', url: undefined };
    vi.mocked(findItemById).mockReturnValue(mockFolder as any);
    vi.mocked(findParentOfItem).mockReturnValue({
      id: 'root',
      children: [{ id: 'f1' }, { id: 'f2' }],
      dateAdded: undefined,
      dateGroupModified: undefined,
      parentId: undefined,
      title: 'Root',
      url: undefined,
    });

    const overId = `${DROPPABLE_ROOT_FOLDER_PREFIX}f2`;

    await handlers.handleDragEnd({
      active: { id: 'f1' },
      over: { id: overId },
    } as any);

    expect(bookmarks.moveItem).toHaveBeenCalledWith('f1', 'root', 'f2', 0);
    expect(mockRefreshBookmarks).toHaveBeenCalled();
  });

  it('does nothing if folder dropped in same folder container', async () => {
    const mockFolder = { id: 'f1', title: 'Folder 1', children: [], dateAdded: undefined, dateGroupModified: undefined, parentId: 'root', url: undefined };
    vi.mocked(findItemById).mockReturnValue(mockFolder as any);
    vi.mocked(findParentOfItem).mockReturnValue({
      id: 'root',
      children: [{ id: 'f1' }, { id: 'f2' }],
      dateAdded: undefined,
      dateGroupModified: undefined,
      parentId: undefined,
      title: 'Root',
      url: undefined,
    });

    const overId = `${DROPPABLE_ROOT_FOLDER_PREFIX}root`;
    await handlers.handleDragEnd({
      active: { id: 'f1' },
      over: { id: overId },
    } as any);

    expect(bookmarks.moveItem).not.toHaveBeenCalled();
  });

  it('reorders folders within the same parent', async () => {
    const mockFolder = { id: 'f1', title: 'Folder 1', children: [], dateAdded: undefined, dateGroupModified: undefined, parentId: 'root', url: undefined };
    vi.mocked(findItemById).mockReturnValue(mockFolder as any);
    vi.mocked(findParentOfItem).mockReturnValue({
      id: 'root',
      children: [{ id: 'f1' }, { id: 'f2' }],
      dateAdded: undefined,
      dateGroupModified: undefined,
      parentId: undefined,
      title: 'Root',
      url: undefined,
    });

    await handlers.handleDragEnd({
      active: { id: 'f1' },
      over: { id: 'f2' },
    } as any);

    expect(bookmarks.reorderItems).toHaveBeenCalledWith('root', 0, 1);
    expect(mockRefreshBookmarks).toHaveBeenCalled();
  });

  it('moves bookmark when dropped into a different folder container', async () => {
    const mockBookmark = {
      id: 'b1',
      title: 'Bookmark 1',
      url: 'http://example.com',
      children: undefined,
      dateAdded: undefined,
      dateGroupModified: undefined,
      parentId: 'f1',
    };
    vi.mocked(findItemById).mockReturnValue(mockBookmark as any);
    vi.mocked(findParentOfItem).mockReturnValue({
      id: 'f1',
      children: [{ id: 'b1' }, { id: 'b2' }],
      dateAdded: undefined,
      dateGroupModified: undefined,
      parentId: undefined,
      title: 'Folder 1',
      url: undefined,
    });

    const overId = `${DROPPABLE_SIDEBAR_FOLDER_PREFIX}f2`;

    await handlers.handleDragEnd({
      active: { id: 'b1' },
      over: { id: overId },
    } as any);

    expect(bookmarks.moveItem).toHaveBeenCalledWith('b1', 'f1', 'f2', 0);
    expect(mockRefreshBookmarks).toHaveBeenCalled();
  });

  it('reorders bookmarks within same folder', async () => {
    const mockBookmark = {
      id: 'b1',
      title: 'Bookmark 1',
      url: 'http://example.com',
      children: undefined,
      dateAdded: undefined,
      dateGroupModified: undefined,
      parentId: 'f1',
    };
    vi.mocked(findItemById).mockReturnValue(mockBookmark as any);
    vi.mocked(findParentOfItem).mockReturnValue({
      id: 'f1',
      children: [{ id: 'b1' }, { id: 'b2' }],
      dateAdded: undefined,
      dateGroupModified: undefined,
      parentId: undefined,
      title: 'Folder 1',
      url: undefined,
    });

    await handlers.handleDragEnd({
      active: { id: 'b1' },
      over: { id: 'b2' },
    } as any);

    expect(bookmarks.reorderItems).toHaveBeenCalledWith('f1', 0, 1);
    expect(mockRefreshBookmarks).toHaveBeenCalled();
  });

  it('does nothing if bookmark dropped in same folder', async () => {
    const mockBookmark = {
      id: 'b1',
      title: 'Bookmark 1',
      url: 'http://example.com',
      children: undefined,
      dateAdded: undefined,
      dateGroupModified: undefined,
      parentId: 'f1',
    };
    vi.mocked(findItemById).mockReturnValue(mockBookmark as any);
    vi.mocked(findParentOfItem).mockReturnValue({
      id: 'f1',
      children: [{ id: 'b1' }],
      dateAdded: undefined,
      dateGroupModified: undefined,
      parentId: undefined,
      title: 'Folder 1',
      url: undefined,
    });

    const overId = `${DROPPABLE_ROOT_FOLDER_PREFIX}f1`;
    await handlers.handleDragEnd({
      active: { id: 'b1' },
      over: { id: overId },
    } as any);

    expect(bookmarks.moveItem).not.toHaveBeenCalled();
    expect(bookmarks.reorderItems).not.toHaveBeenCalled();
  });
});
