import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { zoomAtom } from '@/app/providers/atoms';
import { ZoomSettings } from '@/features/settings/components/ZoomSettings';
import { AllProviders } from '~test/test-utils';

describe('ZoomSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default dataTestId', () => {
    render(
      <AllProviders>
        <ZoomSettings />
      </AllProviders>
    );

    expect(screen.getByTestId('zoom-settings')).toBeInTheDocument();
  });

  it('renders with custom dataTestId', () => {
    render(
      <AllProviders>
        <ZoomSettings dataTestId="custom-zoom-settings" />
      </AllProviders>
    );

    expect(screen.getByTestId('custom-zoom-settings')).toBeInTheDocument();
  });

  it('renders scale label', () => {
    render(
      <AllProviders>
        <ZoomSettings />
      </AllProviders>
    );

    expect(screen.getByText('Scale')).toBeInTheDocument();
  });

  it('displays current zoom percentage', () => {
    render(
      <AllProviders initialValues={[[zoomAtom, 1.25]]}>
        <ZoomSettings />
      </AllProviders>
    );

    expect(screen.getByTestId('zoom-display')).toHaveTextContent('125%');
  });

  it('enables buttons by default', () => {
    render(
      <AllProviders>
        <ZoomSettings />
      </AllProviders>
    );

    const increaseButton = screen.getByLabelText('Increase scale');
    const decreaseButton = screen.getByLabelText('Decrease scale');

    expect(increaseButton).not.toBeDisabled();
    expect(decreaseButton).not.toBeDisabled();
  });

  it('disables increase button when at maximum zoom', () => {
    render(
      <AllProviders initialValues={[[zoomAtom, 2.0]]}>
        <ZoomSettings />
      </AllProviders>
    );

    const increaseButton = screen.getByLabelText('Increase scale');
    expect(increaseButton).toBeDisabled();
  });

  it('disables decrease button when at minimum zoom', () => {
    render(
      <AllProviders initialValues={[[zoomAtom, 0.5]]}>
        <ZoomSettings />
      </AllProviders>
    );

    const decreaseButton = screen.getByLabelText('Decrease scale');
    expect(decreaseButton).toBeDisabled();
  });

  it('applies correct CSS classes', () => {
    render(
      <AllProviders>
        <ZoomSettings />
      </AllProviders>
    );

    const container = screen.getByTestId('zoom-settings');
    expect(container).toHaveClass('flex', 'items-center', 'justify-between');

    const zoomDisplay = screen.getByTestId('zoom-display');
    expect(zoomDisplay).toHaveClass('w-12', 'text-center', 'text-sm', 'tabular-nums', 'text-fgColor-primary');
  });
});
