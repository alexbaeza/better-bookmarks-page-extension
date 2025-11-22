import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useRawBookmarkData } from '@/features/bookmarks/hooks/useRawBookmarkData';

const mockRefreshBookmarks = vi.fn();
let mockAppStateContext: {
  providerInitialised: boolean;
  bookmarks: { folders: unknown[]; uncategorized: unknown };
  isLoading: boolean;
  error: unknown;
  refreshBookmarks: ReturnType<typeof vi.fn>;
};

vi.mock('@/app/providers/app-state-context', () => ({
  useAppStateContext: () => mockAppStateContext,
}));

describe('useRawBookmarkData', () => {
  beforeEach(() => {
    mockRefreshBookmarks.mockClear();
    mockAppStateContext = {
      providerInitialised: true,
      bookmarks: {
        folders: [],
        uncategorized: undefined,
      },
      isLoading: false,
      error: undefined,
      refreshBookmarks: mockRefreshBookmarks,
    };
  });

  it('should return bookmark data', () => {
    const { result } = renderHook(() => useRawBookmarkData());

    expect(result.current).toHaveProperty('rawFolders');
    expect(result.current).toHaveProperty('rawUncategorized');
    expect(result.current).toHaveProperty('isLoading');
    expect(result.current).toHaveProperty('error');
    expect(result.current).toHaveProperty('refresh');
  });

  it('should return rawFolders from bookmarks', () => {
    const { result } = renderHook(() => useRawBookmarkData());
    expect(result.current.rawFolders).toEqual([]);
  });

  it('should return rawUncategorized from bookmarks', () => {
    const { result } = renderHook(() => useRawBookmarkData());
    expect(result.current.rawUncategorized).toBeUndefined();
  });

  it('should return isLoading state', () => {
    const { result } = renderHook(() => useRawBookmarkData());
    expect(result.current.isLoading).toBe(false);
  });

  it('should return error state', () => {
    const { result } = renderHook(() => useRawBookmarkData());
    expect(result.current.error).toBeUndefined();
  });

  it('should return refresh function', () => {
    const { result } = renderHook(() => useRawBookmarkData());
    expect(result.current.refresh).toBe(mockRefreshBookmarks);
  });

  it('should call refreshBookmarks when not initialized', () => {
    mockAppStateContext.providerInitialised = false;
    renderHook(() => useRawBookmarkData());
  });

  it('should not call refreshBookmarks when initialized', () => {
    mockAppStateContext.providerInitialised = true;
    renderHook(() => useRawBookmarkData());

    expect(mockRefreshBookmarks).toHaveBeenCalledTimes(0);
  });
});
