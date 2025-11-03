import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BookmarkMasonryColumn } from '@/features/bookmarks/components/layout/BookmarkMasonryColumn';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { AllProviders } from '~test/test-utils';

const mockUseBookmarks = vi.fn();
const mockUseBookmarkActions = vi.fn();
const mockHighlighter = vi.fn();

vi.mock('@/features/bookmarks/hooks/useBookmarks', () => ({
  useBookmarks: () => mockUseBookmarks(),
}));

vi.mock('@/features/bookmarks/hooks/useBookmarkActions', () => ({
  useBookmarkActions: () => mockUseBookmarkActions(),
}));

vi.mock('@/features/bookmarks/lib/highlighter', () => ({
  highlighter: (text: string, searchTerm: string) => mockHighlighter(text, searchTerm),
}));

vi.mock('@/features/bookmarks/components/BookmarkFolderContainer', () => ({
  BookmarkFolderContainer: ({
    children,
    overflowVisible,
  }: {
    children: React.ReactNode;
    overflowVisible?: boolean;
  }) => (
    <div data-overflow-visible={overflowVisible} data-testid="bookmark-folder-container">
      {children}
    </div>
  ),
}));

vi.mock('@/features/bookmarks/containers/BookmarkDisplayArea', () => ({
  BookmarkDisplayArea: ({ folderContents, folderId }: { folderContents: IBookmarkItem[]; folderId: string }) => (
    <div data-folder-id={folderId} data-testid="bookmark-display-area">
      Display area with {folderContents.length} items
    </div>
  ),
}));

vi.mock('@/features/bookmarks/components/dnd/DroppableFolder', () => ({
  DroppableFolder: ({
    children,
    folderId,
    onDrop,
  }: {
    children: React.ReactNode;
    folderId: string;
    onDrop: (draggedItemId: string, fromFolderId: string, fromIndex: number) => void;
  }) => (
    <div
      data-folder-id={folderId}
      data-testid="droppable-folder"
      onClick={() => onDrop?.('dragged-item', 'from-folder', 0)}
      onKeyDown={() => onDrop?.('dragged-item', 'from-folder', 0)}
      role="button"
      tabIndex={0}
    >
      {children}
    </div>
  ),
}));

const mockFolderContents: IBookmarkItem[] = [
  { id: 'item1', title: 'Bookmark 1', url: 'https://example1.com', dateAdded: Date.now() },
  { id: 'item2', title: 'Bookmark 2', url: 'https://example2.com', dateAdded: Date.now() },
  { id: 'item3', title: 'Bookmark 3', url: 'https://example3.com', dateAdded: Date.now() },
];

