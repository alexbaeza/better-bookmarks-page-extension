import { render, screen } from '@testing-library/react';
import type React from 'react';
import { vi } from 'vitest';

import { SettingsToggle } from '@/features/settings/containers/SettingsToggle';
import { AllProviders } from '~test/test-utils';

vi.mock('@/features/settings/containers/SettingsFlyoutContainer', () => ({
  SettingsFlyoutContainer: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="settings-flyout-container">{children}</div>
  ),
}));

vi.mock('@/features/settings/containers/SettingsPanelContainer', () => ({
  SettingsPanelContainer: () => <div data-testid="settings-panel-container">SettingsPanelContainer</div>,
}));

describe('SettingsToggle', () => {
  it('renders SettingsFlyoutContainer with SettingsPanelContainer', () => {
    render(
      <AllProviders>
        <SettingsToggle />
      </AllProviders>
    );

    expect(screen.getByTestId('settings-flyout-container')).toBeInTheDocument();
    expect(screen.getByTestId('settings-panel-container')).toBeInTheDocument();
  });
});
