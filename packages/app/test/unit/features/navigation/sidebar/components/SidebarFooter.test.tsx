import { describe, expect, it } from 'vitest';

describe('SidebarFooter', () => {
  it('should be importable', async () => {
    const module = await import('@/features/navigation/sidebar/components/SidebarFooter');
    expect(module).toBeDefined();
  });

  it('should export SidebarFooter component', async () => {
    const module = await import('@/features/navigation/sidebar/components/SidebarFooter');
    expect(module).toHaveProperty('SidebarFooter');
  });
});
