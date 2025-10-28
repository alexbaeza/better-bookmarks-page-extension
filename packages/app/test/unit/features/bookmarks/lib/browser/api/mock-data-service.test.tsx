import { describe, expect, it } from 'vitest';

describe('mock-data-service', () => {
  it('should be importable', async () => {
    const module = await import('../../../../../../../src/features/bookmarks/lib/browser/api/mock-data-service');
    expect(module).toBeDefined();
  });
});
