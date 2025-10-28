import { describe, expect, it } from 'vitest';

describe('BookmarkItemDraggable', () => {
  it('should be importable', async () => {
    const module = await import('../../../../../src/features/bookmarks/containers/BookmarkItemDraggable');
    expect(module).toBeDefined();
  });
});
