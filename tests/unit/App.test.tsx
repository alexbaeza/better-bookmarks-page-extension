import React from 'react';
import { render, screen } from '@testing-library/react';
import { App } from '../../src/App';
import { useAtomValue } from 'jotai';
import * as jotai from 'jotai';
import { when } from 'jest-when';
import { themeAtom } from '../../src/Context/atoms';

jest.mock('../../src/Context/app-state-provider', () => ({
  AppStateProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="app-state-provider">{children}</div>
  )
}));
jest.mock('../../src/Components/Settings/SettingsModal', () => ({
  SettingsModal: () => <div data-testid="settings-modal">Settings Modal</div>
}));
jest.mock('../../src/Components/Greeting/Greeting', () => ({
  Greeting: () => <div data-testid="greeting">Greeting</div>
}));
jest.mock('../../src/Sections/ViewModeToggle', () => ({
  ViewModeToggle: () => (
    <div data-testid="view-mode-toggle">View Mode Toggle</div>
  )
}));
jest.mock('../../src/Sections/Content', () => ({
  Content: () => <div data-testid="content">Content</div>
}));
jest.mock('../../src/Sections/Background', () => ({
  Background: () => <div data-testid="background">Background</div>
}));
jest.mock('../../src/Components/Sidebar/Sidebar', () => ({
  Sidebar: () => <div data-testid="sidebar">Sidebar</div>
}));

describe('App', () => {
  let useAtomValueSpy: jest.SpyInstance;

  beforeEach(() => {
    jest.resetAllMocks();
    useAtomValueSpy = jest.spyOn(jotai, 'useAtomValue');
    when(useAtomValueSpy).calledWith(themeAtom).mockReturnValue('dark-theme');
  });

  it('renders the AppStateProvider', () => {
    render(<App />);
    expect(screen.getByTestId('app-state-provider')).toBeInTheDocument();
  });

  it('applies the theme class from themeAtom', () => {
    render(<App />);
    const container = screen.getByTestId('container');
    expect(container).toHaveClass('dark-theme');
  });

  it('renders the Background component', () => {
    render(<App />);
    expect(screen.getByTestId('background')).toBeInTheDocument();
  });

  it('renders the Sidebar component', () => {
    render(<App />);
    expect(screen.getByTestId('sidebar')).toBeInTheDocument();
  });

  it('renders the SettingsModal component', () => {
    render(<App />);
    expect(screen.getByTestId('settings-modal')).toBeInTheDocument();
  });

  it('renders the Greeting component', () => {
    render(<App />);
    expect(screen.getByTestId('greeting')).toBeInTheDocument();
  });

  it('renders the ViewModeToggle component', () => {
    render(<App />);
    expect(screen.getByTestId('view-mode-toggle')).toBeInTheDocument();
  });

  it('renders the Content component', () => {
    render(<App />);
    expect(screen.getByTestId('content')).toBeInTheDocument();
  });

  it('renders the layout structure correctly', () => {
    render(<App />);
    const container = screen.getByTestId('container');
    expect(container).toBeInTheDocument();
    expect(container).toHaveClass('flex max-h-screen flex-row bg-primary-dark');
  });
});
