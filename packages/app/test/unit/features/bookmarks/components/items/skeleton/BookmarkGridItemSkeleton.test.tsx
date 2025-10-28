import { describe, expect, it } from 'vitest';

describe('BookmarkGridItemSkeleton', () => {
  it('should be importable', async () => {
    const module = await import('../../../../../../../src/features/bookmarks/components/items/skeleton/BookmarkGridItemSkeleton');
    expect(module).toBeDefined();
  });
});
