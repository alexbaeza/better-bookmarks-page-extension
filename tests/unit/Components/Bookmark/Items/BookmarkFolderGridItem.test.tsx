import { fireEvent, render, screen } from '@testing-library/react';
import { BookmarkFolderGridItem } from '../../../../../src/Components/Bookmark/Items/BookmarkFolderGridItem';

describe('BookmarkFolderGridItem', () => {
  const onClickMock = jest.fn();
  const title = 'Test folder';

  it('renders folder icon and title', () => {
    render(<BookmarkFolderGridItem onClick={onClickMock} title={title} />);
    expect(screen.getByTestId('folder-icon')).toBeInTheDocument();
    expect(screen.getByText(title)).toBeInTheDocument();
  });

  it('calls the onClick function when clicked', () => {
    render(<BookmarkFolderGridItem onClick={onClickMock} title={title} />);
    fireEvent.click(screen.getByTestId('folder-icon'));
    expect(onClickMock).toHaveBeenCalledTimes(1);
  });
});
