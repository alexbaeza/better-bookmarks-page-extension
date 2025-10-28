import { describe, expect, it } from 'vitest';

describe('useDragStyles', () => {
  it('should be importable', async () => {
    const module = await import('../../../../../src/features/bookmarks/hooks/useDragStyles');
    expect(module).toBeDefined();
  });
});
