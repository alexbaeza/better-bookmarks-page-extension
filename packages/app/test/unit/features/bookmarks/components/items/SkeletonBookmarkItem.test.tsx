import { describe, expect, it } from 'vitest';

describe('SkeletonBookmarkItem', () => {
  it('should be importable', async () => {
    const module = await import('../../../../../../src/features/bookmarks/components/items/SkeletonBookmarkItem');
    expect(module).toBeDefined();
  });
});
