import { describe, expect, it } from 'vitest';

describe('default-favicon', () => {
  it('should be importable', async () => {
    const module = await import('../../../../../../../src/features/bookmarks/lib/browser/utils/default-favicon');
    expect(module).toBeDefined();
  });
});
