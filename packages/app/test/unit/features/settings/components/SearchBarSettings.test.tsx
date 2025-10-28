import { describe, expect, it } from 'vitest';

describe('SearchBarSettings', () => {
  it('should be importable', async () => {
    const module = await import('@/features/settings/components/SearchBarSettings');
    expect(module).toBeDefined();
  });

  it('should export SearchBarSettings component', async () => {
    const module = await import('@/features/settings/components/SearchBarSettings');
    expect(module).toHaveProperty('SearchBarSettings');
  });
});
