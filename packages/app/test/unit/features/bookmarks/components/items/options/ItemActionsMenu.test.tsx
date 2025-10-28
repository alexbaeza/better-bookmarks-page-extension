import { describe, expect, it } from 'vitest';

describe('ItemActionsMenu', () => {
  it('should be importable', async () => {
    const module = await import('../../../../../../../src/features/bookmarks/components/items/options/ItemActionsMenu');
    expect(module).toBeDefined();
  });
});
