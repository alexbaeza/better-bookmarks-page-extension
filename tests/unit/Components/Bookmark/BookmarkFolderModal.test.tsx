import { fireEvent, render, screen } from '@testing-library/react';
import { BookmarkFolderModal } from '../../../../src/Components/Bookmark/BookmarkFolderModal';

describe('BookmarkFolderModal', () => {
  const name = 'Test Folder';
  const folderContents = [
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

  it('renders the folder name', () => {
    render(
      <BookmarkFolderModal title={name} folderContents={folderContents} />
    );
    expect(screen.getByText(name)).toBeInTheDocument();
  });

  it('displays the folder contents when clicked', () => {
    render(
      <BookmarkFolderModal title={name} folderContents={folderContents} />
    );
    fireEvent.click(screen.getByTestId('bookmark-folder-item'));
    expect(
      screen.getByTestId('bookmark-folder-content-modal')
    ).toBeInTheDocument();
  });

  it('hides the folder contents when closed', () => {
    render(
      <BookmarkFolderModal title={name} folderContents={folderContents} />
    );
    fireEvent.click(screen.getByTestId('bookmark-folder-item'));
    expect(
      screen.getByTestId('bookmark-folder-content-modal')
    ).toBeInTheDocument();
    fireEvent.click(
      screen.getByTestId('bookmark-folder-content-modal-close-button')
    );
    expect(
      screen.queryByTestId('bookmark-folder-content-modal')
    ).not.toBeInTheDocument();
  });

  it('does not render child elements for items with no URL and no children', () => {
    render(
      <BookmarkFolderModal title={name} folderContents={folderContents} />
    );
    fireEvent.click(screen.getByTestId('bookmark-folder-item'));
    expect(
      screen.getByTestId('bookmark-folder-item-modal')
    ).toBeInTheDocument();
    expect(screen.queryByTestId('bookmark-item')).not.toBeInTheDocument();
  });
});
