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
    // With minItemWidth=100 and gap=8, each item takes 108px
    // For 200px width: floor((200 - 8) / 108) = floor(192 / 108) = 1
    const { result } = renderHook(() => useOptimalColumns(200, false));
    expect(result.current).toBe(1);
  });

  it('calculates multiple columns for wider containers', () => {
    // For 300px width: floor((300 - 8) / 108) = floor(292 / 108) = 2
    const { result } = renderHook(() => useOptimalColumns(300, false));
    expect(result.current).toBe(2);
  });

  it('calculates more columns for very wide containers', () => {
    // For 1000px width: floor((1000 - 8) / 108) = floor(992 / 108) = 9
    const { result } = renderHook(() => useOptimalColumns(1000, false));
    expect(result.current).toBe(9);
  });

  it('caps columns at reasonable maximum (20)', () => {
    // For 5000px width: floor((5000 - 8) / 108) = floor(4992 / 108) = 46, but capped at 20
    const { result } = renderHook(() => useOptimalColumns(5000, false));
    expect(result.current).toBe(20);
  });

  it('handles edge case of exactly 20 columns', () => {
    // Calculate width needed for 20 columns: 20 * 100 + 19 * 8 (gaps) = 2000 + 152 = 2152px
    // We need width that gives floor((width - 8) / 108) = 20
    // So we need: (width - 8) / 108 >= 20 and < 21
    // 20 * 108 + 8 = 2168px
    const { result } = renderHook(() => useOptimalColumns(2168, false));
    expect(result.current).toBe(20);
  });

  it('handles zero width gracefully', () => {
    const { result } = renderHook(() => useOptimalColumns(0, false));
    expect(result.current).toBe(1);
  });
});
