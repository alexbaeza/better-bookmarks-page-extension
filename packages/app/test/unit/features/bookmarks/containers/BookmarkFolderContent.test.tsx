import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { when } from 'vitest-when';
import { BookmarkFolderContent } from '@/features/bookmarks/containers/BookmarkFolderContent';
import type { PageId } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { BookmarkPage } from '@/features/bookmarks/contexts/BookmarkNavigationContext';
import { AllProviders } from '~test/test-utils';

let mockUseBookmarks = vi.fn();

vi.mock('@/features/bookmarks/hooks/useBookmarks', () => ({
  useBookmarks: () => mockUseBookmarks(),
}));

vi.mock('@/features/bookmarks/components/BreadcrumbNavigation', () => ({
  BreadcrumbNavigation: () => <div data-testid="breadcrumb-navigation">Breadcrumb Navigation</div>,
}));

vi.mock('@/features/preferences/containers/ViewModeToggle', () => ({
  ViewModeToggle: () => <div data-testid="view-mode-toggle">View Mode Toggle</div>,
}));

vi.mock('@/features/bookmarks/components/layout/BookmarkMasonryLayout', () => ({
  BookmarkMasonryLayout: ({ folders }: { folders: unknown[] }) => (
    <div data-testid="masonry-layout">Masonry Layout for {Array.isArray(folders) ? folders.length : 0} folders</div>
  ),
}));

vi.mock('@/features/bookmarks/components/BookmarkFolderContainer', () => ({
  BookmarkFolderContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="folder-container">{children}</div>
  ),
}));

vi.mock('@/features/bookmarks/containers/BookmarkDisplayArea', () => ({
  BookmarkDisplayArea: ({ folderId }: { folderId: string }) => (
    <div data-testid="display-area">Display Area for folder {folderId}</div>
  ),
}));

vi.mock('@/features/navigation/components/NotFoundIllustration', () => ({
  NotFoundIllustration: ({ className }: { className?: string }) => (
    <div className={className} data-testid="not-found-illustration">
      Not Found Illustration
    </div>
  ),
}));

