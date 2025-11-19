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

  describe('navigateToPage', () => {
    it('should reset stack when navigating to All', async () => {
      vi.resetModules();
      vi.doUnmock('@/features/bookmarks/contexts/BookmarkNavigationContext');
      const { BookmarkNavigationProvider, useBookmarkNavigation } = (await vi.importActual(
        '@/features/bookmarks/contexts/BookmarkNavigationContext'
      )) as typeof import('@/features/bookmarks/contexts/BookmarkNavigationContext');
      const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <BookmarkNavigationProvider>{children}</BookmarkNavigationProvider>
      );
      const { result } = renderHook(() => useBookmarkNavigation(), { wrapper });

      act(() => {
        result.current.navigateToFolder('folder-1');
      });

      expect(result.current.navigationStack).toEqual(['All', 'folder-1']);

      act(() => {
        result.current.navigateToPage('All');
      });

      expect(result.current.navigationStack).toEqual(['All']);
      expect(result.current.currentPage).toBe('All');
    });

    it('should reset stack when navigating to Uncategorized', async () => {
      vi.resetModules();
      vi.doUnmock('@/features/bookmarks/contexts/BookmarkNavigationContext');
      const { BookmarkNavigationProvider, useBookmarkNavigation } = (await vi.importActual(
        '@/features/bookmarks/contexts/BookmarkNavigationContext'
      )) as typeof import('@/features/bookmarks/contexts/BookmarkNavigationContext');
      const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <BookmarkNavigationProvider>{children}</BookmarkNavigationProvider>
      );
      const { result } = renderHook(() => useBookmarkNavigation(), { wrapper });

      act(() => {
        result.current.navigateToFolder('folder-1');
      });

      act(() => {
        result.current.navigateToPage('Uncategorized');
      });

      expect(result.current.navigationStack).toEqual(['Uncategorized']);
      expect(result.current.currentPage).toBe('Uncategorized');
    });

    it('should navigate to existing folder in stack', async () => {
      vi.resetModules();
      vi.doUnmock('@/features/bookmarks/contexts/BookmarkNavigationContext');
      const { BookmarkNavigationProvider, useBookmarkNavigation } = (await vi.importActual(
        '@/features/bookmarks/contexts/BookmarkNavigationContext'
      )) as typeof import('@/features/bookmarks/contexts/BookmarkNavigationContext');
      const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <BookmarkNavigationProvider>{children}</BookmarkNavigationProvider>
      );
      const { result } = renderHook(() => useBookmarkNavigation(), { wrapper });

      act(() => {
        result.current.navigateToFolder('folder-1');
      });

      act(() => {
        result.current.navigateToFolder('folder-2');
      });

      expect(result.current.navigationStack).toEqual(['All', 'folder-1', 'folder-2']);

      act(() => {
        result.current.navigateToPage('folder-1');
      });

      expect(result.current.navigationStack).toEqual(['All', 'folder-1']);
      expect(result.current.currentPage).toBe('folder-1');
    });

    it('should append folder when not found in stack', async () => {
      vi.resetModules();
      vi.doUnmock('@/features/bookmarks/contexts/BookmarkNavigationContext');
      const { BookmarkNavigationProvider, useBookmarkNavigation } = (await vi.importActual(
        '@/features/bookmarks/contexts/BookmarkNavigationContext'
      )) as typeof import('@/features/bookmarks/contexts/BookmarkNavigationContext');
      const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <BookmarkNavigationProvider>{children}</BookmarkNavigationProvider>
      );
      const { result } = renderHook(() => useBookmarkNavigation(), { wrapper });

      act(() => {
        result.current.navigateToPage('folder-1');
      });

      expect(result.current.navigationStack).toEqual(['All', 'folder-1']);
      expect(result.current.currentPage).toBe('folder-1');
    });
  });

  describe('navigateToFolderWithPath', () => {
    it('should set navigation stack and current page', async () => {
      vi.resetModules();
      vi.doUnmock('@/features/bookmarks/contexts/BookmarkNavigationContext');
      const { BookmarkNavigationProvider, useBookmarkNavigation } = (await vi.importActual(
        '@/features/bookmarks/contexts/BookmarkNavigationContext'
      )) as typeof import('@/features/bookmarks/contexts/BookmarkNavigationContext');
      const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <BookmarkNavigationProvider>{children}</BookmarkNavigationProvider>
      );
      const { result } = renderHook(() => useBookmarkNavigation(), { wrapper });

      act(() => {
        result.current.navigateToFolderWithPath('subfolder-1', ['All', 'folder-1', 'subfolder-1']);
      });

      expect(result.current.navigationStack).toEqual(['All', 'folder-1', 'subfolder-1']);
      expect(result.current.currentPage).toBe('subfolder-1');
    });

    it('should replace existing navigation stack', async () => {
      vi.resetModules();
      vi.doUnmock('@/features/bookmarks/contexts/BookmarkNavigationContext');
      const { BookmarkNavigationProvider, useBookmarkNavigation } = (await vi.importActual(
        '@/features/bookmarks/contexts/BookmarkNavigationContext'
      )) as typeof import('@/features/bookmarks/contexts/BookmarkNavigationContext');
      const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <BookmarkNavigationProvider>{children}</BookmarkNavigationProvider>
      );
      const { result } = renderHook(() => useBookmarkNavigation(), { wrapper });

      act(() => {
        result.current.navigateToFolder('folder-1');
      });

      act(() => {
        result.current.navigateToFolder('folder-2');
      });

      expect(result.current.navigationStack).toEqual(['All', 'folder-1', 'folder-2']);

      act(() => {
        result.current.navigateToFolderWithPath('folder-3', ['All', 'folder-3']);
      });

      expect(result.current.navigationStack).toEqual(['All', 'folder-3']);
      expect(result.current.currentPage).toBe('folder-3');
    });
  });

  describe('navigateBack', () => {
    it('should navigate back and update stack', async () => {
      vi.resetModules();
      vi.doUnmock('@/features/bookmarks/contexts/BookmarkNavigationContext');
      const { BookmarkNavigationProvider, useBookmarkNavigation } = (await vi.importActual(
        '@/features/bookmarks/contexts/BookmarkNavigationContext'
      )) as typeof import('@/features/bookmarks/contexts/BookmarkNavigationContext');
      const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <BookmarkNavigationProvider>{children}</BookmarkNavigationProvider>
      );
      const { result } = renderHook(() => useBookmarkNavigation(), { wrapper });

      act(() => {
        result.current.navigateToFolder('folder-1');
      });

      act(() => {
        result.current.navigateToFolder('folder-2');
      });

      expect(result.current.navigationStack).toEqual(['All', 'folder-1', 'folder-2']);

      act(() => {
        result.current.navigateBack();
      });

      expect(result.current.navigationStack).toEqual(['All', 'folder-1']);
      expect(result.current.currentPage).toBe('folder-1');
    });

    it('should not navigate back when stack has only one item', async () => {
      vi.resetModules();
      vi.doUnmock('@/features/bookmarks/contexts/BookmarkNavigationContext');
      const { BookmarkNavigationProvider, useBookmarkNavigation } = (await vi.importActual(
        '@/features/bookmarks/contexts/BookmarkNavigationContext'
      )) as typeof import('@/features/bookmarks/contexts/BookmarkNavigationContext');
      const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <BookmarkNavigationProvider>{children}</BookmarkNavigationProvider>
      );
      const { result } = renderHook(() => useBookmarkNavigation(), { wrapper });

      expect(result.current.navigationStack).toEqual(['All']);

      act(() => {
        result.current.navigateBack();
      });

      expect(result.current.navigationStack).toEqual(['All']);
      expect(result.current.currentPage).toBe('All');
    });
  });

  describe('canGoBack', () => {
    it('should be false when stack has only one item', async () => {
      vi.resetModules();
      vi.doUnmock('@/features/bookmarks/contexts/BookmarkNavigationContext');
      const { BookmarkNavigationProvider, useBookmarkNavigation } = (await vi.importActual(
        '@/features/bookmarks/contexts/BookmarkNavigationContext'
      )) as typeof import('@/features/bookmarks/contexts/BookmarkNavigationContext');
      const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <BookmarkNavigationProvider>{children}</BookmarkNavigationProvider>
      );
      const { result } = renderHook(() => useBookmarkNavigation(), { wrapper });

      expect(result.current.canGoBack).toBe(false);
    });

    it('should be true when stack has more than one item', async () => {
      vi.resetModules();
      vi.doUnmock('@/features/bookmarks/contexts/BookmarkNavigationContext');
      const { BookmarkNavigationProvider, useBookmarkNavigation } = (await vi.importActual(
        '@/features/bookmarks/contexts/BookmarkNavigationContext'
      )) as typeof import('@/features/bookmarks/contexts/BookmarkNavigationContext');
      const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
        <BookmarkNavigationProvider>{children}</BookmarkNavigationProvider>
      );
      const { result } = renderHook(() => useBookmarkNavigation(), { wrapper });

      act(() => {
        result.current.navigateToFolder('folder-1');
      });

      expect(result.current.canGoBack).toBe(true);
    });
  });
});
