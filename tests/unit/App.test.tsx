/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import { render, waitFor } from '@testing-library/react';
import { App } from '../../src/App';
import { Bookmarks } from '../../src/Data/bookmarks';
import { when } from 'jest-when';
import {
  backgroundOverlayAtom,
  greetingEnabledAtom,
  greetingNameAtom
} from '../../src/Context/atoms';

import * as jotai from 'jotai';

jest.mock('../../src/Data/bookmarks', () => ({
  Bookmarks: {
    getFolders: jest
      .fn()
      .mockResolvedValue([{ id: 1, title: 'Folder 1', children: [] }])
  }
}));

describe('App', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    spy = jest.spyOn(jotai, 'useAtomValue');
    when(spy).calledWith(greetingEnabledAtom).mockReturnValue(true);
    when(spy).calledWith(greetingNameAtom).mockReturnValue('Bob');
    when(spy)
      .calledWith(backgroundOverlayAtom)
      .mockReturnValue('background-image.png');
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders without errors', async () => {
    render(<App />);
  });

  it('displays a greeting message', async () => {
    const { getByText } = render(<App />);

    expect(
      getByText(/good\s(morning|afternoon|evening),?\s?[a-z]*/i)
    ).toBeInTheDocument();
  });

  it('displays a message if there are no bookmarks', async () => {
    jest.spyOn(Bookmarks, 'getFolders').mockResolvedValueOnce([]);
    const { getByText } = render(<App />);
    expect(
      getByText(
        "Looks like you don't have any Bookmarks, add some to see the magic! 🪄✨"
      )
    ).toBeInTheDocument();
  });

  it('displays bookmark folders if there are any', async () => {
    jest.spyOn(Bookmarks, 'getFolders').mockResolvedValueOnce([
      {
        id: '1',
        title: 'Folder 1',
        index: 2,
        dateAdded: 123456789,
        parentId: '0',
        children: [
          {
            id: '2',
            title: 'Bookmark 1',
            index: 2,
            dateAdded: 123456789,
            parentId: '1',
            url: 'https://www.example.com'
          }
        ]
      }
    ]);
    const { getByText } = render(<App />);

    await waitFor(() => {
      expect(Bookmarks.getFolders).toBeCalled();
      expect(getByText('Folder 1')).toBeInTheDocument();
      expect(getByText('Bookmark 1')).toBeInTheDocument();
    });
  });

  it('displays the selected background image', async () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('background')).toHaveStyle({
      backgroundImage: "url('background-image.png')"
    });
  });
});
