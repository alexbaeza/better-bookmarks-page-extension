import { describe, expect, it } from 'vitest';

describe('BookmarkGridItemContent', () => {
  it('should be importable', async () => {
    const module = await import('../../../../../../src/features/bookmarks/components/items/BookmarkGridItemContent');
    expect(module).toBeDefined();
  });
});
