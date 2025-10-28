import { describe, expect, it } from 'vitest';

describe('BookmarkListItem', () => {
  it('should be importable', async () => {
    const module = await import('../../../../../../../src/features/bookmarks/components/items/list/BookmarkListItem');
    expect(module).toBeDefined();
  });
});
