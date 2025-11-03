import { describe, expect, it } from 'vitest';

describe('BookmarkDragHandle', () => {
  it('should be importable', async () => {
    const module = await import('../../../../../../src/features/bookmarks/components/items/BookmarkDragHandle');
    expect(module).toBeDefined();
  });
});
