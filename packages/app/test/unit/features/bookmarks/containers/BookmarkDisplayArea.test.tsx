import { describe, expect, it } from 'vitest';

describe('BookmarkDisplayArea', () => {
  it('should be importable', async () => {
    const module = await import('../../../../../src/features/bookmarks/containers/BookmarkDisplayArea');
    expect(module).toBeDefined();
  });
});
