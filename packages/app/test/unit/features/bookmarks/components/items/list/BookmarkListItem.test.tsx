import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { BookmarkListItem } from '@/features/bookmarks/components/items/list/BookmarkListItem';
import { AllProviders } from '~test/test-utils';

// Mock react-dnd hooks to avoid drag-drop context issues in tests
vi.mock('react-dnd', () => ({
  useDrop: () => [{ isOver: false, canDrop: false }, vi.fn()],
}));

vi.mock('@/features/bookmarks/contexts/BookmarkNavigationContext', () => ({
  useBookmarkNavigation: () => ({
    navigateToFolder: vi.fn(),
    currentPage: 'All',
    setCurrentPage: vi.fn(),
    navigateToPage: vi.fn(),
    navigateBack: vi.fn(),
    canGoBack: false,
    navigationStack: ['All'],
  }),
}));

vi.mock('@/features/bookmarks/hooks/useBookmarks', () => ({
  useBookmarks: () => ({
    searchTerm: '',
    counts: { all: 0, uncategorized: 0 },
    isLoading: false,
    rawFolders: [],
    currentPage: 'All',
    error: null,
    items: [],
    pageContainers: [],
    setSearchTerm: vi.fn(),
    setCurrentPage: vi.fn(),
    create: vi.fn(),
    move: vi.fn(),
    remove: vi.fn(),
    update: vi.fn(),
    updateLayout: vi.fn(),
  }),
}));

vi.mock('@/features/bookmarks/hooks/useBookmarkModals', () => ({
  useBookmarkModals: () => ({
    openEditModal: vi.fn(),
    openDeleteModal: vi.fn(),
    openFolderModal: vi.fn(),
  }),
}));

describe('BookmarkListItem', () => {
  const mockBookmark = {
    id: '1',
    title: 'Test Bookmark',
    url: 'https://example.com',
  };

  const mockFolder = {
    id: '2',
    title: 'Test Folder',
    children: [],
  };

  it('should render bookmark item', () => {
    render(
      <AllProviders>
        <BookmarkListItem item={mockBookmark} />
      </AllProviders>
    );
    expect(screen.getByText('Test Bookmark')).toBeInTheDocument();
  });

  it('should render folder item', () => {
    render(
      <AllProviders>
        <BookmarkListItem item={mockFolder} />
      </AllProviders>
    );
    expect(screen.getByText('Test Folder')).toBeInTheDocument();
  });

  it('should apply dataTestId', () => {
    render(
      <AllProviders>
        <BookmarkListItem dataTestId="test-item" item={mockBookmark} />
      </AllProviders>
    );
    expect(screen.getByTestId('test-item')).toBeInTheDocument();
  });

  it('should handle onFolderClick when provided', () => {
    const onFolderClick = vi.fn();
    render(
      <AllProviders>
        <BookmarkListItem item={mockFolder} onFolderClick={onFolderClick} />
      </AllProviders>
    );
    expect(screen.getByText('Test Folder')).toBeInTheDocument();
  });
});
