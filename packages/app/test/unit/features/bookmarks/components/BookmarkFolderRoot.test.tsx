import { screen } from '@testing-library/react';
import { vi } from 'vitest';

import { BookmarkFolderRoot, type IBookmarkItem } from '@/features/bookmarks/components/BookmarkFolderRoot';
import { renderWithModalProvider } from '~test/test-utils';

describe('BookmarkFolderRoot', () => {
  const name = 'Test Folder';
  const folderContents: IBookmarkItem[] = [
    {
      dateAdded: 123456789,
      id: '1',
      index: 1,
      parentId: '0',
      title: 'Bookmark 1',
      url: 'https://www.example.com',
    },
    {
      children: [
        {
          children: [
            {
              dateAdded: 123456789,
              id: '4',
              index: 1,
              parentId: '3',
              title: 'Sub-Bookmark 1',
              url: 'https://www.example.com/sub1',
            },
            {
              dateAdded: 123456789,
              id: '5',
              index: 2,
              parentId: '3',
              title: 'Sub-Bookmark 2',
              url: 'https://www.example.com/sub2',
            },
          ],
          dateAdded: 123456789,
          id: '3',
          index: 1,
          parentId: '2',
          title: 'Subfolder',
        },
      ],
      dateAdded: 123456789,
      id: '2',
      index: 2,
      parentId: '0',
      title: 'Bookmark Folder 1',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the folder name and count correctly', () => {
    renderWithModalProvider(<BookmarkFolderRoot folderContents={folderContents} name={name} />);
    expect(screen.getByText(name)).toBeInTheDocument();
    expect(screen.getByText(`${folderContents.length}`)).toBeInTheDocument();
  });

  it('renders without errors when empty folder contents', () => {
    renderWithModalProvider(<BookmarkFolderRoot folderContents={[]} name={name} />);
    expect(screen.getByText(name)).toBeInTheDocument();
  });

  it('renders all the bookmark items in the folder', () => {
    renderWithModalProvider(<BookmarkFolderRoot folderContents={folderContents} name={name} />);

    const bookmarkItems = screen.getAllByTestId(/bookmark-item-/);
    expect(bookmarkItems.length).toBe(1);

    const folderItem = screen.getByText('Bookmark Folder 1');
    expect(folderItem).toBeInTheDocument();

    const bookmarkItem = screen.getByText('Bookmark 1');
    expect(bookmarkItem).toBeInTheDocument();
  });

  it('renders all the bookmark items in the folder in list mode', () => {
    const folderContents: IBookmarkItem[] = [
      {
        dateAdded: 123456789,
        id: '1',
        index: 1,
        parentId: '0',
        title: 'Bookmark 1',
        url: 'https://www.example.com',
      },
      {
        dateAdded: 123456789,
        id: '2',
        index: 2,
        parentId: '0',
        title: 'Bookmark 2',
        url: 'https://www.example.com',
      },
    ];

    renderWithModalProvider(<BookmarkFolderRoot folderContents={folderContents} name={name} />);

    const bookmarkItems = screen.getAllByTestId(/bookmark-item-/);
    expect(bookmarkItems.length).toBe(2);
    expect(bookmarkItems[0]).toHaveTextContent('Bookmark 1');
    expect(bookmarkItems[1]).toHaveTextContent('Bookmark 2');
  });

  it('renders all the bookmark items in the folder in grid mode', () => {
    const folderContents: IBookmarkItem[] = [
      {
        dateAdded: 123456789,
        id: '1',
        index: 1,
        parentId: '0',
        title: 'Bookmark 1',
        url: 'https://www.example.com',
      },
      {
        dateAdded: 123456789,
        id: '2',
        index: 2,
        parentId: '0',
        title: 'Bookmark 2',
        url: 'https://www.example.com',
      },
    ];

    renderWithModalProvider(<BookmarkFolderRoot folderContents={folderContents} name={name} />);

    const bookmarkItems = screen.getAllByTestId(/bookmark-item-/);
    expect(bookmarkItems.length).toBe(2);
    expect(bookmarkItems[0]).toHaveTextContent('Bookmark 1');
    expect(bookmarkItems[1]).toHaveTextContent('Bookmark 2');
  });
});
