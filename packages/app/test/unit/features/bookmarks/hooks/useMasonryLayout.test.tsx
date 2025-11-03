import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useMasonryLayout } from '@/features/bookmarks/hooks/useMasonryLayout';

describe('useMasonryLayout', () => {
  it('should return empty array when items is empty', () => {
    const { result } = renderHook(() => useMasonryLayout([], { columnCount: 3 }));
    expect(result.current).toEqual([]);
  });

  it('should return empty array when columnCount is 0', () => {
    const { result } = renderHook(() => useMasonryLayout([{ id: '1' }], { columnCount: 0 }));
    expect(result.current).toEqual([]);
  });

  it('should return single column when columnCount is 1', () => {
    const items = [{ id: '1' }, { id: '2' }, { id: '3' }];
    const { result } = renderHook(() => useMasonryLayout(items, { columnCount: 1 }));
    expect(result.current).toHaveLength(1);
    expect(result.current[0].items).toHaveLength(3);
    expect(result.current[0].key).toBe('column-0');
  });

  it('should distribute items evenly across columns', () => {
    const items = [{ id: '1' }, { id: '2' }, { id: '3' }, { id: '4' }, { id: '5' }, { id: '6' }];
    const { result } = renderHook(() => useMasonryLayout(items, { columnCount: 3 }));
    expect(result.current).toHaveLength(3);
    expect(result.current[0].items).toHaveLength(2);
    expect(result.current[1].items).toHaveLength(2);
    expect(result.current[2].items).toHaveLength(2);
  });

  it('should add to shortest column first', () => {
    const items = [{ id: '1' }, { id: '2' }, { id: '3' }];
    const { result } = renderHook(() => useMasonryLayout(items, { columnCount: 3 }));
    expect(result.current).toHaveLength(3);
    expect(result.current[0].items).toHaveLength(1);
    expect(result.current[1].items).toHaveLength(1);
    expect(result.current[2].items).toHaveLength(1);
  });

  it('should use custom gap when provided', () => {
    const items = [{ id: '1' }, { id: '2' }];
    const { result } = renderHook(() => useMasonryLayout(items, { columnCount: 2, gap: 8 }));
    expect(result.current).toHaveLength(2);
  });

  it('should use getItemHeight when provided', () => {
    const items = [
      { id: '1', height: 100 },
      { id: '2', height: 200 },
    ];
    const getItemHeight = (item: { id: string; height?: number }) => item.height || 200;
    const { result } = renderHook(() => useMasonryLayout(items, { columnCount: 2 }, getItemHeight));
    expect(result.current).toHaveLength(2);
  });

  it('should use default height when getItemHeight is not provided', () => {
    const items = [{ id: '1' }, { id: '2' }];
    const { result } = renderHook(() => useMasonryLayout(items, { columnCount: 2 }));
    expect(result.current).toHaveLength(2);
  });

  it('should regenerate columns when items change', () => {
    const { result, rerender } = renderHook(({ items }) => useMasonryLayout(items, { columnCount: 2 }), {
      initialProps: { items: [{ id: '1' }] },
    });
    expect(result.current[0].items).toHaveLength(1);

    rerender({ items: [{ id: '1' }, { id: '2' }] });
    expect(result.current[0].items.length + result.current[1].items.length).toBe(2);
  });

  it('should regenerate columns when columnCount changes', () => {
    const { result, rerender } = renderHook(
      ({ columnCount }) => useMasonryLayout([{ id: '1' }, { id: '2' }], { columnCount }),
      { initialProps: { columnCount: 1 } }
    );
    expect(result.current).toHaveLength(1);

    rerender({ columnCount: 2 });
    expect(result.current).toHaveLength(2);
  });
});
