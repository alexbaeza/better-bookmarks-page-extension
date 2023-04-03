import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { when } from 'jest-when';

import * as jotai from 'jotai';
import { BookmarkDisplayMode, BookmarkType } from '../../../../../src/types.d';
import { viewModeAtom } from '../../../../../src/Context/atoms';
import { BookmarkItem } from '../../../../../src/Components/Bookmark/Items/BookmarkItem';

describe('BookmarkItem', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    spy = jest.spyOn(jotai, 'useAtomValue');
    when(spy)
      .calledWith(viewModeAtom)
      .mockReturnValue(['background-image.png', jest.fn() as never]);
  });
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should render BookmarkListItem when view mode is list and type is item', () => {
    when(spy)
      .calledWith(viewModeAtom)
      .mockReturnValue(BookmarkDisplayMode.List);

    render(
      <BookmarkItem
        dataTestId="bookmark-list-item"
        title="Test Bookmark"
        url="https://www.example.com"
        type={BookmarkType.Item}
      />
    );
    expect(screen.getByTestId('bookmark-list-item')).toBeInTheDocument();
    expect(screen.queryByTestId('bookmark-grid-item')).toBeNull();
  });

  it('should render BookmarkGridItem when view mode is grid and type is item', () => {
    when(spy)
      .calledWith(viewModeAtom)
      .mockReturnValue(BookmarkDisplayMode.Grid);

    render(
      <BookmarkItem
        dataTestId="bookmark-grid-item"
        title="Test Bookmark"
        url="https://www.example.com"
        type={BookmarkType.Item}
      />
    );
    expect(screen.getByTestId('bookmark-grid-item')).toBeInTheDocument();
    expect(screen.queryByTestId('bookmark-list-item')).toBeNull();
  });

  it('should render BookmarkFolderListItem when view mode is list and type is folder', () => {
    when(spy)
      .calledWith(viewModeAtom)
      .mockReturnValue(BookmarkDisplayMode.List);

    render(
      <BookmarkItem
        dataTestId="bookmark-folder-list-item"
        title="Test Folder"
        onClickAction={jest.fn()}
        type={BookmarkType.Folder}
      />
    );
    expect(screen.getByTestId('bookmark-folder-list-item')).toBeInTheDocument();
    expect(screen.queryByTestId('bookmark-folder-grid-item')).toBeNull();
  });

  it('should render BookmarkFolderGridItem when view mode is grid and type is folder', () => {
    when(spy)
      .calledWith(viewModeAtom)
      .mockReturnValue(BookmarkDisplayMode.Grid);

    render(
      <BookmarkItem
        dataTestId="bookmark-folder-grid-item"
        title="Test Folder"
        onClickAction={jest.fn()}
        type={BookmarkType.Folder}
      />
    );
    expect(screen.getByTestId('bookmark-folder-grid-item')).toBeInTheDocument();
    expect(screen.queryByTestId('bookmark-folder-list-item')).toBeNull();
  });

  it('should call onClickAction when BookmarkFolderListItem is clicked', () => {
    when(spy)
      .calledWith(viewModeAtom)
      .mockReturnValue(BookmarkDisplayMode.List);

    const mockOnClick = jest.fn();
    render(
      <BookmarkItem
        dataTestId="bookmark-folder-list-item"
        title="Test Folder"
        onClickAction={mockOnClick}
        type={BookmarkType.Folder}
      />
    );
    const button = screen.getByTestId('bookmark-folder-list-item');
    act(() => {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should call onClickAction when BookmarkFolderGridItem is clicked', () => {
    when(spy)
      .calledWith(viewModeAtom)
      .mockReturnValue(BookmarkDisplayMode.Grid);
    const mockOnClick = jest.fn();

    render(
      <BookmarkItem
        dataTestId="bookmark-folder-grid-item"
        title="Test Folder"
        onClickAction={mockOnClick}
        type={BookmarkType.Folder}
      />
    );
    const button = screen.getByTestId('bookmark-folder-grid-item');
    act(() => {
      button.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
