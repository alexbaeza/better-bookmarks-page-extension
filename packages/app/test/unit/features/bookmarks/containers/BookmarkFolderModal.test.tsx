import { describe, expect, it } from 'vitest';

describe('BookmarkFolderModal', () => {
  it('should be importable', { timeout: 10000 }, async () => {
    const module = await import('../../../../../src/features/bookmarks/containers/BookmarkFolderModal');
    expect(module).toBeDefined();
  });
});
