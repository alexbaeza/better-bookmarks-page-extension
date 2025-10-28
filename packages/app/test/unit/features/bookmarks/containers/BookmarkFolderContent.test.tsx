import { describe, expect, it } from 'vitest';

describe('BookmarkFolderContent', () => {
  it('should be importable', async () => {
    const module = await import('../../../../../src/features/bookmarks/containers/BookmarkFolderContent');
    expect(module).toBeDefined();
  });
});
