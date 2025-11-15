import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { BookmarkMasonryLayout } from '@/features/bookmarks/components/layout/BookmarkMasonryLayout';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { AllProviders } from '~test/test-utils';

const mockUseContainerWidth = vi.fn();
const mockUseMasonryLayout = vi.fn();

vi.mock('@/features/bookmarks/hooks/useContainerWidth', () => ({
  useContainerWidth: () => mockUseContainerWidth(),
}));

vi.mock('@/features/bookmarks/hooks/useMasonryLayout', () => ({
  useMasonryLayout: () => mockUseMasonryLayout(),
}));

vi.mock('@/features/bookmarks/components/layout/BookmarkMasonryColumn', () => ({
  BookmarkMasonryColumn: ({
    folderId,
    name,
    folderContents,
  }: {
    folderId: string;
    name: string;
    folderContents: IBookmarkItem[];
  }) => (
    <div data-testid={`masonry-column-${folderId}`}>
      <h2>{name}</h2>
      <span>Items: {folderContents.length}</span>
    </div>
  ),
}));

const mockFolders: IBookmarkItem[] = [
  {
    id: 'folder1',
    title: 'Folder 1',
    children: [
      { id: 'item1', title: 'Item 1', url: 'https://example1.com', dateAdded: Date.now() },
      { id: 'item2', title: 'Item 2', url: 'https://example2.com', dateAdded: Date.now() },
    ],
  },
  {
    id: 'folder2',
    title: 'Folder 2',
    children: [{ id: 'item3', title: 'Item 3', url: 'https://example3.com', dateAdded: Date.now() }],
  },
  {
    id: 'folder3',
    title: 'Folder 3',
    children: [],
  },
];

describe('BookmarkMasonryLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseContainerWidth.mockReturnValue({ containerWidth: 1200, containerRef: vi.fn() });
    mockUseMasonryLayout.mockReturnValue([
      { items: [mockFolders[0]], key: 'column-0' },
      { items: [mockFolders[1]], key: 'column-1' },
      { items: [mockFolders[2]], key: 'column-2' },
    ]);
  });

  it('renders single folder without masonry layout when folders length <= 1', () => {
    render(
      <AllProviders>
        <BookmarkMasonryLayout folders={[mockFolders[0]]} />
      </AllProviders>
    );

    expect(screen.getByTestId('masonry-column-folder1')).toBeInTheDocument();
    expect(screen.getByText('Folder 1')).toBeInTheDocument();
    expect(screen.getByText('Items: 2')).toBeInTheDocument();
  });

  it('renders multiple folders with masonry layout when folders length > 1', () => {
    render(
      <AllProviders>
        <BookmarkMasonryLayout folders={mockFolders} />
      </AllProviders>
    );

    expect(screen.getByTestId('masonry-column-folder1')).toBeInTheDocument();
    expect(screen.getByTestId('masonry-column-folder2')).toBeInTheDocument();
    expect(screen.getByTestId('masonry-column-folder3')).toBeInTheDocument();
  });

  it.each([
    [600, 1, '< 640'],
    [700, 1, '>= 640 but < 768'],
    [800, 2, '>= 768 but < 1024'],
    [1100, 4, '>= 1024 but < 1536'],
    [1600, 4, '>= 1536'],
  ])('calculates correct column count (%i px width = %i columns) for %s', (width, expectedColumns) => {
    mockUseContainerWidth.mockReturnValue({ containerWidth: width, containerRef: vi.fn() });
    mockUseMasonryLayout.mockReturnValue(
      Array.from({ length: expectedColumns }, (_, i) => ({
        items: [mockFolders[i % mockFolders.length]].filter(Boolean),
        key: `column-${i}`,
      }))
    );

    render(
      <AllProviders>
        <BookmarkMasonryLayout folders={mockFolders} />
      </AllProviders>
    );

    const columns = document.querySelectorAll('.flex.min-w-0.flex-col.gap-4');
    expect(columns).toHaveLength(expectedColumns);
  });

  it('handles zero container width with default value', () => {
    mockUseContainerWidth.mockReturnValue({ containerWidth: 0, containerRef: vi.fn() });
    mockUseMasonryLayout.mockReturnValue([{ items: mockFolders, key: 'column-0' }]);

    render(
      <AllProviders>
        <BookmarkMasonryLayout folders={mockFolders} />
      </AllProviders>
    );

    expect(screen.getByTestId('masonry-column-folder1')).toBeInTheDocument();
  });

  it('passes correct props to masonry columns', () => {
    render(
      <AllProviders>
        <BookmarkMasonryLayout folders={mockFolders} />
      </AllProviders>
    );

    expect(screen.getByText('Folder 1')).toBeInTheDocument();
    expect(screen.getByText('Folder 2')).toBeInTheDocument();
    expect(screen.getByText('Folder 3')).toBeInTheDocument();

    expect(screen.getAllByText('Items: 2')).toHaveLength(1); // folder1
    expect(screen.getAllByText('Items: 1')).toHaveLength(1); // folder2
    expect(screen.getAllByText('Items: 0')).toHaveLength(1); // folder3
  });

  it('ensures all columns have containers even when empty', () => {
    mockUseMasonryLayout.mockReturnValue([
      { items: [mockFolders[0]], key: 'column-0' },
      { items: [], key: 'column-1' },
      { items: [mockFolders[1]], key: 'column-2' },
    ]);

    render(
      <AllProviders>
        <BookmarkMasonryLayout folders={mockFolders} />
      </AllProviders>
    );

    expect(screen.getByTestId('masonry-column-folder1')).toBeInTheDocument();
    expect(screen.getByTestId('masonry-column-folder2')).toBeInTheDocument();
  });

  it('applies correct CSS classes for grid layout', () => {
    render(
      <AllProviders>
        <BookmarkMasonryLayout folders={mockFolders} />
      </AllProviders>
    );

    const gridContainer = document.querySelector(
      '.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-3.2xl\\:grid-cols-4.gap-4'
    );
    expect(gridContainer).toBeInTheDocument();
  });

  it('handles empty folders array', () => {
    render(
      <AllProviders>
        <BookmarkMasonryLayout folders={[]} />
      </AllProviders>
    );

    expect(document.querySelector('.w-full.p-4')).toBeInTheDocument();
  });

  it('passes container ref to the container element', () => {
    const mockRef = vi.fn();
    mockUseContainerWidth.mockReturnValue({ containerWidth: 1200, containerRef: mockRef });

    render(
      <AllProviders>
        <BookmarkMasonryLayout folders={mockFolders} />
      </AllProviders>
    );

    const container = document.querySelector('.w-full.p-4');
    expect(container).toBeInTheDocument();
  });
});
