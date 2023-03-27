import React from 'react';
import { render, screen } from '@testing-library/react';
import {
  BookmarkFolderRoot,
  IBookmarkItem
} from '../../../../src/Components/Bookmark/BookmarkFolderRoot';

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
    expect(bookmarkItems[0]).toHaveTextContent('Bookmark 1');
  });
});
