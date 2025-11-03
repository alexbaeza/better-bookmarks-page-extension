import { fireEvent, render, screen } from '@testing-library/react';

import { BackgroundOverlaySettings } from '@/features/settings/components/BackgroundOverlaySettings';

describe('BackgroundSettings', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders correctly', () => {
    render(<BackgroundOverlaySettings />);
    expect(screen.getByText('Add some personality to your background')).toBeInTheDocument();
    expect(screen.getByTestId('background-overlay-toggle')).toBeInTheDocument();
  });

  it('enables overlay when toggle is clicked', () => {
    render(<BackgroundOverlaySettings />);

    const toggle = screen.getByTestId('background-overlay-toggle');
    fireEvent.click(toggle);

    expect(screen.getByAltText('Doodle 1')).toBeInTheDocument();
    expect(screen.getByAltText('Doodle 2')).toBeInTheDocument();
  });

  it('renders images when overlay is enabled', () => {
    render(<BackgroundOverlaySettings />);

    const toggle = screen.getByTestId('background-overlay-toggle');
    fireEvent.click(toggle);

    expect(screen.getByAltText('Doodle 1')).toBeInTheDocument();
    expect(screen.getByAltText('Doodle 2')).toBeInTheDocument();
  });

  it('renders opacity slider when overlay is enabled', () => {
    render(<BackgroundOverlaySettings />);

    const toggle = screen.getByTestId('background-overlay-toggle');
    fireEvent.click(toggle);

    const slider = screen.getByTestId('background-overlay-opacity-slider');
    expect(slider).toBeInTheDocument();
  });

  it('handles image clicks when overlay is enabled', () => {
    render(<BackgroundOverlaySettings />);

    const toggle = screen.getByTestId('background-overlay-toggle');
    fireEvent.click(toggle);

    const doodle1 = screen.getByAltText('Doodle 1');
    fireEvent.click(doodle1);

    expect(doodle1).toBeInTheDocument();
  });

  it('handles key events on background overlay toggle', () => {
    render(<BackgroundOverlaySettings />);

    const toggle = screen.getByTestId('background-overlay-toggle');
    fireEvent.keyDown(toggle, { key: 'Enter' });
    expect(toggle).toBeInTheDocument();

    fireEvent.keyDown(toggle, { key: ' ' });
    expect(toggle).toBeInTheDocument();
  });

  it('handles click events on background overlay toggle to disable', () => {
    render(<BackgroundOverlaySettings />);

    const toggle = screen.getByTestId('background-overlay-toggle');
    fireEvent.click(toggle);
    expect(toggle).toBeInTheDocument();
  });

  it('handles click events on background overlay toggle to enable', () => {
    render(<BackgroundOverlaySettings />);

    const toggle = screen.getByTestId('background-overlay-toggle');
    fireEvent.click(toggle);
    expect(toggle).toBeInTheDocument();
  });
});
