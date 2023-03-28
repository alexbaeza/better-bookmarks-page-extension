import { render, screen } from '@testing-library/react';
import { App } from '../../src/App';
import { Bookmarks } from '../../src/Data/bookmarks';
import { act } from 'react-dom/test-utils';
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
  beforeEach(() => {
    jest.resetAllMocks();

    const spy = jest.spyOn(jotai, 'useAtom');

    when(spy)
      .calledWith(greetingEnabledAtom)
      .mockReturnValue([true, jest.fn() as never]);
    when(spy)
      .calledWith(greetingNameAtom)
      .mockReturnValue(['Bob', jest.fn() as never]);
    when(spy)
      .calledWith(backgroundOverlayAtom)
      .mockReturnValue(['background-image.png', jest.fn() as never]);
  });

  it('renders without errors', async () => {
    await act(async () => {
      await render(<App />);
    });
  });

  it('displays a greeting message', async () => {
    await act(async () => {
      await render(<App />);
    });
    expect(
      screen.getByText(/good\s(morning|afternoon|evening),?\s?[a-z]*/i)
    ).toBeInTheDocument();
  });

  it('displays a message if there are no bookmarks', async () => {
    jest.spyOn(Bookmarks, 'getFolders').mockResolvedValueOnce([]);
    await act(async () => {
      await render(<App />);
    });
    expect(
      screen.getByText(
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
    await act(async () => {
      await render(<App />);
    });
    await expect(Bookmarks.getFolders).toBeCalled();
    await expect(screen.getByText('Folder 1')).toBeInTheDocument();
    await expect(screen.getByText('Bookmark 1')).toBeInTheDocument();
  });

  it('displays the selected background image', async () => {
    await act(async () => {
      await render(<App />);
    });
    expect(screen.getByTestId('background')).toHaveStyle({
      backgroundImage: "url('background-image.png')"
    });
  });
});
