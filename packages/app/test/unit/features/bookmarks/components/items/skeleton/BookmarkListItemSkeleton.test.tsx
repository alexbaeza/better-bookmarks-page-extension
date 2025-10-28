import { describe, expect, it } from 'vitest';

describe('BookmarkListItemSkeleton', () => {
  it('should be importable', async () => {
    const module = await import('../../../../../../../src/features/bookmarks/components/items/skeleton/BookmarkListItemSkeleton');
    expect(module).toBeDefined();
  });
});
