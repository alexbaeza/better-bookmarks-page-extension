import { describe, expect, it } from 'vitest';

describe('useHover', () => {
  it('should be importable', async () => {
    const module = await import('../../../../../src/features/bookmarks/hooks/useHover');
    expect(module).toBeDefined();
  });
});
