import { describe, expect, it } from 'vitest';

describe('TreeElbowItem', () => {
  it('should be importable', async () => {
    const module = await import('@/features/navigation/sidebar/components/TreeElbowItem');
    expect(module).toBeDefined();
  });

  it('should export TreeElbowItem component', async () => {
    const module = await import('@/features/navigation/sidebar/components/TreeElbowItem');
    expect(module).toHaveProperty('TreeElbowItem');
  });
});
