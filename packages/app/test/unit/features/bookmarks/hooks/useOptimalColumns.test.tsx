import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { useOptimalColumns } from '@/features/bookmarks/hooks/useOptimalColumns';

describe('useOptimalColumns', () => {
  it('returns 1 column when isList is true', () => {
    const { result } = renderHook(() => useOptimalColumns(1000, true));
    expect(result.current).toBe(1);
  });

  it('returns 1 column for narrow containers', () => {
    const { result } = renderHook(() => useOptimalColumns(50, false));
    expect(result.current).toBe(1);
  });

  it('calculates optimal columns based on container width', () => {
    const { result } = renderHook(() => useOptimalColumns(200, false));
    expect(result.current).toBe(1);
  });

  it('calculates multiple columns for wider containers', () => {
    const { result } = renderHook(() => useOptimalColumns(300, false));
    expect(result.current).toBe(2);
  });

  it('calculates more columns for very wide containers', () => {
    const { result } = renderHook(() => useOptimalColumns(1000, false));
    expect(result.current).toBe(9);
  });

  it('calculates many columns for very wide containers', () => {
    const { result } = renderHook(() => useOptimalColumns(5000, false));
    expect(result.current).toBe(46);
  });

  it('handles edge case of exactly 4 columns', () => {
    const { result } = renderHook(() => useOptimalColumns(440, false));
    expect(result.current).toBe(4);
  });

  it('handles zero width gracefully', () => {
    const { result } = renderHook(() => useOptimalColumns(0, false));
    expect(result.current).toBe(1);
  });
});
