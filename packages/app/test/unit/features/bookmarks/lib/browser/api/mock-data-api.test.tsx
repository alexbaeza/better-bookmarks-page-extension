import { describe, expect, it } from 'vitest';

describe('mock-data-api', () => {
  it('should be importable', async () => {
    const module = await import('../../../../../../../src/features/bookmarks/lib/browser/api/mock-data-api');
    expect(module).toBeDefined();
  });
});
