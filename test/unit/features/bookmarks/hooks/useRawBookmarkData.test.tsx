import { renderHook } from '@testing-library/react';

import { useRawBookmarkData } from '@/features/bookmarks/hooks/useRawBookmarkData';

describe('useRawBookmarkData', () => {
  it('returns basic properties from context', () => {
    const { result } = renderHook(() => useRawBookmarkData());

    expect(result.current).toHaveProperty('rawFolders');
    expect(result.current).toHaveProperty('rawUncategorized');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('refresh');
    expect(typeof result.current.refresh).toBe('function');
  });
});
