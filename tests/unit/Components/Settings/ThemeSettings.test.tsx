import { fireEvent, render } from '@testing-library/react';
import { when } from 'jest-when';
import {
  backgroundOverlayAtom,
  themeAtom
} from '../../../../src/Context/atoms';
import * as jotai from 'jotai/index';
import { ThemeSettings } from '../../../../src/Components/Settings/ThemeSettings';

describe('ThemeSettings', () => {
  let spy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    spy = jest.spyOn(jotai, 'useAtom');
    when(spy)
      .calledWith(themeAtom)
      .mockReturnValue(['default', jest.fn() as never]);
  });

  it('renders theme options', () => {
    const { getByTestId } = render(<ThemeSettings />);

    expect(getByTestId('theme-button-default')).toBeInTheDocument();
    expect(getByTestId('theme-button-light')).toBeInTheDocument();
    expect(getByTestId('theme-button-red')).toBeInTheDocument();
    expect(getByTestId('theme-button-orange')).toBeInTheDocument();
    expect(getByTestId('theme-button-green')).toBeInTheDocument();
    expect(getByTestId('theme-button-teal')).toBeInTheDocument();
    expect(getByTestId('theme-button-blue')).toBeInTheDocument();
    expect(getByTestId('theme-button-indigo')).toBeInTheDocument();
    expect(getByTestId('theme-button-purple')).toBeInTheDocument();
    expect(getByTestId('theme-button-pink')).toBeInTheDocument();
  });

  test('renders theme options with default theme selected', () => {
    const { getByTestId } = render(<ThemeSettings />);
    const defaultButton = getByTestId('theme-button-default');
    const checkIcon = getByTestId('background-check-icon');
    expect(defaultButton).toBeInTheDocument();
    expect(checkIcon).toBeInTheDocument();
  });

  test('renders theme options with light theme selected', () => {
    const { getByTestId } = render(<ThemeSettings />);
    const lightButton = getByTestId('theme-button-light');
    fireEvent.click(lightButton);
    const checkIcon = getByTestId('background-check-icon');
    expect(checkIcon).toBeInTheDocument();
  });

  test('renders theme options with red theme selected', () => {
    const { getByTestId } = render(<ThemeSettings />);
    const redButton = getByTestId('theme-button-red');
    fireEvent.click(redButton);
    const checkIcon = getByTestId('background-check-icon');
    expect(checkIcon).toBeInTheDocument();
  });

  test('renders theme options with orange theme selected', () => {
    const { getByTestId } = render(<ThemeSettings />);
    const orangeButton = getByTestId('theme-button-orange');
    fireEvent.click(orangeButton);
    const checkIcon = getByTestId('background-check-icon');
    expect(checkIcon).toBeInTheDocument();
  });

  test('renders theme options with green theme selected', () => {
    const { getByTestId } = render(<ThemeSettings />);
    const greenButton = getByTestId('theme-button-green');
    fireEvent.click(greenButton);
    const checkIcon = getByTestId('background-check-icon');
    expect(checkIcon).toBeInTheDocument();
  });

  test('renders theme options with teal theme selected', () => {
    const { getByTestId } = render(<ThemeSettings />);
    const tealButton = getByTestId('theme-button-teal');
    fireEvent.click(tealButton);
    const checkIcon = getByTestId('background-check-icon');
    expect(checkIcon).toBeInTheDocument();
  });

  test('renders theme options with blue theme selected', () => {
    const { getByTestId } = render(<ThemeSettings />);
    const blueButton = getByTestId('theme-button-blue');
    fireEvent.click(blueButton);
    const checkIcon = getByTestId('background-check-icon');
    expect(checkIcon).toBeInTheDocument();
  });

  test('renders theme options with indigo theme selected', () => {
    const { getByTestId } = render(<ThemeSettings />);
    const indigoButton = getByTestId('theme-button-indigo');
    fireEvent.click(indigoButton);
    const checkIcon = getByTestId('background-check-icon');
    expect(checkIcon).toBeInTheDocument();
  });

  test('renders theme options with purple theme selected', () => {
    const { getByTestId } = render(<ThemeSettings />);
    const purpleButton = getByTestId('theme-button-purple');
    fireEvent.click(purpleButton);
    const checkIcon = getByTestId('background-check-icon');
    expect(checkIcon).toBeInTheDocument();
  });

  test('renders theme options with pink theme selected', () => {
    const { getByTestId } = render(<ThemeSettings />);
    const pinkButton = getByTestId('theme-button-pink');
    fireEvent.click(pinkButton);
    const checkIcon = getByTestId('background-check-icon');
    expect(checkIcon).toBeInTheDocument();
  });
  it('updates the theme atom when a theme is selected', () => {
    const setThemeMock = jest.fn();
    when(spy).calledWith(themeAtom).mockReturnValue(['', setThemeMock]);

    const { getByTestId } = render(<ThemeSettings />);

    const lightThemeButton = getByTestId('theme-button-light');
    fireEvent.click(lightThemeButton);

    expect(setThemeMock).toHaveBeenCalledWith('light');
  });
});
