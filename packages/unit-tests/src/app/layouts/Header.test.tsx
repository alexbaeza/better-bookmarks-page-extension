import * as jotai from 'jotai';
import { vi } from 'vitest';
import { when } from 'vitest-when';

import { Header } from '@/app/layouts/Header';
import { greetingShownAtom, searchBarEnabledAtom } from '@/app/providers/atoms';
import { render, screen } from '../../test-utils';

vi.mock('@/features/greeting/components/Greeting', () => ({
  Greeting: () => <div data-testid="greeting">Greeting</div>,
}));
vi.mock('@/features/search/containers/SearchBar', () => ({
  SearchBar: () => <div data-testid="search-bar">SearchBar</div>,
}));
vi.mock('@/features/bookmarks/containers/ViewModeToggle', () => ({
  ViewModeToggle: () => <div data-testid="view-mode-toggle">ViewModeToggle</div>,
}));
vi.mock('@/features/settings/containers/SettingsToggle', () => ({
  SettingsToggle: () => <div data-testid="settings-toggle">SettingsToggle</div>,
}));

describe('Header', () => {
  let spy: vi.SpyInstance;

  beforeEach(() => {
    vi.resetAllMocks();
    spy = vi.spyOn(jotai, 'useAtomValue');
  });

  it('renders greeting and search when enabled', () => {
    when(spy).calledWith(greetingShownAtom).thenReturn(true);
    when(spy).calledWith(searchBarEnabledAtom).thenReturn(true);

    render(<Header />);

    expect(screen.getByTestId('greeting')).toBeInTheDocument();
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    expect(screen.getByTestId('view-mode-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('settings-toggle')).toBeInTheDocument();
  });

  it('hides greeting and shows search when greeting is disabled', () => {
    when(spy).calledWith(greetingShownAtom).thenReturn(false);
    when(spy).calledWith(searchBarEnabledAtom).thenReturn(true);

    render(<Header />);
    expect(screen.queryByTestId('greeting')).toBeNull();
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
  });

  it('hides search when searchBarEnabled is false', () => {
    when(spy).calledWith(greetingShownAtom).thenReturn(true);
    when(spy).calledWith(searchBarEnabledAtom).thenReturn(false);

    render(<Header />);
    expect(screen.getByTestId('greeting')).toBeInTheDocument();
    expect(screen.queryByTestId('search-bar')).toBeNull();
  });
});
