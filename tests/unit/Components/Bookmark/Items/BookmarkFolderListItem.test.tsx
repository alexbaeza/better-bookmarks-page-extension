import { render, screen, fireEvent } from '@testing-library/react';
import { BookmarkFolderListItem } from '../../../../../src/Components/Bookmark/Items/BookmarkFolderListItem';

describe('BookmarkFolderListItem', () => {
  const title = 'Test Folder';
  const onClick = jest.fn();
  const dataTestId = 'bookmark-folder-list-item';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the folder title', () => {
    render(
      <BookmarkFolderListItem
        title={title}
        onClick={onClick}
        dataTestId={dataTestId}
      />
    );
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    render(
      <BookmarkFolderListItem
        title={title}
        onClick={onClick}
        dataTestId={dataTestId}
      />
    );
    fireEvent.click(screen.getByTestId(dataTestId));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