describe('BookmarkMasonryColumn', () => {
  const defaultProps = {
    folderId: 'test-folder-123',
    name: 'Test Folder',
    folderContents: mockFolderContents,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockUseBookmarks.mockReturnValue({ searchTerm: '' });
    mockUseBookmarkActions.mockReturnValue({ move: vi.fn() });
    mockHighlighter.mockImplementation((text) => text); // Return text as-is by default
  });

  it('renders folder name and bookmark count', () => {
    render(
      <AllProviders>
        <BookmarkMasonryColumn {...defaultProps} />
      </AllProviders>
    );

    expect(screen.getByText('Test Folder')).toBeInTheDocument();
    expect(screen.getByTestId('bookmark-count-test-folder-123')).toHaveTextContent('3');
  });

  it('displays correct bookmark count', () => {
    render(
      <AllProviders>
        <BookmarkMasonryColumn {...defaultProps} folderContents={[]} />
      </AllProviders>
    );

    expect(screen.getByTestId('bookmark-count-test-folder-123')).toHaveTextContent('0');
  });

  it('applies correct CSS classes', () => {
    render(
      <AllProviders>
        <BookmarkMasonryColumn {...defaultProps} />
      </AllProviders>
    );

    const container = document.querySelector('.group.relative.w-full');
    expect(container).toBeInTheDocument();

    const header = document.querySelector('.mb-2.mt-3.flex.items-center.justify-between.space-x-2');
    expect(header).toBeInTheDocument();

    const title = document.querySelector('.leading-6.tracking-wide.uppercase');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent('Test Folder');
  });

  it('renders DroppableFolder with correct folderId', () => {
    render(
      <AllProviders>
        <BookmarkMasonryColumn {...defaultProps} />
      </AllProviders>
    );

    const droppableFolder = screen.getByTestId('droppable-folder');
    expect(droppableFolder).toHaveAttribute('data-folder-id', 'test-folder-123');
  });

  it('renders BookmarkFolderContainer with overflowVisible prop', () => {
    render(
      <AllProviders>
        <BookmarkMasonryColumn {...defaultProps} />
      </AllProviders>
    );

    const folderContainer = screen.getByTestId('bookmark-folder-container');
    expect(folderContainer).toHaveAttribute('data-overflow-visible', 'true');
  });

  it('renders BookmarkDisplayArea with correct props', () => {
    render(
      <AllProviders>
        <BookmarkMasonryColumn {...defaultProps} />
      </AllProviders>
    );

    const displayArea = screen.getByTestId('bookmark-display-area');
    expect(displayArea).toHaveAttribute('data-folder-id', 'test-folder-123');
    expect(displayArea).toHaveTextContent('Display area with 3 items');
  });

  it('handles drop events correctly', async () => {
    const mockMove = vi.fn().mockResolvedValue(undefined);
    mockUseBookmarkActions.mockReturnValue({ move: mockMove });

    render(
      <AllProviders>
        <BookmarkMasonryColumn {...defaultProps} />
      </AllProviders>
    );

    const droppableFolder = screen.getByTestId('droppable-folder');
    fireEvent.click(droppableFolder);

    expect(mockMove).toHaveBeenCalledWith('dragged-item', { parentId: 'test-folder-123' });
  });

  it('highlights folder name when search term is present', () => {
    mockUseBookmarks.mockReturnValue({ searchTerm: 'Test' });
    mockHighlighter.mockReturnValue('<mark>Test</mark> Folder');

    render(
      <AllProviders>
        <BookmarkMasonryColumn {...defaultProps} />
      </AllProviders>
    );

    expect(mockHighlighter).toHaveBeenCalledWith('Test Folder', 'Test');
  });

  it('handles empty folder contents', () => {
    render(
      <AllProviders>
        <BookmarkMasonryColumn {...defaultProps} folderContents={[]} />
      </AllProviders>
    );

    const displayArea = screen.getByTestId('bookmark-display-area');
    expect(displayArea).toHaveTextContent('Display area with 0 items');
  });

  it('handles undefined folder contents', () => {
    render(
      <AllProviders>
        <BookmarkMasonryColumn {...defaultProps} folderContents={undefined} />
      </AllProviders>
    );

    const displayArea = screen.getByTestId('bookmark-display-area');
    expect(displayArea).toHaveTextContent('Display area with 0 items');
  });

  it('passes folderId to move function in drop handler', () => {
    const mockMove = vi.fn();
    mockUseBookmarkActions.mockReturnValue({ move: mockMove });

    render(
      <AllProviders>
        <BookmarkMasonryColumn {...defaultProps} folderId="custom-folder-id" />
      </AllProviders>
    );

    const droppableFolder = screen.getByTestId('droppable-folder');
    fireEvent.click(droppableFolder);

    expect(mockMove).toHaveBeenCalledWith('dragged-item', { parentId: 'custom-folder-id' });
  });

  it('truncates long folder names', () => {
    const longName = 'This is a very long folder name that should be truncated';
    render(
      <AllProviders>
        <BookmarkMasonryColumn {...defaultProps} name={longName} />
      </AllProviders>
    );

    const title = document.querySelector('.truncate');
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent(longName);
  });
});
