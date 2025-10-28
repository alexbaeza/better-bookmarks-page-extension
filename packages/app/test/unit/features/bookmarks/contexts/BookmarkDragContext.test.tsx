import { describe, expect, it } from 'vitest';

describe('BookmarkDragContext', () => {
  it('should be importable', async () => {
    const module = await import('../../../../../src/features/bookmarks/contexts/BookmarkDragContext');
    expect(module).toBeDefined();
  });

  it('should export BookmarkDragProvider', async () => {
    const module = await import('../../../../../src/features/bookmarks/contexts/BookmarkDragContext');
    expect(module).toHaveProperty('BookmarkDragProvider');
  });

  it('should export useBookmarkDragHandleProps', async () => {
    const module = await import('../../../../../src/features/bookmarks/contexts/BookmarkDragContext');
    expect(module).toHaveProperty('useBookmarkDragHandleProps');
  });
});
