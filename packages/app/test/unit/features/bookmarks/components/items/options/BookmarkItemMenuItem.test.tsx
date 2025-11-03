import { describe, expect, it } from 'vitest';

describe('BookmarkItemMenuItem', () => {
  it('should be importable', async () => {
    const module = await import(
      '../../../../../../../src/features/bookmarks/components/items/options/BookmarkItemMenuItem'
    );
    expect(module).toBeDefined();
  });
});
