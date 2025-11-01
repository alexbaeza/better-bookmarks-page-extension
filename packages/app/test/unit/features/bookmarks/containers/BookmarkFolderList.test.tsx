import { describe, expect, it } from 'vitest';

describe('BookmarkFolderList', () => {
  it('should be importable', { timeout: 10000 }, async () => {
    const module = await import('../../../../../src/features/bookmarks/containers/BookmarkFolderList');
    expect(module).toBeDefined();
  });
});
