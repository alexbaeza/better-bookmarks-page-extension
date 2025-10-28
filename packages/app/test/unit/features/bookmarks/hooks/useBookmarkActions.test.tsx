import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useBookmarkActions } from '@/features/bookmarks/hooks/useBookmarkActions';

// Mock dependencies
const mockRefreshBookmarks = vi.fn();

vi.mock('@/app/providers/app-state-context', () => ({
  useAppStateContext: () => ({
    refreshBookmarks: mockRefreshBookmarks,
  }),
}));

vi.mock('@/features/bookmarks/lib/bookmarks', () => ({
  create: vi.fn().mockResolvedValue(undefined),
  update: vi.fn().mockResolvedValue(undefined),
  remove: vi.fn().mockResolvedValue(undefined),
  move: vi.fn().mockResolvedValue(undefined),
}));

describe('useBookmarkActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockRefreshBookmarks.mockResolvedValue(undefined);
  });

  it('should return bookmark action functions', () => {
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

  it('should have create function', () => {
    const { result } = renderHook(() => useBookmarkActions());
    expect(result.current.create).toBeDefined();
    expect(typeof result.current.create).toBe('function');
  });

  it('should have update function', () => {
    const { result } = renderHook(() => useBookmarkActions());
    expect(result.current.update).toBeDefined();
    expect(typeof result.current.update).toBe('function');
  });

  it('should have remove function', () => {
    const { result } = renderHook(() => useBookmarkActions());
    expect(result.current.remove).toBeDefined();
    expect(typeof result.current.remove).toBe('function');
  });

  it('should have move function', () => {
    const { result } = renderHook(() => useBookmarkActions());
    expect(result.current.move).toBeDefined();
    expect(typeof result.current.move).toBe('function');
  });

  it('should return all expected functions', () => {
    const { result } = renderHook(() => useBookmarkActions());
    const { create, update, remove, move } = result.current;

    expect(create).toBeDefined();
    expect(update).toBeDefined();
    expect(remove).toBeDefined();
    expect(move).toBeDefined();
  });
});
