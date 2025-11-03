import { describe, expect, it } from 'vitest';

describe('SidebarItem', () => {
  it('should be importable', async () => {
    const module = await import('@/features/navigation/sidebar/components/SidebarItem');
    expect(module).toBeDefined();
  });

  it('should export SidebarItem component', async () => {
    const module = await import('@/features/navigation/sidebar/components/SidebarItem');
    expect(module).toHaveProperty('SidebarItem');
  });
});
