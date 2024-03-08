/* eslint-disable testing-library/no-wait-for-multiple-assertions */
import { render, screen } from '@testing-library/react';
import { App } from '../../src/App';
import { when } from 'jest-when';
import {
  backgroundOverlayAtom,
  backgroundOverlayOpacityAtom,
  greetingEnabledAtom,
  greetingNameAtom
} from '../../src/Context/atoms';

import * as jotai from 'jotai';
import * as useBookmarks from '../../src/Hooks/useBookmarks';

describe('App', () => {
  let useAtomValueSpy: jest.SpyInstance;
  let useBookmarksSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    useAtomValueSpy = jest.spyOn(jotai, 'useAtomValue');
    useBookmarksSpy = jest.spyOn(useBookmarks, 'useBookmarks');

    when(useAtomValueSpy).calledWith(greetingEnabledAtom).mockReturnValue(true);
    when(useAtomValueSpy).calledWith(greetingNameAtom).mockReturnValue('Bob');
    when(useAtomValueSpy)
      .calledWith(backgroundOverlayAtom)
      .mockReturnValue('background-image.png');
    when(useAtomValueSpy)
      .calledWith(backgroundOverlayOpacityAtom)
      .mockReturnValue(10);
    when(useBookmarksSpy).mockReturnValue({
      data: [],
      loading: false
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('renders without errors', () => {
    render(<App />);
  });

  it('displays a greeting message', () => {
    const { getByText } = render(<App />);

    expect(
      getByText(/good\s(morning|afternoon|evening),?\s?[a-z]*/i)
    ).toBeInTheDocument();
  });

  it('displays a message if there are no bookmarks', () => {
    const { getByText } = render(<App />);
    expect(
      getByText(
        "Looks like you don't have any Bookmarks, add some to see the magic! 🪄✨"
      )
    ).toBeInTheDocument();
  });

  it('displays bookmark folders if there are any', () => {
    when(useBookmarksSpy).mockReturnValue({
      data: [
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
      ],
      loading: false
    });
    const { getByText } = render(<App />);

    expect(getByText('Folder 1')).toBeInTheDocument();
    expect(getByText('Bookmark 1')).toBeInTheDocument();
  });

  it('displays the selected background image', () => {
    const { getByTestId } = render(<App />);
    expect(getByTestId('background')).toHaveStyle({
      backgroundImage: "url('background-image.png')"
    });
  });

  it('displays the selected background image opacity', () => {
    render(<App />);

    expect(screen.getByTestId('background')).toHaveStyle({
      opacity: `10%`
    });
  });

  it('displays a loading message while data is being fetched', () => {
    when(useBookmarksSpy).mockReturnValue({
      data: [],
      loading: true
    });

    const { getByText } = render(<App />);
    expect(getByText('Loading')).toBeInTheDocument();
  });
});
