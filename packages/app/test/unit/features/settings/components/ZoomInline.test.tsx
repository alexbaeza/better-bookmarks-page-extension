import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { zoomAtom } from '@/app/providers/atoms';
import { ZoomInline } from '@/features/settings/components/ZoomInline';
import { AllProviders } from '~test/test-utils';

describe('ZoomInline', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders scale label', () => {
    render(
      <AllProviders>
        <ZoomInline />
      </AllProviders>
    );

    expect(screen.getByText('Scale')).toBeInTheDocument();
  });

  it('displays current zoom percentage', () => {
    render(
      <AllProviders initialValues={[[zoomAtom, 1.25]]}>
        <ZoomInline />
      </AllProviders>
    );

    expect(screen.getByText('125%')).toBeInTheDocument();
  });

  it('enables buttons by default', () => {
    render(
      <AllProviders>
        <ZoomInline />
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
        <ZoomInline />
      </AllProviders>
    );

    const increaseButton = screen.getByLabelText('Increase scale');
    expect(increaseButton).toBeDisabled();
  });

  it('disables decrease button when at minimum zoom', () => {
    render(
      <AllProviders initialValues={[[zoomAtom, 0.5]]}>
        <ZoomInline />
      </AllProviders>
    );

    const decreaseButton = screen.getByLabelText('Decrease scale');
    expect(decreaseButton).toBeDisabled();
  });

  it('applies correct CSS classes', () => {
    render(
      <AllProviders initialValues={[[zoomAtom, 1.0]]}>
        <ZoomInline />
      </AllProviders>
    );

    const container = screen.getByTestId('zoom-controls');
    expect(container).toHaveClass('mb-4', 'flex', 'items-center', 'justify-between');

    const scaleLabel = screen.getByText('Scale');
    expect(scaleLabel).toHaveClass('text-xs', 'text-fgColor-secondary');

    const zoomDisplay = screen.getByText('100%');
    expect(zoomDisplay).toHaveClass('w-12', 'text-center', 'tabular-nums', 'text-fgColor-primary', 'text-xs');
  });
});
