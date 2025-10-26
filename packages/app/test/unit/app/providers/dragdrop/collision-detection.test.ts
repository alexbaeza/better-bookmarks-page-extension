import { pointerWithin } from '@dnd-kit/core';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createConstrainedCollisionDetection } from '@/app/providers/dragdrop/collision-detection';
import { DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX, DROPPABLE_ROOT_FOLDER_PREFIX, DROPPABLE_SIDEBAR_FOLDER_PREFIX } from '@/config/dnd-constants';
import { findItemById, findParentOfItem } from '@/features/bookmarks/lib/browser/utils/bookmark-tree-utils';

vi.mock('@dnd-kit/core', () => ({
  pointerWithin: vi.fn(),
}));

vi.mock('@/features/bookmarks/lib/browser/utils/bookmark-tree-utils', () => ({
  findItemById: vi.fn(),
  findParentOfItem: vi.fn(),
}));

describe('createConstrainedCollisionDetection', () => {
  const mockPointerResult = [{ id: 'drop-1' }];
  const active = { id: '1' };
  const collisionRect = { x: 0, y: 0, width: 10, height: 10 };
  const droppableRects = {};
  const pointerCoordinates = { x: 50, y: 50 };

  const folders = [
    {
      id: 'root',
      title: 'Root',
      dateAdded: undefined,
      dateGroupModified: undefined,
      parentId: undefined,
      url: undefined,
      children: [
        {
          id: '1',
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
              parentId: '1',
            },
          ],
        },
        {
          id: '2',
          title: 'Folder 2',
          dateAdded: undefined,
          dateGroupModified: undefined,
          parentId: 'root',
          url: undefined,
          children: [],
        },
      ],
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(pointerWithin).mockReturnValue(mockPointerResult as any);
  });

  it('calls pointerWithin with filtered droppable containers for bookmarks', () => {
    vi.mocked(findItemById).mockReturnValue({
      id: 'b1',
      title: 'Bookmark 1',
      url: 'http://example.com',
      children: undefined,
      dateAdded: undefined,
      dateGroupModified: undefined,
      parentId: '1',
    });
    vi.mocked(findParentOfItem).mockReturnValue({
      id: '1',
      children: [{ id: 'b1' }, { id: 'b2' }],
      dateAdded: undefined,
      dateGroupModified: undefined,
      parentId: undefined,
      title: 'Folder 1',
      url: undefined,
    });

    const collisionDetection = createConstrainedCollisionDetection(folders);
    const droppableContainers = [
      { id: `${DROPPABLE_ROOT_FOLDER_PREFIX}root` },
      { id: `${DROPPABLE_SIDEBAR_FOLDER_PREFIX}1` },
      { id: `${DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX}2` },
    ];

    const result = collisionDetection({
      active,
      collisionRect,
      droppableRects,
      droppableContainers: droppableContainers as any,
      pointerCoordinates,
    } as any);

    expect(pointerWithin).toHaveBeenCalledTimes(1);
    expect(result).toBe(mockPointerResult);
  });

  it('filters out same-folder droppable containers for folders', () => {
    const mockFolder = { id: '1', title: 'Folder 1', children: [], dateAdded: undefined, dateGroupModified: undefined, parentId: 'root', url: undefined };
    vi.mocked(findItemById).mockReturnValue(mockFolder as any);
    vi.mocked(findParentOfItem).mockReturnValue({
      id: 'root',
      children: [{ id: '1' }, { id: '2' }],
      dateAdded: undefined,
      dateGroupModified: undefined,
      parentId: undefined,
      title: 'Root',
      url: undefined,
    });

    const collisionDetection = createConstrainedCollisionDetection(folders);
    const droppableContainers = [
      { id: `${DROPPABLE_ROOT_FOLDER_PREFIX}root` }, // same folder — should be filtered out
      { id: `${DROPPABLE_SIDEBAR_FOLDER_PREFIX}other` }, // allowed
      { id: `${DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX}root` }, // same folder — should be filtered out
      { id: '2' }, // sibling — allowed
    ];

    collisionDetection({
      active,
      collisionRect,
      droppableRects,
      droppableContainers: droppableContainers as any,
      pointerCoordinates,
    } as any);

    const filteredContainers = vi.mocked(pointerWithin).mock.calls[0][0].droppableContainers.map((c: any) => c.id);

    expect(filteredContainers).toContain('2');
    expect(filteredContainers).toContain(`${DROPPABLE_SIDEBAR_FOLDER_PREFIX}other`);
    expect(filteredContainers).not.toContain(`${DROPPABLE_ROOT_FOLDER_PREFIX}root`);
  });

  it('allows bookmarks to be dropped in different folders', () => {
    const mockBookmark = {
      id: 'b1',
      title: 'Bookmark 1',
      url: 'http://example.com',
      children: undefined,
      dateAdded: undefined,
      dateGroupModified: undefined,
      parentId: '1',
    };
    vi.mocked(findItemById).mockReturnValue(mockBookmark as any);
    vi.mocked(findParentOfItem).mockReturnValue({
      id: '1',
      children: [{ id: 'b1' }],
      dateAdded: undefined,
      dateGroupModified: undefined,
      parentId: undefined,
      title: 'Folder 1',
      url: undefined,
    });

    const collisionDetection = createConstrainedCollisionDetection(folders);
    const droppableContainers = [
      { id: `${DROPPABLE_ROOT_FOLDER_PREFIX}root` },
      { id: `${DROPPABLE_SIDEBAR_FOLDER_PREFIX}2` },
      { id: `${DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX}1` },
    ];

    collisionDetection({
      active,
      collisionRect,
      droppableRects,
      droppableContainers: droppableContainers as any,
      pointerCoordinates,
    } as any);

    const filteredContainers = vi.mocked(pointerWithin).mock.calls[0][0].droppableContainers.map((c: any) => c.id);

    // should exclude same folder (fly-out with "1") but include others
    expect(filteredContainers).toContain(`${DROPPABLE_ROOT_FOLDER_PREFIX}root`);
    expect(filteredContainers).toContain(`${DROPPABLE_SIDEBAR_FOLDER_PREFIX}2`);
    expect(filteredContainers).not.toContain(`${DROPPABLE_FLY_OUT_SIDEBAR_FOLDER_PREFIX}1`);
  });

  it('returns pointerWithin result when no item found', () => {
    vi.mocked(findItemById).mockReturnValue(null);
    vi.mocked(findParentOfItem).mockReturnValue(null);

    const collisionDetection = createConstrainedCollisionDetection(folders);

    const result = collisionDetection({
      active: { id: 'unknown' },
      collisionRect,
      droppableRects,
      droppableContainers: [],
      pointerCoordinates,
    } as any);

    expect(result).toBe(mockPointerResult);
  });
});
