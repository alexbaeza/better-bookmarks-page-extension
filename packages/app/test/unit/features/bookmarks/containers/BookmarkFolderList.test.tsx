import { describe, expect, it } from 'vitest';

describe('BookmarkFolderList', () => {
  it('should be importable', async () => {
    const module = await import('../../../../../src/features/bookmarks/containers/BookmarkFolderList');
    expect(module).toBeDefined();
  });
});
