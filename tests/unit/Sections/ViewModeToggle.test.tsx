import { render, fireEvent } from '@testing-library/react';
import * as jotai from 'jotai/index';
import { when } from 'jest-when';
import { viewModeAtom } from '../../../src/Context/atoms';
import { BookmarkDisplayMode } from '../../../src/types.d';
import { ViewModeToggle } from '../../../src/Sections/ViewModeToggle';

describe('ViewModeToggle', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    spy = jest.spyOn(jotai, 'useAtom');
    when(spy)
      .calledWith(viewModeAtom)
      .mockReturnValue([BookmarkDisplayMode.Grid, jest.fn() as never]);
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
    when(spy)
      .calledWith(viewModeAtom)
      .mockReturnValue([BookmarkDisplayMode.List, jest.fn() as never]);

    const { getByTestId } = render(<ViewModeToggle />);
    const toggleCheckbox = getByTestId('view-mode-toggle');
    expect(toggleCheckbox).not.toBeChecked();
  });

  it('updates the view mode state correctly when toggled', () => {
    const setViewMode = jest.fn();
    when(spy)
      .calledWith(viewModeAtom)
      .mockReturnValue([BookmarkDisplayMode.List, setViewMode]);

    const { getByTestId } = render(<ViewModeToggle />);
    const toggleCheckbox = getByTestId('view-mode-toggle');
    fireEvent.click(toggleCheckbox);
    expect(setViewMode).toHaveBeenCalledWith(BookmarkDisplayMode.Grid);
  });
});
