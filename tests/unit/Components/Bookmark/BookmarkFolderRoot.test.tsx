import { render, screen } from '@testing-library/react';
import {
  BookmarkFolderRoot,
  IBookmarkItem
} from '../../../../src/Components/Bookmark/BookmarkFolderRoot';
import { when } from 'jest-when';
import { viewModeAtom } from '../../../../src/Context/atoms';
import * as jotai from 'jotai';
import { BookmarkDisplayMode } from '../../../../src/types.d';

describe('BookmarkFolderRoot', () => {
  const name = 'Test Folder';
  const folderContents: IBookmarkItem[] = [
    {
      id: '1',
      title: 'Bookmark 1',
      index: 1,
      dateAdded: 123456789,
      parentId: '0',
      url: 'https://www.example.com'
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
              url: 'https://www.example.com/sub1'
            },
            {
              id: '5',
              title: 'Sub-Bookmark 2',
              index: 2,
              dateAdded: 123456789,
              parentId: '3',
              url: 'https://www.example.com/sub2'
            }
          ]
        }
      ]
    }
  ];

  let spy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    spy = jest.spyOn(jotai, 'useAtomValue');

    when(spy)
      .calledWith(viewModeAtom)
      .mockReturnValue(BookmarkDisplayMode.Grid);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders the folder name and count correctly', () => {
    render(<BookmarkFolderRoot name={name} folderContents={folderContents} />);
    expect(screen.getByText(name)).toBeInTheDocument();
    expect(screen.getByText(`${folderContents.length}`)).toBeInTheDocument();
  });

  it('renders without errors when empty folder contents', () => {
    render(<BookmarkFolderRoot name={name} folderContents={[]} />);
  });

  it('renders all the bookmark items in the folder', () => {
    render(<BookmarkFolderRoot name={name} folderContents={folderContents} />);
    const bookMarkFolderItems = screen.getAllByTestId(
      /bookmark-folder-content-modal-*/
    );
    expect(bookMarkFolderItems.length).toBe(1);
    expect(bookMarkFolderItems[0]).toHaveTextContent('Bookmark Folder 1');

    const bookmarkItems = screen.getAllByTestId(/bookmark-item-*/);
    expect(bookmarkItems.length).toBe(1);
  });

  it('renders all the bookmark items in the folder in list mode', () => {
    const folderContents: IBookmarkItem[] = [
      {
        id: '1',
        title: 'Bookmark 1',
        index: 1,
        dateAdded: 123456789,
        parentId: '0',
        url: 'https://www.example.com'
      },
      {
        id: '2',
        title: 'Bookmark 2',
        index: 2,
        dateAdded: 123456789,
        parentId: '0',
        url: 'https://www.example.com'
      }
    ];
    when(spy)
      .calledWith(viewModeAtom)
      .mockReturnValue(BookmarkDisplayMode.List);

    render(<BookmarkFolderRoot name={name} folderContents={folderContents} />);

    const container = screen.getByTestId('display-mode-container');
    expect(container).toHaveClass('flew flex-row');

    const bookmarkItems = screen.getAllByTestId(/bookmark-item-*/);
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
        url: 'https://www.example.com'
      },
      {
        id: '2',
        title: 'Bookmark 2',
        index: 2,
        dateAdded: 123456789,
        parentId: '0',
        url: 'https://www.example.com'
      }
    ];

    render(<BookmarkFolderRoot name={name} folderContents={folderContents} />);

    const container = screen.getByTestId('display-mode-container');
    expect(container).toHaveClass('grid');

    const bookmarkItems = screen.getAllByTestId(/bookmark-item-*/);
    expect(bookmarkItems.length).toBe(2);
  });
});
