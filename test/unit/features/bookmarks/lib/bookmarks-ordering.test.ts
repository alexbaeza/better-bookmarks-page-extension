import { beforeEach, describe, expect, it, vi } from 'vitest';

import { getBookmarksData } from '@/features/bookmarks/lib/bookmarks';
import { orderingService } from '@/features/bookmarks/lib/ordering-service';

// Mock the browser API factory
vi.mock('@/features/bookmarks/lib/browser/factory', () => ({
  createBookmarkAPI: vi.fn(() => ({
    getBookmarks: vi.fn().mockResolvedValue([]),
    getBookmarksTree: vi.fn().mockResolvedValue({
      folders: [
        {
          id: '1',
          title: 'Test Folder',
          children: [
            { id: 'a', title: 'Item A', url: 'http://example.com/a' },
            { id: 'b', title: 'Item B', url: 'http://example.com/b' },
            { id: 'c', title: 'Item C', url: 'http://example.com/c' },
            { id: 'd', title: 'Item D', url: 'http://example.com/d' },
          ],
        },
      ],
      uncategorized: undefined,
    }),
    createBookmark: vi.fn(),
    updateBookmark: vi.fn(),
    removeBookmark: vi.fn(),
    moveBookmark: vi.fn(),
    getBookmark: vi.fn(),
    searchBookmarks: vi.fn(),
  })),
}));

describe('getBookmarksData applies ordering', () => {
  beforeEach(() => {
    // Clear any prior ordering
    orderingService.initializeOrdering([]);
  });

  it('respects saved order after reorder', async () => {
    // Call once to initialize ordering from current mock tree
    const initial = await getBookmarksData();
    const folder = initial.folders.find((f) => (f.children?.length ?? 0) >= 3);
    expect(folder).toBeTruthy();
    if (!folder) return;

    // Simulate a reorder in the ordering service: move first to last
    if (folder.children) {
      orderingService.setOrder(
        folder.id,
        folder.children.map((c) => c.id)
      );
      orderingService.reorderItems(folder.id, 0, folder.children.length - 1);
    }

    const after = await getBookmarksData();
    const updatedFolder = after.folders.find((f) => f.id === folder.id);
    expect(updatedFolder).toBeTruthy();

    const expected = folder.children ? [...folder.children.slice(1).map((c) => c.id), folder.children[0].id] : [];
    expect(updatedFolder.children?.map((c) => c.id)).toEqual(expected);
  });
});
