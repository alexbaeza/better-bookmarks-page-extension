import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import { SettingsPanelContainer } from '@/features/settings/containers/SettingsPanelContainer';
import { AllProviders } from '~test/test-utils';

vi.mock('@/shared/ui/BuiltWith', () => ({
  BuiltWith: () => <div data-testid="built-with">BuiltWith</div>,
}));

vi.mock('@/shared/ui/Sponsor', () => ({
  Sponsor: ({ dataTestId }: { dataTestId: string }) => <div data-testid={dataTestId}>Sponsor</div>,
}));

vi.mock('@/features/settings/components/SidebarSettings', () => ({
  SidebarSettings: ({ dataTestId }: { dataTestId: string }) => <div data-testid={dataTestId}>SidebarSettings</div>,
}));

vi.mock('@/features/settings/components/SearchBarSettings', () => ({
  SearchBarSettings: ({ dataTestId }: { dataTestId: string }) => <div data-testid={dataTestId}>SearchBarSettings</div>,
}));

vi.mock('@/features/settings/components/GreetingSettings', () => ({
  GreetingSettings: ({ dataTestId }: { dataTestId: string }) => <div data-testid={dataTestId}>GreetingSettings</div>,
}));

vi.mock('@/features/settings/components/ZoomSettings', () => ({
  ZoomSettings: ({ dataTestId }: { dataTestId: string }) => <div data-testid={dataTestId}>ZoomSettings</div>,
}));

vi.mock('@/features/settings/components/UnifiedThemeSettings', () => ({
  UnifiedThemeSettings: () => <div data-testid="theme-settings">UnifiedThemeSettings</div>,
}));

vi.mock('@/features/settings/components/BackgroundOverlaySettings', () => ({
  BackgroundOverlaySettings: ({ dataTestId }: { dataTestId: string }) => (
    <div data-testid={dataTestId}>BackgroundOverlaySettings</div>
  ),
}));

describe('SettingsPanelContainer', () => {
  beforeEach(() => {
    vi.stubGlobal('location', { reload: vi.fn() });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('renders all settings sections', () => {
    render(
      <AllProviders>
        <SettingsPanelContainer />
      </AllProviders>
    );

    expect(screen.getByText('Layout')).toBeInTheDocument();
    expect(screen.getByText('Personalization')).toBeInTheDocument();
    expect(screen.getByText('Appearance')).toBeInTheDocument();
    expect(screen.getByText('Support')).toBeInTheDocument();
    expect(screen.getByText('Maintenance')).toBeInTheDocument();
  });

  it('renders all settings components', async () => {
    const user = userEvent.setup();
    render(
      <AllProviders>
        <SettingsPanelContainer />
      </AllProviders>
    );

    // Expand Layout section
    const layoutSection = screen.getByTestId('layout-section');
    const layoutButton = layoutSection.querySelector('button');
    if (layoutButton) {
      await user.click(layoutButton);
    }

    // Expand Personalization section
    const personalizationSection = screen.getByTestId('personalization-section');
    const personalizationButton = personalizationSection?.querySelector('button');
    if (personalizationButton) {
      await user.click(personalizationButton);
    }

    // Expand Appearance section
    const appearanceSection = screen.getByTestId('appearance-section');
    const appearanceButton = appearanceSection?.querySelector('button');
    if (appearanceButton) {
      await user.click(appearanceButton);
    }

    // Support section is open by default
    expect(screen.getByTestId('sidebar-settings')).toBeInTheDocument();
    expect(screen.getByTestId('search-bar-settings')).toBeInTheDocument();
    expect(screen.getByTestId('greeting-settings')).toBeInTheDocument();
    expect(screen.getByTestId('zoom-settings-flyout')).toBeInTheDocument();
    expect(screen.getByTestId('theme-settings')).toBeInTheDocument();
    expect(screen.getByTestId('background-overlay-settings')).toBeInTheDocument();
    expect(screen.getByTestId('sponsor')).toBeInTheDocument();
    expect(screen.getByTestId('built-with')).toBeInTheDocument();
  });

  it('opens reset confirmation modal when reset button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <AllProviders>
        <SettingsPanelContainer />
      </AllProviders>
    );

    // Expand Maintenance section
    const maintenanceSection = screen.getByTestId('maintenance-section');
    const maintenanceButton = maintenanceSection?.querySelector('button');
    if (maintenanceButton) {
      await user.click(maintenanceButton);
    }

    const resetButton = screen.getByTestId('settings-reset-open-button');
    await user.click(resetButton);

    expect(screen.getByTestId('settings-reset-modal-title')).toBeInTheDocument();
    expect(
      screen.getByText('This will clear all saved preferences and reload the page. This action cannot be undone.')
    ).toBeInTheDocument();
  });

  it('closes reset confirmation modal when cancel is clicked', async () => {
    const user = userEvent.setup();
    render(
      <AllProviders>
        <SettingsPanelContainer />
      </AllProviders>
    );

    // Expand Maintenance section
    const maintenanceSection = screen.getByTestId('maintenance-section');
    const maintenanceButton = maintenanceSection?.querySelector('button');
    if (maintenanceButton) {
      await user.click(maintenanceButton);
    }

    const resetButton = screen.getByTestId('settings-reset-open-button');
    await user.click(resetButton);

    const cancelButton = screen.getByTestId('settings-reset-cancel-button');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByText('Reset all settings')).not.toBeInTheDocument();
    });
  });

  it('resets settings and reloads page when confirmed', async () => {
    const mockRemoveItem = vi.fn();

    const mockLocalStorage: any = {
      'BB-sidebar': 'true',
      'BB-theme': 'dark',
      clear: vi.fn(),
      getItem: vi.fn((key: string) => mockLocalStorage[key] ?? null),
      key: vi.fn((index: number) => ['BB-theme', 'BB-sidebar'][index] ?? null),
      length: 2,
      removeItem: mockRemoveItem,
      setItem: vi.fn(),
    };

    Object.defineProperty(mockLocalStorage, 'BB-theme', { configurable: true, enumerable: true, value: 'dark' });
    Object.defineProperty(mockLocalStorage, 'BB-sidebar', { configurable: true, enumerable: true, value: 'true' });

    vi.stubGlobal('localStorage', mockLocalStorage);

    const user = userEvent.setup();
    render(
      <AllProviders>
        <SettingsPanelContainer />
      </AllProviders>
    );

    // Expand Maintenance section
    const maintenanceSection = screen.getByTestId('maintenance-section');
    const maintenanceButton = maintenanceSection?.querySelector('button');
    if (maintenanceButton) {
      await user.click(maintenanceButton);
    }

    const resetButton = screen.getByTestId('settings-reset-open-button');
    await user.click(resetButton);

    const confirmButton = screen.getByTestId('settings-reset-confirm-button');
    await user.click(confirmButton);

    await waitFor(() => {
      expect(mockRemoveItem).toHaveBeenCalledWith('BB-theme');
      expect(mockRemoveItem).toHaveBeenCalledWith('BB-sidebar');
      expect(window.location.reload).toHaveBeenCalled();
    });
  });
});
