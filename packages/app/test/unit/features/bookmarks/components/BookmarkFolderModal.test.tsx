import { vi } from 'vitest';

import { BookmarkFolderModal } from '@/features/bookmarks/containers/BookmarkFolderModal';
import type { IBookmarkItem } from '@/shared/types/bookmarks';
import { fireEvent, render, screen } from '~test/test-utils';

// Mock the modal context using importOriginal
const mockHideModal = vi.fn();
vi.mock('@/app/providers/modal-context', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/app/providers/modal-context')>();
  return {
    ...actual,
    useModal: () => ({
      hideModal: mockHideModal,
    }),
  };
});

describe('BookmarkFolderModal', () => {
  beforeEach(() => {
    mockHideModal.mockClear();
  });

  it('renders the folder name', () => {
    const name = 'Test Folder';
    const items: IBookmarkItem[] = [] as unknown as IBookmarkItem[];

    render(<BookmarkFolderModal folderContents={items} folderId="1" folderTitle={name} />);

    expect(screen.getByText(name)).toBeInTheDocument();
  });

  it('displays the folder contents when clicked', () => {
    const name = 'Test Folder';
    const folderContents: IBookmarkItem[] = [{ id: '1', title: 'Item 1', url: 'http://example.com' } as IBookmarkItem];

    render(<BookmarkFolderModal folderContents={folderContents} folderId="1" folderTitle={name} />);

    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });

  it('calls hideModal when close button is clicked', () => {
    const name = 'Test Folder';
    const folderContents: IBookmarkItem[] = [{ id: '1', title: 'Item 1', url: 'http://example.com' } as IBookmarkItem];

    render(<BookmarkFolderModal folderContents={folderContents} folderId="1" folderTitle={name} />);

    const closeButton = screen.getByTestId('bookmark-folder-modal-close-button');
    fireEvent.click(closeButton);

    expect(mockHideModal).toHaveBeenCalled();
  });

  it('renders items even when they have no URL and no children', () => {
    const name = 'Test Folder';
    const folderContents: IBookmarkItem[] = [{ id: '1', title: 'Empty Item' } as IBookmarkItem];

    render(<BookmarkFolderModal folderContents={folderContents} folderId="1" folderTitle={name} />);

    // Items without URL or children should still render their title
    expect(screen.getByText('Empty Item')).toBeInTheDocument();
  });
});
