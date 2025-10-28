import { describe, expect, it } from 'vitest';

describe('useBookmarks', () => {
  it('should be importable', async () => {
    const module = await import('@/features/bookmarks/hooks/useBookmarks');
    expect(module).toBeDefined();
    expect(module.useBookmarks).toBeDefined();
  });
});
