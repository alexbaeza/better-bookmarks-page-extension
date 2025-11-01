import { describe, expect, it } from 'vitest';

describe('BookmarkRootFolderView', () => {
  it('should be importable', { timeout: 10000 }, async () => {
    const module = await import('../../../../../src/features/bookmarks/containers/BookmarkRootFolderView');
    expect(module).toBeDefined();
  });
});
