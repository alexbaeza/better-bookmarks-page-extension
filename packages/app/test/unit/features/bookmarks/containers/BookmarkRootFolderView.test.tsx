import { describe, expect, it } from 'vitest';

describe('BookmarkRootFolderView', () => {
  it('should be importable', async () => {
    const module = await import('../../../../../src/features/bookmarks/containers/BookmarkRootFolderView');
    expect(module).toBeDefined();
  });
});
