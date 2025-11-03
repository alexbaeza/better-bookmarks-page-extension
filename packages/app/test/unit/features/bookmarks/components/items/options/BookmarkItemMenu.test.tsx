import { describe, expect, it } from 'vitest';

describe('BookmarkItemMenu', () => {
  it('should be importable', async () => {
    const module = await import(
      '../../../../../../../src/features/bookmarks/components/items/options/BookmarkItemMenu'
    );
    expect(module).toBeDefined();
  });
});
