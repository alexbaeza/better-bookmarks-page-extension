import { describe, expect, it } from 'vitest';

describe('useDragDroppable', () => {
  it('should be importable', async () => {
    const module = await import('../../../../../src/features/bookmarks/hooks/useDragDroppable');
    expect(module).toBeDefined();
  });
});
