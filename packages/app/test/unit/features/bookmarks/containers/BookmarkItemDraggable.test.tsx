import { describe, expect, it } from 'vitest';

describe('BookmarkItemDraggable', () => {
  it('should be importable', { timeout: 10000 }, async () => {
    const module = await import('../../../../../src/features/bookmarks/containers/BookmarkItemDraggable');
    expect(module).toBeDefined();
  });
});
