import { render, screen } from '@testing-library/react';

import { zoomAtom } from '@/app/providers/atoms';
import { ZoomSettings } from '@/features/settings/components/ZoomSettings';
import { AllProviders } from '~test/test-utils';

describe('ZoomSettings', () => {
  it('renders with default dataTestId', () => {
    render(
      <AllProviders>
        <ZoomSettings />
      </AllProviders>
    );

    // Both SettingItem wrapper and ZoomControls have the same dataTestId
    const containers = screen.getAllByTestId('zoom-settings');
    expect(containers.length).toBeGreaterThanOrEqual(1);
    // SettingItem is the outer wrapper
    expect(containers[0]).toBeInTheDocument();
  });

  it('renders with custom dataTestId', () => {
    render(
      <AllProviders>
        <ZoomSettings dataTestId="custom-zoom-settings" />
      </AllProviders>
    );

    // Both SettingItem wrapper and ZoomControls have the same dataTestId
    const containers = screen.getAllByTestId('custom-zoom-settings');
    expect(containers.length).toBeGreaterThanOrEqual(1);
    // SettingItem is the outer wrapper
    expect(containers[0]).toBeInTheDocument();
  });

  it('renders scale label', () => {
    render(
      <AllProviders>
        <ZoomSettings />
      </AllProviders>
    );

    // Scale appears twice: once in SettingItem label, once in ZoomControls
    const scaleLabels = screen.getAllByText('Scale');
    expect(scaleLabels.length).toBeGreaterThan(0);
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

    // SettingItem wrapper (first element with the test ID)
    const containers = screen.getAllByTestId('zoom-settings');
    expect(containers.length).toBeGreaterThanOrEqual(1);
    const settingItem = containers[0];
    expect(settingItem).toBeInTheDocument();

    // ZoomControls inside has the flex layout (second element with the test ID)
    if (containers.length > 1) {
      const zoomControls = containers[1];
      expect(zoomControls).toHaveClass('flex', 'items-center', 'justify-between');
    }

    const zoomDisplay = screen.getByTestId('zoom-display');
    expect(zoomDisplay).toHaveClass('w-12', 'text-center', 'text-sm', 'tabular-nums', 'text-fgColor-primary');
  });
});
