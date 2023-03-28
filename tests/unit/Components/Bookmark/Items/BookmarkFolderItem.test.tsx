import { fireEvent, render, screen } from '@testing-library/react';
import { BookmarkFolderItem } from '../../../../../src/Components/Bookmark/Items/BookmarkFolderItem';

describe('BookmarkFolderItem', () => {
  const mockOnClick = jest.fn();
  const name = 'Test Folder';

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders the name prop correctly', () => {
    render(<BookmarkFolderItem onClick={mockOnClick} name={name} />);
    expect(screen.getByText(name)).toBeInTheDocument();
  });

  it('renders the FolderIcon component', () => {
    render(<BookmarkFolderItem onClick={mockOnClick} name={name} />);
    expect(screen.getByTestId('folder-icon')).toBeInTheDocument();
  });

  it('calls the onClick function when clicked', () => {
    render(<BookmarkFolderItem onClick={mockOnClick} name={name} />);
    fireEvent.click(screen.getByRole('button'));
    expect(mockOnClick).toHaveBeenCalled();
  });
});
