import type React from 'react';
import { vi } from 'vitest';

import { App } from '@/app/entrypoints/app';
import { render, screen } from '~test/test-utils';

vi.mock('@/features/navigation/sidebar/containers/Sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar">Sidebar</div>,
}));
vi.mock('@/app/layouts/Header', () => ({
  Header: () => <div data-testid="header">Header</div>,
}));
vi.mock('@/features/settings/containers/SettingsFlyoutContainer', () => ({
  SettingsFlyoutContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="settings-modal">{children}</div>,
}));
vi.mock('@/app/providers/providers', () => ({
  AppProviders: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));
vi.mock('@/app/routing/routes', () => ({
  AppRoutes: () => <div data-testid="routes">Routes</div>,
}));
vi.mock('@/features/bookmarks/containers/Content', () => ({
  Content: () => <div data-testid="content">Content</div>,
}));

describe('App', () => {
  it('renders the App container and routes', () => {
    render(<App />);
    expect(screen.getByTestId('app-container')).toBeInTheDocument();
    expect(screen.getByTestId('routes')).toBeInTheDocument();
  });

  it('renders a scaling wrapper div inside app-container', () => {
    render(<App />);
    const appContainer = screen.getByTestId('app-container');
    const scalingDiv = appContainer.firstChild;
    expect(scalingDiv).toBeInstanceOf(HTMLElement);
    expect(scalingDiv).toHaveAttribute('style');
  });
});
