import { fireEvent, render, screen } from '@testing-library/react';
import * as jotai from 'jotai';
import { when } from 'jest-when';
import {
  backgroundOverlayAtom,
  backgroundOverlayOpacityAtom
} from '../../../../src/Context/atoms';
import { BackgroundOverlaySettings } from '../../../../src/Components/Settings/BackgroundOverlaySettings';

describe('BackgroundSettings', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    spy = jest.spyOn(jotai, 'useAtom');
    when(spy)
      .calledWith(backgroundOverlayAtom)
      .mockReturnValue(['background-image.png', jest.fn() as never]);
  });

  it('renders correctly', () => {
    render(<BackgroundOverlaySettings />);

    expect(screen.getByText('Overlay')).toBeInTheDocument();
    expect(
      screen.getByText('🌶️ Select an overlay, spice things up.')
    ).toBeInTheDocument();
    expect(screen.getByAltText('None')).toBeInTheDocument();
    expect(screen.getByAltText('Doodle 1')).toBeInTheDocument();
    expect(screen.getByAltText('Doodle 2')).toBeInTheDocument();
  });

  it('displays selected background as checked', () => {
    when(spy)
      .calledWith(backgroundOverlayAtom)
      .mockReturnValue(['/images/doodle1.png', jest.fn() as never]);

    render(<BackgroundOverlaySettings />);

    const checkIconContainer = screen.getByTestId(
      'background-check-icon-container'
    );
    expect(checkIconContainer).toHaveClass('absolute top-0 right-0 p-2');
    const checkIcon = screen.getByTestId('background-check-icon');
    expect(checkIcon).toBeInTheDocument();
  });

  it('calls setSelectedBackground when clicking on an image', () => {
    const setSelectedBackground = jest.fn();
    when(spy)
      .calledWith(backgroundOverlayAtom)
      .mockReturnValue(['', setSelectedBackground]);

    render(<BackgroundOverlaySettings />);

    fireEvent.click(screen.getByAltText('Doodle 1'));
    expect(setSelectedBackground).toHaveBeenCalledWith('/images/doodle1.png');
  });

  test('changes background overlay opacity when slider is moved', () => {
    const setBackgroundOverlayOpacityMock = jest.fn();
    when(spy)
      .calledWith(backgroundOverlayOpacityAtom)
      .mockReturnValue([50, setBackgroundOverlayOpacityMock]);

    render(<BackgroundOverlaySettings />);

    fireEvent.change(screen.getByTestId('background-overlay-opacity-slider'), {
      target: { value: 70 }
    });

    expect(setBackgroundOverlayOpacityMock).toHaveBeenCalledWith(70);
  });
});
