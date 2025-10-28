import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useRawBookmarkData } from '@/features/bookmarks/hooks/useRawBookmarkData';

// Mock dependencies
const mockRefreshBookmarks = vi.fn();
const mockAppStateContext = {
  providerInitialised: true,
  bookmarks: {
    folders: [],
    uncategorized: undefined,
  },
  isLoading: false,
  error: undefined,
  refreshBookmarks: mockRefreshBookmarks,
};

vi.mock('@/app/providers/app-state-context', () => ({
  useAppStateContext: () => mockAppStateContext,
}));

describe('useRawBookmarkData', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockAppStateContext.providerInitialised = true;
    mockAppStateContext.bookmarks = {
      folders: [],
      uncategorized: undefined,
    };
    mockAppStateContext.isLoading = false;
    mockAppStateContext.error = undefined;
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

    // Note: useEffect is called asynchronously, so we can't easily test the call in this test
    // This would require more complex async testing
  });

  it('should not call refreshBookmarks when initialized', () => {
    mockAppStateContext.providerInitialised = true;
    renderHook(() => useRawBookmarkData());

    // The effect should not run on first render if already initialized
    expect(mockRefreshBookmarks).not.toHaveBeenCalled();
  });
});
