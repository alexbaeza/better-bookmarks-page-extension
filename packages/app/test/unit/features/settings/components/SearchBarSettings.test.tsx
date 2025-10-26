import { render, screen } from '@testing-library/react';
import { vi } from 'vitest';

import { searchBarEnabledAtom } from '@/app/providers/atoms';
import { SearchBarSettings } from '@/features/settings/components/SearchBarSettings';
import { AllProviders } from '~test/test-utils';

describe('SearchBarSettings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with default dataTestId', () => {
    render(
      <AllProviders>
        <SearchBarSettings />
      </AllProviders>
    );

    expect(screen.getByTestId('search-bar-settings')).toBeInTheDocument();
  });

  it('renders with custom dataTestId', () => {
    render(
      <AllProviders>
        <SearchBarSettings dataTestId="custom-search-settings" />
      </AllProviders>
    );

    expect(screen.getByTestId('custom-search-settings')).toBeInTheDocument();
  });

  it('renders search bar description', () => {
    render(
      <AllProviders>
        <SearchBarSettings />
      </AllProviders>
    );

    expect(screen.getByText('Control the visibility of the search functionality')).toBeInTheDocument();
  });

  it('renders enable search bar section', () => {
    render(
      <AllProviders initialValues={[[searchBarEnabledAtom, false]]}>
        <SearchBarSettings />
      </AllProviders>
    );

    expect(screen.getByText('Enable Search Bar')).toBeInTheDocument();
    expect(screen.getByText('Search bar is hidden')).toBeInTheDocument();
  });

  it('shows enabled state when search bar is enabled', () => {
    render(
      <AllProviders initialValues={[[searchBarEnabledAtom, true]]}>
        <SearchBarSettings />
      </AllProviders>
    );

    expect(screen.getByText('Search bar will be shown')).toBeInTheDocument();
  });

  it('shows disabled state when search bar is disabled', () => {
    render(
      <AllProviders initialValues={[[searchBarEnabledAtom, false]]}>
        <SearchBarSettings />
      </AllProviders>
    );

    expect(screen.getByText('Search bar is hidden')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    render(
      <AllProviders>
        <SearchBarSettings />
      </AllProviders>
    );

    const container = screen.getByTestId('search-bar-settings');
    expect(container).toHaveClass('space-y-4');

    const toggleContainer = screen.getByTestId('search-bar-enabled-toggle').closest('div');
    expect(toggleContainer).toHaveClass('flex', 'items-center', 'justify-between', 'bg-bgColor-primary', 'rounded-lg', 'p-4');
  });
});
