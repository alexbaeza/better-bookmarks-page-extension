import { renderHook } from '@testing-library/react';
import type React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BookmarkNavigationProvider } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { BookmarkSearchProvider } from '@/features/bookmarks/contexts/BookmarkSearchContext';
import { useBookmarkSearch } from '@/features/bookmarks/hooks/useBookmarkSearch';

vi.mock('@/features/bookmarks/contexts/BookmarkNavigationContext', async () => {
  const actual = await vi.importActual('@/features/bookmarks/contexts/BookmarkNavigationContext');
  return actual;
});

vi.mock('@/features/bookmarks/contexts/BookmarkSearchContext', async () => {
  const actual = await vi.importActual('@/features/bookmarks/contexts/BookmarkSearchContext');
  return actual;
});

describe('useBookmarkSearch', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <BookmarkSearchProvider>
      <BookmarkNavigationProvider>{children}</BookmarkNavigationProvider>
    </BookmarkSearchProvider>
  );

  it('returns all required properties', () => {
    const { result } = renderHook(() => useBookmarkSearch({ rawFolders: [], rawUncategorized: undefined }), { wrapper });

    expect(result.current.counts).toBeDefined();
    expect(result.current.items).toBeDefined();
    expect(result.current.pageContainers).toBeDefined();
    expect(result.current.searchTerm).toBeDefined();
    expect(result.current.setSearchTerm).toBeDefined();
  });

  it('returns empty pageContainers when no folders provided', () => {
    const { result } = renderHook(() => useBookmarkSearch({ rawFolders: [], rawUncategorized: undefined }), { wrapper });

    expect(result.current.pageContainers).toHaveLength(0);
  });

  it('returns counts object', () => {
    const { result } = renderHook(() => useBookmarkSearch({ rawFolders: [], rawUncategorized: undefined }), { wrapper });

    expect(result.current.counts).toBeDefined();
    expect(typeof result.current.counts).toBe('object');
  });

  it('returns empty array for items when on All page', () => {
    const { result } = renderHook(() => useBookmarkSearch({ rawFolders: [], rawUncategorized: undefined }), { wrapper });

    expect(result.current.items).toEqual([]);
  });

  it('has setSearchTerm function', () => {
    const { result } = renderHook(() => useBookmarkSearch({ rawFolders: [], rawUncategorized: undefined }), { wrapper });

    expect(typeof result.current.setSearchTerm).toBe('function');
  });
});
