import { describe, expect, it } from 'vitest';

describe('BookmarkListItemContent', () => {
  it('should be importable', async () => {
    const module = await import('../../../../../../src/features/bookmarks/components/items/BookmarkListItemContent');
    expect(module).toBeDefined();
  });
});
