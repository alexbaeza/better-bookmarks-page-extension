import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useBookmarkActions } from '@/features/bookmarks/hooks/useBookmarkActions';

describe('useBookmarkActions', () => {
  it('should return all action functions', () => {
    const { result } = renderHook(() => useBookmarkActions());
    expect(result.current).toHaveProperty('create');
    expect(result.current).toHaveProperty('update');
    expect(result.current).toHaveProperty('remove');
    expect(result.current).toHaveProperty('move');
    expect(typeof result.current.create).toBe('function');
    expect(typeof result.current.update).toBe('function');
    expect(typeof result.current.remove).toBe('function');
    expect(typeof result.current.move).toBe('function');
  });
});
