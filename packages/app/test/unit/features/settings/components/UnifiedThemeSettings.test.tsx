import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { customThemeAtom, themeAtom } from '@/app/providers/atoms';
import { UnifiedThemeSettings } from '@/features/settings/components/UnifiedThemeSettings';
import { AllProviders } from '~test/test-utils';

describe('UnifiedThemeSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders theme settings with testid', () => {
    render(
      <AllProviders
        initialValues={[
          [themeAtom, 'dark'],
          [customThemeAtom, null],
        ]}
      >
        <UnifiedThemeSettings />
      </AllProviders>
    );

    expect(screen.getByTestId('theme-settings')).toBeInTheDocument();
  });

  it('renders theme selection buttons', () => {
    render(
      <AllProviders
        initialValues={[
          [themeAtom, 'dark'],
          [customThemeAtom, null],
        ]}
      >
        <UnifiedThemeSettings />
      </AllProviders>
    );

    expect(screen.getByText('Choose a theme')).toBeInTheDocument();
  });

  it('renders custom theme button', () => {
    render(
      <AllProviders
        initialValues={[
          [themeAtom, 'dark'],
          [customThemeAtom, null],
        ]}
      >
        <UnifiedThemeSettings />
      </AllProviders>
    );

    const customButton = screen.getByTestId('theme-custom');
    expect(customButton).toBeInTheDocument();
  });

  it('renders preset theme buttons', () => {
    render(
      <AllProviders
        initialValues={[
          [themeAtom, 'dark'],
          [customThemeAtom, null],
        ]}
      >
        <UnifiedThemeSettings />
      </AllProviders>
    );

    const lightButton = screen.getByTestId('theme-github-light');
    expect(lightButton).toBeInTheDocument();
  });

  it('renders color customization section when custom theme is active', () => {
    render(
      <AllProviders
        initialValues={[
          [themeAtom, 'custom'],
          [customThemeAtom, { 'bgColor-primary': '#ffffff' }],
        ]}
      >
        <UnifiedThemeSettings />
      </AllProviders>
    );

    expect(screen.getByText('Customize Colors')).toBeInTheDocument();
  });

  it('shows color inputs when custom theme is active', () => {
    render(
      <AllProviders
        initialValues={[
          [themeAtom, 'custom'],
          [customThemeAtom, { 'bgColor-primary': '#ffffff' }],
        ]}
      >
        <UnifiedThemeSettings />
      </AllProviders>
    );

    expect(screen.getByDisplayValue('#ffffff')).toBeInTheDocument();
  });

  it('shows reset button when custom theme is active', () => {
    render(
      <AllProviders
        initialValues={[
          [themeAtom, 'custom'],
          [customThemeAtom, { 'bgColor-primary': '#ffffff' }],
        ]}
      >
        <UnifiedThemeSettings />
      </AllProviders>
    );

    expect(screen.getByTestId('theme-reset-all-colors')).toBeInTheDocument();
  });
});
