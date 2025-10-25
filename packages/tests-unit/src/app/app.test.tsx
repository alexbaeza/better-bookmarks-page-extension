import * as jotai from 'jotai';
import type React from 'react';
import { vi } from 'vitest';
import { when } from 'vitest-when';

import { App } from '@/app/app';
import { sidebarEnabledAtom, themeAtom } from '@/app/providers/atoms';
import { render, screen } from '~test/test-utils';

// Mock child components
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
  let useAtomValueSpy: vi.SpyInstance;

  beforeEach(() => {
    vi.resetAllMocks();
    useAtomValueSpy = vi.spyOn(jotai, 'useAtomValue');
    when(useAtomValueSpy).calledWith(themeAtom).thenReturn('dark-theme');
    when(useAtomValueSpy).calledWith(sidebarEnabledAtom).thenReturn(true);
  });

  it('renders the App container and routes', () => {
    render(<App />);
    expect(screen.getByTestId('app-container')).toBeInTheDocument();
    expect(screen.getByTestId('routes')).toBeInTheDocument();
  });
});
