import { describe, expect, it } from 'vitest';

describe('BookmarkFolderModal', () => {
  it('should be importable', async () => {
    const module = await import('../../../../../src/features/bookmarks/containers/BookmarkFolderModal');
    expect(module).toBeDefined();
  });
});
