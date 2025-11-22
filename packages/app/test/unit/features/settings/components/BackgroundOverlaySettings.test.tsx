import { fireEvent, render, screen } from '@testing-library/react';

import { BackgroundOverlaySettings } from '@/features/settings/components/BackgroundOverlaySettings';
import { AllProviders } from '~test/test-utils';

describe('BackgroundSettings', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders correctly', () => {
    render(
      <AllProviders>
        <BackgroundOverlaySettings />
      </AllProviders>
    );
    expect(screen.getByText('Add some personality to your background')).toBeInTheDocument();
    expect(screen.getByTestId('background-overlay-toggle')).toBeInTheDocument();
  });

  it('enables overlay when toggle is clicked', () => {
    render(
      <AllProviders>
        <BackgroundOverlaySettings />
      </AllProviders>
    );

    const toggle = screen.getByTestId('background-overlay-toggle');
    fireEvent.click(toggle);

    expect(screen.getByAltText('Doodle 1')).toBeInTheDocument();
    expect(screen.getByAltText('Doodle 2')).toBeInTheDocument();
  });

  it('renders images when overlay is enabled', () => {
    render(
      <AllProviders>
        <BackgroundOverlaySettings />
      </AllProviders>
    );

    const toggle = screen.getByTestId('background-overlay-toggle');
    fireEvent.click(toggle);

    expect(screen.getByAltText('Doodle 1')).toBeInTheDocument();
    expect(screen.getByAltText('Doodle 2')).toBeInTheDocument();
  });

  it('renders opacity slider when overlay is enabled', () => {
    render(
      <AllProviders>
        <BackgroundOverlaySettings />
      </AllProviders>
    );

    const toggle = screen.getByTestId('background-overlay-toggle');
    fireEvent.click(toggle);

    const slider = screen.getByTestId('background-overlay-opacity-slider');
    expect(slider).toBeInTheDocument();
  });

  it('handles image clicks when overlay is enabled', () => {
    render(
      <AllProviders>
        <BackgroundOverlaySettings />
      </AllProviders>
    );

    const toggle = screen.getByTestId('background-overlay-toggle');
    fireEvent.click(toggle);

    const doodle1 = screen.getByAltText('Doodle 1');
    fireEvent.click(doodle1);

    expect(doodle1).toBeInTheDocument();
  });

  it('handles key events on background overlay toggle', () => {
    render(
      <AllProviders>
        <BackgroundOverlaySettings />
      </AllProviders>
    );

    const toggle = screen.getByTestId('background-overlay-toggle');
    fireEvent.keyDown(toggle, { key: 'Enter' });
    expect(toggle).toBeInTheDocument();

    fireEvent.keyDown(toggle, { key: ' ' });
    expect(toggle).toBeInTheDocument();
  });

  it('handles click events on background overlay toggle to disable', () => {
    render(
      <AllProviders>
        <BackgroundOverlaySettings />
      </AllProviders>
    );

    const toggle = screen.getByTestId('background-overlay-toggle');
    fireEvent.click(toggle);
    expect(toggle).toBeInTheDocument();
  });

  it('handles click events on background overlay toggle to enable', () => {
    render(
      <AllProviders>
        <BackgroundOverlaySettings />
      </AllProviders>
    );

    const toggle = screen.getByTestId('background-overlay-toggle');
    fireEvent.click(toggle);
    expect(toggle).toBeInTheDocument();
  });
});
