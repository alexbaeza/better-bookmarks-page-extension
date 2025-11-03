import { describe, expect, it } from 'vitest';

describe('bookmark-tree-utils', () => {
  it('should be importable', async () => {
    const module = await import('../../../../../../../src/features/bookmarks/lib/browser/utils/bookmark-tree-utils');
    expect(module).toBeDefined();
  });
});
