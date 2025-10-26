import { vi } from 'vitest';
import { Header } from '@/app/layouts/Header';
import { greetingEnabledAtom, searchBarEnabledAtom } from '@/app/providers/atoms';
import { render, screen } from '~test/test-utils';

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
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders greeting and search when enabled', () => {
    render(<Header />, {
      initialValues: [
        [greetingEnabledAtom, true],
        [searchBarEnabledAtom, true],
      ],
    });

    expect(screen.getByTestId('greeting')).toBeInTheDocument();
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
    expect(screen.getByTestId('view-mode-toggle')).toBeInTheDocument();
    expect(screen.getByTestId('settings-toggle')).toBeInTheDocument();
  });

  it('hides greeting and shows search when greeting is disabled', () => {
    render(<Header />, {
      initialValues: [
        [greetingEnabledAtom, false],
        [searchBarEnabledAtom, true],
      ],
    });
    expect(screen.queryByTestId('greeting')).toBeNull();
    expect(screen.getByTestId('search-bar')).toBeInTheDocument();
  });

  it('hides search when searchBarEnabled is false', () => {
    render(<Header />, {
      initialValues: [
        [greetingEnabledAtom, true],
        [searchBarEnabledAtom, false],
      ],
    });
    expect(screen.getByTestId('greeting')).toBeInTheDocument();
    expect(screen.queryByTestId('search-bar')).toBeNull();
  });
});
