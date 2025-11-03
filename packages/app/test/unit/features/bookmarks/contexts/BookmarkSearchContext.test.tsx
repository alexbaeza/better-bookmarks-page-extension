import { act, renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

describe('BookmarkSearchContext', () => {
  it('throws when used outside provider', async () => {
    vi.resetModules();
    vi.doUnmock('@/features/bookmarks/contexts/BookmarkSearchContext');
    const { useBookmarkSearchTerm } = (await vi.importActual(
      '@/features/bookmarks/contexts/BookmarkSearchContext'
    )) as typeof import('@/features/bookmarks/contexts/BookmarkSearchContext');
    expect(() => renderHook(() => useBookmarkSearchTerm())).toThrowError(
      /useBookmarkSearchTerm must be used within BookmarkSearchProvider/
    );
  });

  it('provides search term state and reset', async () => {
    vi.resetModules();
    vi.doUnmock('@/features/bookmarks/contexts/BookmarkSearchContext');
    const { BookmarkSearchProvider, useBookmarkSearchTerm } = (await vi.importActual(
      '@/features/bookmarks/contexts/BookmarkSearchContext'
    )) as typeof import('@/features/bookmarks/contexts/BookmarkSearchContext');
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <BookmarkSearchProvider>{children}</BookmarkSearchProvider>
    );
    const { result } = renderHook(() => useBookmarkSearchTerm(), { wrapper });
    expect(result.current.searchTerm).toBe('');
    act(() => result.current.setSearchTerm('hello'));
    expect(result.current.searchTerm).toBe('hello');
    act(() => result.current.resetSearch());
    expect(result.current.searchTerm).toBe('');
  });
});
