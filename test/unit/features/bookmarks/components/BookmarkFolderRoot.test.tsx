import { screen } from '@testing-library/react';
import * as jotai from 'jotai';
import { vi } from 'vitest';
import { when } from 'vitest-when';

import { viewModeAtom } from '@/app/providers/atoms';
import { BookmarkFolderRoot, type IBookmarkItem } from '@/features/bookmarks/components/BookmarkFolderRoot';
import { BookmarkDisplayMode } from '@/shared/types/ui';
import { renderWithModalProvider } from '~test/test-utils';

describe('BookmarkFolderRoot', () => {
  const name = 'Test Folder';
  const folderContents: IBookmarkItem[] = [
    {
      id: '1',
      title: 'Bookmark 1',
      index: 1,
      dateAdded: 123456789,
      parentId: '0',
      url: 'https://www.example.com',
    },
    {
      id: '2',
      title: 'Bookmark Folder 1',
      index: 2,
      dateAdded: 123456789,
      parentId: '0',
      children: [
        {
          id: '3',
          title: 'Subfolder',
          index: 1,
          dateAdded: 123456789,
          parentId: '2',
          children: [
            {
              id: '4',
              title: 'Sub-Bookmark 1',
              index: 1,
              dateAdded: 123456789,
              parentId: '3',
              url: 'https://www.example.com/sub1',
            },
            {
              id: '5',
              title: 'Sub-Bookmark 2',
              index: 2,
              dateAdded: 123456789,
              parentId: '3',
              url: 'https://www.example.com/sub2',
            },
          ],
        },
      ],
    },
  ];

  let spy: vi.SpyInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    spy = vi.spyOn(jotai, 'useAtomValue');

    when(spy).calledWith(viewModeAtom).thenReturn(BookmarkDisplayMode.Grid);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders the folder name and count correctly', () => {
    renderWithModalProvider(<BookmarkFolderRoot name={name} folderContents={folderContents} />);
    expect(screen.getByText(name)).toBeInTheDocument();
    expect(screen.getByText(`${folderContents.length}`)).toBeInTheDocument();
  });

  it('renders without errors when empty folder contents', () => {
    renderWithModalProvider(<BookmarkFolderRoot name={name} folderContents={[]} />);
    expect(screen.getByText(name)).toBeInTheDocument();
  });

  it('renders all the bookmark items in the folder', () => {
    renderWithModalProvider(<BookmarkFolderRoot name={name} folderContents={folderContents} />);

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
        id: '1',
        title: 'Bookmark 1',
        index: 1,
        dateAdded: 123456789,
        parentId: '0',
        url: 'https://www.example.com',
      },
      {
        id: '2',
        title: 'Bookmark 2',
        index: 2,
        dateAdded: 123456789,
        parentId: '0',
        url: 'https://www.example.com',
      },
    ];
    when(spy).calledWith(viewModeAtom).thenReturn(BookmarkDisplayMode.List);

    renderWithModalProvider(<BookmarkFolderRoot name={name} folderContents={folderContents} />);

    const bookmarkItems = screen.getAllByTestId(/bookmark-item-/);
    expect(bookmarkItems.length).toBe(2);
    expect(bookmarkItems[0]).toHaveTextContent('Bookmark 1');
    expect(bookmarkItems[1]).toHaveTextContent('Bookmark 2');
  });

  it('renders all the bookmark items in the folder in grid mode', () => {
    const folderContents: IBookmarkItem[] = [
      {
        id: '1',
        title: 'Bookmark 1',
        index: 1,
        dateAdded: 123456789,
        parentId: '0',
        url: 'https://www.example.com',
      },
      {
        id: '2',
        title: 'Bookmark 2',
        index: 2,
        dateAdded: 123456789,
        parentId: '0',
        url: 'https://www.example.com',
      },
    ];

    renderWithModalProvider(<BookmarkFolderRoot name={name} folderContents={folderContents} />);

    const bookmarkItems = screen.getAllByTestId(/bookmark-item-/);
    expect(bookmarkItems.length).toBe(2);
    expect(bookmarkItems[0]).toHaveTextContent('Bookmark 1');
    expect(bookmarkItems[1]).toHaveTextContent('Bookmark 2');
  });
});
