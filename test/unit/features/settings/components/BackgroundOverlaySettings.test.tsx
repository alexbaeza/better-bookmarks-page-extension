import { fireEvent, render, screen } from '@testing-library/react';
import * as jotai from 'jotai';
import { vi } from 'vitest';
import { when } from 'vitest-when';

import { backgroundOverlayAtom, backgroundOverlayOpacityAtom } from '@/app/providers/atoms';
import { BackgroundOverlaySettings } from '@/features/settings/components/BackgroundOverlaySettings';

describe('BackgroundSettings', () => {
  let spy: vi.SpyInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    spy = vi.spyOn(jotai, 'useAtom');
    when(spy)
      .calledWith(backgroundOverlayAtom)
      .thenReturn(['background-image.png', vi.fn() as never]);
  });

  it('renders correctly', () => {
    render(<BackgroundOverlaySettings />);
    expect(screen.getByText('Add some personality to your background')).toBeInTheDocument();
    expect(screen.getByAltText('None')).toBeInTheDocument();
    expect(screen.getByAltText('Doodle 1')).toBeInTheDocument();
    expect(screen.getByAltText('Doodle 2')).toBeInTheDocument();
  });

  it('displays selected background as checked', () => {
    when(spy)
      .calledWith(backgroundOverlayAtom)
      .thenReturn(['/images/doodle1.png', vi.fn() as never]);

    render(<BackgroundOverlaySettings />);

    const checkIconContainer = screen.getByTestId('background-check-icon-container');
    expect(checkIconContainer).toHaveClass('absolute -top-1 -right-1 p-1 bg-fgColor-accent rounded-full');
    const checkIcon = checkIconContainer.querySelector('svg');
    expect(checkIcon).toBeInTheDocument();
  });

  it('calls setSelectedBackground when clicking on an image', () => {
    const setSelectedBackground = vi.fn();
    when(spy).calledWith(backgroundOverlayAtom).thenReturn(['', setSelectedBackground]);

    render(<BackgroundOverlaySettings />);

    fireEvent.click(screen.getByAltText('Doodle 1'));
    expect(setSelectedBackground).toHaveBeenCalledWith('/images/doodle1.png');
  });

  test('changes background overlay opacity when slider is moved', () => {
    const setBackgroundOverlayOpacityMock = vi.fn();
    when(spy).calledWith(backgroundOverlayOpacityAtom).thenReturn([50, setBackgroundOverlayOpacityMock]);

    render(<BackgroundOverlaySettings />);

    fireEvent.change(screen.getByTestId('background-overlay-opacity-slider'), {
      target: { value: 70 },
    });

    expect(setBackgroundOverlayOpacityMock).toHaveBeenCalledWith(70);
  });
});
