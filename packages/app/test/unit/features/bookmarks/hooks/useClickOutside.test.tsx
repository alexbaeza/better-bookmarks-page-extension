import { describe, expect, it } from 'vitest';

describe('useClickOutside', () => {
  it('should be importable', async () => {
    const module = await import('../../../../../src/features/bookmarks/hooks/useClickOutside');
    expect(module).toBeDefined();
  });
});
