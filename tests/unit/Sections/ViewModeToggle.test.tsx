import { fireEvent, render } from '@testing-library/react';
import * as jotai from 'jotai/index';
import { when } from 'jest-when';
import { viewModeAtom } from '../../../src/Context/atoms';
import { BookmarkDisplayMode } from '../../../src/types.d';
import { ViewModeToggle } from '../../../src/Sections/ViewModeToggle';

describe('ViewModeToggle', () => {
  let useAtomValueSpy: jest.SpyInstance;
  let useSetAtomSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    useAtomValueSpy = jest.spyOn(jotai, 'useAtomValue');
    useSetAtomSpy = jest.spyOn(jotai, 'useSetAtom');
    when(useAtomValueSpy)
      .calledWith(viewModeAtom)
      .mockReturnValue(BookmarkDisplayMode.Grid);
  });

  it('renders without errors', () => {
    render(<ViewModeToggle />);
  });

  it('shows the grid view mode state', () => {
    const { getByTestId } = render(<ViewModeToggle />);
    const toggleCheckbox = getByTestId('view-mode-toggle');
    expect(toggleCheckbox).toBeChecked();
  });

  it('shows the list view mode state', () => {
    when(useAtomValueSpy)
      .calledWith(viewModeAtom)
      .mockReturnValue(BookmarkDisplayMode.List);

    const { getByTestId } = render(<ViewModeToggle />);
    const toggleCheckbox = getByTestId('view-mode-toggle');
    expect(toggleCheckbox).not.toBeChecked();
  });

  it('updates the view mode state correctly when toggled', () => {
    when(useAtomValueSpy)
      .calledWith(viewModeAtom)
      .mockReturnValue(BookmarkDisplayMode.List);

    const useSetAtomMock = jest.fn();
    when(useSetAtomSpy)
      .calledWith(viewModeAtom)
      .mockReturnValue(useSetAtomMock);
    const { getByTestId } = render(<ViewModeToggle />);
    const toggleCheckbox = getByTestId('view-mode-toggle');
    fireEvent.click(toggleCheckbox);
    expect(useSetAtomMock).toHaveBeenCalledWith(BookmarkDisplayMode.Grid);
  });
});
