import { render, screen } from '@testing-library/react';
import { Provider } from 'jotai';
import { useHydrateAtoms } from 'jotai/utils';
import type React from 'react';
import { vi } from 'vitest';

import { backgroundOverlayAtom, backgroundOverlayOpacityAtom } from '@/app/providers/atoms';
import { BackgroundOverlay } from '@/shared/ui/BackgroundOverlay';

const HydrateAtoms = ({ initialValues, children }: { initialValues: any; children: React.ReactNode }) => {
  useHydrateAtoms(initialValues);
  return <>{children}</>;
};

const TestProvider = ({ initialValues, children }: { initialValues: any; children: React.ReactNode }) => (
  <Provider>
    <HydrateAtoms initialValues={initialValues}>{children}</HydrateAtoms>
  </Provider>
);

describe('BackgroundOverlay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders background overlay when backgroundOverlay is set', () => {
    render(
      <TestProvider
        initialValues={[
          [backgroundOverlayAtom, '/images/background.jpg'],
          [backgroundOverlayOpacityAtom, 50],
        ]}
      >
        <BackgroundOverlay />
      </TestProvider>
    );

    const overlay = screen.getByTestId('background-overlay');
    expect(overlay).toBeInTheDocument();
    expect(overlay).toHaveStyle({
      backgroundImage: 'url(/images/background.jpg)',
      opacity: '0.5',
    });
  });

  it('does not render when backgroundOverlay is null', () => {
    render(
      <TestProvider
        initialValues={[
          [backgroundOverlayAtom, null],
          [backgroundOverlayOpacityAtom, 50],
        ]}
      >
        <BackgroundOverlay />
      </TestProvider>
    );

    expect(screen.queryByTestId('background-overlay')).not.toBeInTheDocument();
  });

  it('does not render when backgroundOverlay is transparent.png', () => {
    render(
      <TestProvider
        initialValues={[
          [backgroundOverlayAtom, '/images/transparent.png'],
          [backgroundOverlayOpacityAtom, 50],
        ]}
      >
        <BackgroundOverlay />
      </TestProvider>
    );

    expect(screen.queryByTestId('background-overlay')).not.toBeInTheDocument();
  });

  it('applies correct opacity based on backgroundOverlayOpacity', () => {
    render(
      <TestProvider
        initialValues={[
          [backgroundOverlayAtom, '/images/background.jpg'],
          [backgroundOverlayOpacityAtom, 75],
        ]}
      >
        <BackgroundOverlay />
      </TestProvider>
    );

    const overlay = screen.getByTestId('background-overlay');
    expect(overlay).toHaveStyle({
      opacity: '0.75',
    });
  });

  it('applies correct CSS classes', () => {
    render(
      <TestProvider
        initialValues={[
          [backgroundOverlayAtom, '/images/background.jpg'],
          [backgroundOverlayOpacityAtom, 50],
        ]}
      >
        <BackgroundOverlay />
      </TestProvider>
    );

    const overlay = screen.getByTestId('background-overlay');
    expect(overlay).toHaveClass('fixed', 'inset-0', 'pointer-events-none', 'z-0');
  });

  it('applies correct background styles', () => {
    render(
      <TestProvider
        initialValues={[
          [backgroundOverlayAtom, '/images/background.jpg'],
          [backgroundOverlayOpacityAtom, 50],
        ]}
      >
        <BackgroundOverlay />
      </TestProvider>
    );

    const overlay = screen.getByTestId('background-overlay');
    expect(overlay).toHaveStyle({
      backgroundPosition: 'top left',
      backgroundRepeat: 'repeat',
      backgroundSize: 'auto',
    });
  });
});