describe('BookmarkFolderContent', () => {
  beforeEach(() => {
    mockUseBookmarks = vi.fn();
  });

  it('renders breadcrumb navigation and view mode toggle in header', () => {
    when(mockUseBookmarks)
      .calledWith()
      .thenReturn({
        currentPage: 'root' as PageId,
        pageContainers: [
          {
            id: 'folder-1',
            title: 'Test Folder',
            children: [{ id: 'item-1', title: 'Test Item', url: 'https://example.com' }],
          },
        ],
      });

    render(
      <AllProviders>
        <BookmarkFolderContent />
      </AllProviders>
    );

    expect(screen.getByTestId('breadcrumb-navigation')).toBeInTheDocument();
    expect(screen.getByTestId('view-mode-toggle')).toBeInTheDocument();
  });

  it('renders empty state when pageContainers is empty', () => {
    when(mockUseBookmarks)
      .calledWith()
      .thenReturn({
        currentPage: 'root' as PageId,
        pageContainers: [],
      });

    render(
      <AllProviders>
        <BookmarkFolderContent />
      </AllProviders>
    );

    expect(screen.getByTestId('empty-state-container')).toBeInTheDocument();
    expect(screen.getByTestId('empty-state-message')).toHaveTextContent(
      "Looks like you don't have any Bookmarks, add some to see the magic! 🪄✨"
    );
    expect(screen.getByTestId('not-found-illustration')).toBeInTheDocument();
  });

  it('renders empty state when folder has no children', () => {
    when(mockUseBookmarks)
      .calledWith()
      .thenReturn({
        currentPage: 'root' as PageId,
        pageContainers: [
          {
            id: 'folder-1',
            title: 'Empty Folder',
            children: [],
          },
        ],
      });

    render(
      <AllProviders>
        <BookmarkFolderContent />
      </AllProviders>
    );

    expect(screen.getByTestId('empty-state-container')).toBeInTheDocument();
    expect(screen.getByTestId('empty-state-message')).toHaveTextContent(
      "Looks like you don't have any Bookmarks, add some to see the magic! 🪄✨"
    );
    expect(screen.getByTestId('not-found-illustration')).toBeInTheDocument();
  });

  it('renders masonry layout for All bookmarks page', () => {
    when(mockUseBookmarks)
      .calledWith()
      .thenReturn({
        currentPage: BookmarkPage.All,
        pageContainers: [
          {
            id: 'folder-1',
            title: 'Folder 1',
            children: [],
          },
          {
            id: 'folder-2',
            title: 'Folder 2',
            children: [],
          },
        ],
      });

    render(
      <AllProviders>
        <BookmarkFolderContent />
      </AllProviders>
    );

    expect(screen.getByTestId('masonry-layout')).toHaveTextContent('Masonry Layout for 2 folders');
  });

  it('renders masonry layout for Uncategorized bookmarks page', () => {
    when(mockUseBookmarks)
      .calledWith()
      .thenReturn({
        currentPage: BookmarkPage.Uncategorized,
        pageContainers: [
          {
            id: 'uncategorized',
            title: 'Uncategorized',
            children: [{ id: 'item-1', title: 'Uncategorized Item', url: 'https://example.com' }],
          },
        ],
      });

    render(
      <AllProviders>
        <BookmarkFolderContent />
      </AllProviders>
    );

    expect(screen.getByTestId('masonry-layout')).toHaveTextContent('Masonry Layout for 1 folders');
  });

  it('renders folder container and display area for regular folders', () => {
    when(mockUseBookmarks)
      .calledWith()
      .thenReturn({
        currentPage: 'root' as PageId,
        pageContainers: [
          {
            id: 'folder-1',
            title: 'Test Folder',
            children: [{ id: 'item-1', title: 'Test Item', url: 'https://example.com' }],
          },
        ],
      });

    render(
      <AllProviders>
        <BookmarkFolderContent />
      </AllProviders>
    );

    expect(screen.getByTestId('folder-container')).toBeInTheDocument();
    expect(screen.getByTestId('display-area')).toHaveTextContent('Display Area for folder folder-1');
  });

  it('handles folder contents safely when children is undefined', () => {
    when(mockUseBookmarks)
      .calledWith()
      .thenReturn({
        currentPage: 'root' as PageId,
        pageContainers: [
          {
            id: 'folder-1',
            title: 'Test Folder',
            children: undefined,
          },
        ],
      });

    render(
      <AllProviders>
        <BookmarkFolderContent />
      </AllProviders>
    );

    expect(screen.getByTestId('empty-state-container')).toBeInTheDocument();
  });

  it('renders empty state when folder has explicit empty children array', () => {
    when(mockUseBookmarks)
      .calledWith()
      .thenReturn({
        currentPage: 'root' as PageId,
        pageContainers: [
          {
            id: 'folder-1',
            title: 'Test Folder',
            children: [], // Explicit empty array
          },
        ],
      });

    render(
      <AllProviders>
        <BookmarkFolderContent />
      </AllProviders>
    );

    expect(screen.getByTestId('empty-state-container')).toBeInTheDocument();
    expect(screen.getByTestId('empty-state-message')).toHaveTextContent(
      "Looks like you don't have any Bookmarks, add some to see the magic! 🪄✨"
    );
  });

  it('renders border between header and content', () => {
    when(mockUseBookmarks)
      .calledWith()
      .thenReturn({
        currentPage: 'root' as PageId,
        pageContainers: [
          {
            id: 'folder-1',
            title: 'Test Folder',
            children: [{ id: 'item-1', title: 'Test Item', url: 'https://example.com' }],
          },
        ],
      });

    render(
      <AllProviders>
        <BookmarkFolderContent />
      </AllProviders>
    );

    const borderElement = document.querySelector('.w-full.border-b.border-bgColor-tertiary');
    expect(borderElement).toBeInTheDocument();
  });
});
