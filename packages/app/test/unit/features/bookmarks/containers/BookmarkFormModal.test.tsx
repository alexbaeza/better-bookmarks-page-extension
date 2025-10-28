import { describe, expect, it } from 'vitest';

describe('BookmarkFormModal', () => {
  it('should be importable', async () => {
    const module = await import('../../../../../src/features/bookmarks/containers/BookmarkFormModal');
    expect(module).toBeDefined();
  });
});
