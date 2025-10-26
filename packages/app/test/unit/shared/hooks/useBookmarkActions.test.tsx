import { act, renderHook } from '@testing-library/react';
import type React from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import * as bookmarksApi from '@/features/bookmarks/lib/bookmarks';

vi.mock('@/features/bookmarks/lib/bookmarks', () => ({
  create: vi.fn(),
  move: vi.fn(),
  remove: vi.fn(),
  update: vi.fn(),
}));

describe('useBookmarkActions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('calls create and refresh', async () => {
    vi.doUnmock('@/app/providers/app-state-context');
    vi.doUnmock('@/features/bookmarks/hooks/useBookmarkActions');
    const { useBookmarkActions } = (await vi.importActual(
      '@/features/bookmarks/hooks/useBookmarkActions'
    )) as typeof import('@/features/bookmarks/hooks/useBookmarkActions');
    const { AppStateContext } = (await vi.importActual('@/app/providers/app-state-context')) as typeof import('@/app/providers/app-state-context');
    const refreshSpy = vi.fn().mockResolvedValue(undefined);
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <AppStateContext.Provider
        value={{
          bookmarks: { folders: [], uncategorized: undefined },
          error: undefined,
          isLoading: false,
          providerInitialised: true,
          refreshBookmarks: refreshSpy,
        }}
      >
        {children}
      </AppStateContext.Provider>
    );

    const { result } = renderHook(() => useBookmarkActions(), { wrapper });
    await act(async () => {
      await result.current.create('p1', { title: 't', url: 'u' });
    });
    expect(bookmarksApi.create).toHaveBeenCalledWith('p1', { title: 't', url: 'u' });
    expect(refreshSpy).toHaveBeenCalled();
  });

  it('calls update/remove/move and refresh', async () => {
    const { useBookmarkActions } = (await vi.importActual(
      '@/features/bookmarks/hooks/useBookmarkActions'
    )) as typeof import('@/features/bookmarks/hooks/useBookmarkActions');
    const { AppStateContext } = (await vi.importActual('@/app/providers/app-state-context')) as typeof import('@/app/providers/app-state-context');
    const refreshSpy = vi.fn().mockResolvedValue(undefined);
    const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
      <AppStateContext.Provider
        value={{
          bookmarks: { folders: [], uncategorized: undefined },
          error: undefined,
          isLoading: false,
          providerInitialised: true,
          refreshBookmarks: refreshSpy,
        }}
      >
        {children}
      </AppStateContext.Provider>
    );

    const { result } = renderHook(() => useBookmarkActions(), { wrapper });
    await act(async () => {
      await result.current.update('id1', { title: 'x' });
      await result.current.remove('id2');
      await result.current.move('id3', { index: 1, parentId: 'p2' });
    });
    expect(bookmarksApi.update).toHaveBeenCalledWith('id1', { title: 'x' });
    expect(bookmarksApi.remove).toHaveBeenCalledWith('id2');
    expect(bookmarksApi.move).toHaveBeenCalledWith('id3', { index: 1, parentId: 'p2' });
    expect(refreshSpy).toHaveBeenCalledTimes(3);
  });
});
