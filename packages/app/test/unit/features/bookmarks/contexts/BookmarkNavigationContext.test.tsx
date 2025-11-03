import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('BookmarkNavigationContext', () => {
  it('throws when used outside provider', async () => {
    vi.resetModules();
    vi.doUnmock('@/features/bookmarks/contexts/BookmarkNavigationContext');
    const { useBookmarkNavigation } = (await vi.importActual(
      '@/features/bookmarks/contexts/BookmarkNavigationContext'
    )) as typeof import('@/features/bookmarks/contexts/BookmarkNavigationContext');
    expect(() => renderHook(() => useBookmarkNavigation())).toThrowError(
      /useBookmarkNavigation must be used within BookmarkNavigationProvider/
    );
  });

  it('provides default page and allows updating it', async () => {
    vi.resetModules();
    vi.doUnmock('@/features/bookmarks/contexts/BookmarkNavigationContext');
    const { BookmarkNavigationProvider, useBookmarkNavigation } = (await vi.importActual(
      '@/features/bookmarks/contexts/BookmarkNavigationContext'
    )) as typeof import('@/features/bookmarks/contexts/BookmarkNavigationContext');
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <BookmarkNavigationProvider>{children}</BookmarkNavigationProvider>
    );
    const { result } = renderHook(() => useBookmarkNavigation(), { wrapper });
    expect(result.current.currentPage).toBe('All');
    act(() => {
      result.current.setCurrentPage('Uncategorized');
    });
    expect(result.current.currentPage).toBe('Uncategorized');
  });
});
