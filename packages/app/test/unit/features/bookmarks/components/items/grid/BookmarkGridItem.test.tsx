import { describe, expect, it } from 'vitest';

describe('BookmarkGridItem', () => {
  it('should be importable', async () => {
    const module = await import('../../../../../../../src/features/bookmarks/components/items/grid/BookmarkGridItem');
    expect(module).toBeDefined();
  });
});
