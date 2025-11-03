import { describe, expect, it } from 'vitest';

describe('SidebarFolderNode', () => {
  it('should be importable', async () => {
    const module = await import('@/features/navigation/sidebar/components/SidebarFolderNode');
    expect(module).toBeDefined();
  });

  it('should export SidebarFolderNode component', async () => {
    const module = await import('@/features/navigation/sidebar/components/SidebarFolderNode');
    expect(module).toHaveProperty('SidebarFolderNode');
  });
});
