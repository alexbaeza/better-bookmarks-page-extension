import { describe, expect, it } from 'vitest';

describe('BookmarkFolderContent', () => {
  it('should be importable', { timeout: 10000 }, async () => {
    const module = await import('../../../../../src/features/bookmarks/containers/BookmarkFolderContent');
    expect(module).toBeDefined();
  });
});
