import { fireEvent, render } from '@testing-library/react';
import * as jotai from 'jotai/index';
import { vi } from 'vitest';
import { when } from 'vitest-when';

import { themeAtom } from '@/app/providers/atoms';
import { ThemeSettings } from '@/features/settings/components/ThemeSettings';

describe('ThemeSettings', () => {
  let spy: vi.SpyInstance;

  beforeEach(() => {
    vi.clearAllMocks();
    spy = vi.spyOn(jotai, 'useAtom');
    when(spy)
      .calledWith(themeAtom)
      .thenReturn(['default', vi.fn() as never]);
  });

  it('renders theme options', () => {
    const { getByTestId } = render(<ThemeSettings />);

    expect(getByTestId('theme-button-default')).toBeInTheDocument();
    expect(getByTestId('theme-button-github-light')).toBeInTheDocument();
    expect(getByTestId('theme-button-solarized-light')).toBeInTheDocument();
    expect(getByTestId('theme-button-nord-light')).toBeInTheDocument();
    expect(getByTestId('theme-button-github-dark')).toBeInTheDocument();
    expect(getByTestId('theme-button-vscode-dark')).toBeInTheDocument();
    expect(getByTestId('theme-button-solarized-dark')).toBeInTheDocument();
    expect(getByTestId('theme-button-tokyo-night')).toBeInTheDocument();
    expect(getByTestId('theme-button-catppuccin-mocha')).toBeInTheDocument();
    expect(getByTestId('theme-button-pink')).toBeInTheDocument();
  });

  test('renders theme options with default theme selected', () => {
    const { getByTestId } = render(<ThemeSettings />);
    const defaultButton = getByTestId('theme-button-default');
    const checkIcon = defaultButton.querySelector('svg');
    expect(defaultButton).toBeInTheDocument();
    expect(checkIcon).toBeInTheDocument();
  });

  test('renders theme options with github-light theme selected', () => {
    const setThemeMock = vi.fn();
    when(spy).calledWith(themeAtom).thenReturn(['github-light', setThemeMock]);

    const { getByTestId } = render(<ThemeSettings />);
    const lightButton = getByTestId('theme-button-github-light');
    const checkIcon = lightButton.querySelector('svg');
    expect(checkIcon).toBeInTheDocument();
  });

  test('renders theme options with dracula theme selected', () => {
    const setThemeMock = vi.fn();
    when(spy).calledWith(themeAtom).thenReturn(['dracula', setThemeMock]);

    const { getByTestId } = render(<ThemeSettings />);
    const draculaButton = getByTestId('theme-button-dracula');
    const checkIcon = draculaButton.querySelector('svg');
    expect(checkIcon).toBeInTheDocument();
  });

  test('renders theme options with nord theme selected', () => {
    const setThemeMock = vi.fn();
    when(spy).calledWith(themeAtom).thenReturn(['nord', setThemeMock]);

    const { getByTestId } = render(<ThemeSettings />);
    const nordButton = getByTestId('theme-button-nord');
    const checkIcon = nordButton.querySelector('svg');
    expect(checkIcon).toBeInTheDocument();
  });

  test('renders theme options with solarized-light theme selected', () => {
    const setThemeMock = vi.fn();
    when(spy).calledWith(themeAtom).thenReturn(['solarized-light', setThemeMock]);

    const { getByTestId } = render(<ThemeSettings />);
    const solarizedButton = getByTestId('theme-button-solarized-light');
    const checkIcon = solarizedButton.querySelector('svg');
    expect(checkIcon).toBeInTheDocument();
  });

  test('renders theme options with github-dark theme selected', () => {
    const setThemeMock = vi.fn();
    when(spy).calledWith(themeAtom).thenReturn(['github-dark', setThemeMock]);

    const { getByTestId } = render(<ThemeSettings />);
    const darkButton = getByTestId('theme-button-github-dark');
    const checkIcon = darkButton.querySelector('svg');
    expect(checkIcon).toBeInTheDocument();
  });

  test('renders theme options with vscode-dark theme selected', () => {
    const setThemeMock = vi.fn();
    when(spy).calledWith(themeAtom).thenReturn(['vscode-dark', setThemeMock]);

    const { getByTestId } = render(<ThemeSettings />);
    const vscodeButton = getByTestId('theme-button-vscode-dark');
    const checkIcon = vscodeButton.querySelector('svg');
    expect(checkIcon).toBeInTheDocument();
  });

  test('renders theme options with tokyo-night theme selected', () => {
    const setThemeMock = vi.fn();
    when(spy).calledWith(themeAtom).thenReturn(['tokyo-night', setThemeMock]);

    const { getByTestId } = render(<ThemeSettings />);
    const tokyoButton = getByTestId('theme-button-tokyo-night');
    const checkIcon = tokyoButton.querySelector('svg');
    expect(checkIcon).toBeInTheDocument();
  });

  test('renders theme options with catppuccin-mocha theme selected', () => {
    const setThemeMock = vi.fn();
    when(spy).calledWith(themeAtom).thenReturn(['catppuccin-mocha', setThemeMock]);

    const { getByTestId } = render(<ThemeSettings />);
    const catppuccinButton = getByTestId('theme-button-catppuccin-mocha');
    const checkIcon = catppuccinButton.querySelector('svg');
    expect(checkIcon).toBeInTheDocument();
  });

  test('renders theme options with pink theme selected', () => {
    const setThemeMock = vi.fn();
    when(spy).calledWith(themeAtom).thenReturn(['pink', setThemeMock]);

    const { getByTestId } = render(<ThemeSettings />);
    const pinkButton = getByTestId('theme-button-pink');
    const checkIcon = pinkButton.querySelector('svg');
    expect(checkIcon).toBeInTheDocument();
  });
  it('updates the theme atom when a theme is selected', () => {
    const setThemeMock = vi.fn();
    when(spy).calledWith(themeAtom).thenReturn(['', setThemeMock]);

    const { getByTestId } = render(<ThemeSettings />);

    const githubLightButton = getByTestId('theme-button-github-light');
    fireEvent.click(githubLightButton);

    expect(setThemeMock).toHaveBeenCalledWith('github-light');
  });
});
