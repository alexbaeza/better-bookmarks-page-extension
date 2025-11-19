import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { when } from 'vitest-when';
import { BookmarkFolderModal } from '@/features/bookmarks/containers/BookmarkFolderModal';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { AllProviders } from '~test/test-utils';

let mockHideModal = vi.fn<() => void>();
let mockUseBookmarks = vi.fn();

vi.mock('@/app/providers/modal-context', () => ({
  useModal: () => ({ hideModal: mockHideModal }),
  ModalProvider: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}));

vi.mock('@/features/bookmarks/hooks/useBookmarks', () => ({
  useBookmarks: () => mockUseBookmarks(),
}));

vi.mock('@/shared/ui/Modal', () => ({
  Modal: ({
    children,
    dataTestId,
    title,
    onClose,
  }: {
    children: React.ReactNode;
    dataTestId?: string;
    title: string;
    onClose: () => void;
  }) => (
    <div data-testid={dataTestId || 'bookmark-folder-modal'}>
      <div data-testid="modal-title">{title}</div>
      <button data-testid="modal-close" onClick={onClose} type="button">
        Close
      </button>
      {children}
    </div>
  ),
}));

vi.mock('@/features/bookmarks/components/BookmarkFolderContainer', () => ({
  BookmarkFolderContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="bookmark-folder-container">{children}</div>
  ),
}));

vi.mock('@/features/bookmarks/containers/BookmarkDisplayArea', () => ({
  BookmarkDisplayArea: ({ folderContents, folderId }: { folderContents: IBookmarkItem[]; folderId: string }) => (
    <div data-testid="bookmark-display-area">
      Display Area for folder {folderId} with {folderContents.length} items
    </div>
  ),
}));

describe('BookmarkFolderModal', () => {
  const mockFolderContents: IBookmarkItem[] = [
    {
      id: 'item-1',
      title: 'Test Bookmark 1',
      url: 'https://example1.com',
      parentId: 'folder-1',
    },
    {
      id: 'item-2',
      title: 'Test Bookmark 2',
      url: 'https://example2.com',
      parentId: 'folder-1',
    },
  ];

  const defaultProps = {
    folderContents: mockFolderContents,
    folderId: 'folder-1',
    folderTitle: 'Test Folder',
  };

  beforeEach(() => {
    mockHideModal = vi.fn<() => void>();
    mockUseBookmarks = vi.fn();
    when(mockUseBookmarks)
      .calledWith()
      .thenReturn({
        rawFolders: [
          {
            id: 'folder-1',
            title: 'Test Folder',
            children: mockFolderContents,
          },
        ],
      });
  });

  it('renders modal with correct title and dataTestId', () => {
    render(
      <AllProviders>
        <BookmarkFolderModal {...defaultProps} />
      </AllProviders>
    );

    expect(screen.getByTestId('bookmark-folder-modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-title')).toHaveTextContent('Test Folder');
  });

  it('renders folder icon', () => {
    render(
      <AllProviders>
        <BookmarkFolderModal {...defaultProps} />
      </AllProviders>
    );

    const iconContainer = document.querySelector('.flex.size-14.items-center.justify-center');
    expect(iconContainer).toBeInTheDocument();
  });

  it('renders BookmarkFolderContainer and BookmarkDisplayArea', () => {
    render(
      <AllProviders>
        <BookmarkFolderModal {...defaultProps} />
      </AllProviders>
    );

    expect(screen.getByTestId('bookmark-folder-container')).toBeInTheDocument();
    expect(screen.getByTestId('bookmark-display-area')).toHaveTextContent(
      'Display Area for folder folder-1 with 2 items'
    );
  });

  it('passes initial folder contents to display area', () => {
    render(
      <AllProviders>
        <BookmarkFolderModal {...defaultProps} />
      </AllProviders>
    );

    expect(screen.getByTestId('bookmark-display-area')).toHaveTextContent('with 2 items');
  });

  it('updates folder contents when rawFolders changes', () => {
    const { rerender } = render(
      <AllProviders>
        <BookmarkFolderModal {...defaultProps} />
      </AllProviders>
    );

    expect(screen.getByTestId('bookmark-display-area')).toHaveTextContent('with 2 items');

    const updatedContents = [
      ...mockFolderContents,
      {
        id: 'item-3',
        title: 'New Bookmark',
        url: 'https://example3.com',
        parentId: 'folder-1',
      },
    ];

    when(mockUseBookmarks)
      .calledWith()
      .thenReturn({
        rawFolders: [
          {
            id: 'folder-1',
            title: 'Test Folder',
            children: updatedContents,
          },
        ],
      });

    rerender(
      <AllProviders>
        <BookmarkFolderModal {...defaultProps} />
      </AllProviders>
    );

    expect(screen.getByTestId('bookmark-display-area')).toHaveTextContent('with 3 items');
  });

  it('does not update folder contents when folder not found in rawFolders', () => {
    when(mockUseBookmarks)
      .calledWith()
      .thenReturn({
        rawFolders: [
          {
            id: 'different-folder',
            title: 'Different Folder',
            children: [],
          },
        ],
      });

    render(
      <AllProviders>
        <BookmarkFolderModal {...defaultProps} />
      </AllProviders>
    );

    expect(screen.getByTestId('bookmark-display-area')).toHaveTextContent('with 2 items');
  });

  it('handles empty initial folder contents', () => {
    when(mockUseBookmarks)
      .calledWith()
      .thenReturn({
        rawFolders: [
          {
            id: 'folder-1',
            title: 'Test Folder',
            children: [], // Empty children in mock
          },
        ],
      });

    render(
      <AllProviders>
        <BookmarkFolderModal {...defaultProps} folderContents={[]} />
      </AllProviders>
    );

    expect(screen.getByTestId('bookmark-display-area')).toHaveTextContent('with 0 items');
  });

  it('applies correct CSS classes to modal content', () => {
    render(
      <AllProviders>
        <BookmarkFolderModal {...defaultProps} />
      </AllProviders>
    );

    const modalContent = document.querySelector('.p-4');
    expect(modalContent).toBeInTheDocument();

    const iconContainer = document.querySelector('.mx-auto.mb-4.flex.size-14');
    expect(iconContainer).toBeInTheDocument();
  });

  it('passes custom dataTestId', () => {
    render(
      <AllProviders>
        <BookmarkFolderModal {...defaultProps} dataTestId="custom-modal" />
      </AllProviders>
    );

    expect(screen.getByTestId('custom-modal')).toBeInTheDocument();
  });
});
