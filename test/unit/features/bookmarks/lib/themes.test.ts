import { themes } from '@/styles/themes';

describe('themes', () => {
  const expectedThemeKeys = [
    'default',
    'github-light',
    'solarized-light',
    'nord-light',
    'github-dark',
    'vscode-dark',
    'dracula',
    'nord',
    'solarized-dark',
    'tokyo-night',
    'catppuccin-mocha',
    'pink',
  ];

  const expectedColorKeys = [
    'bgColor-primary',
    'bgColor-secondary',
    'bgColor-tertiary',
    'bgColor-accent',
    'fgColor-primary',
    'fgColor-secondary',
    'fgColor-muted',
    'fgColor-active',
    'fgColor-hover',
    'fgColor-accent',
    'fgColor-danger',
  ];

  it('has all expected themes', () => {
    expect(Object.keys(themes)).toEqual(expectedThemeKeys);
  });

  it.each(expectedThemeKeys)('%s theme has all required color keys', (themeName) => {
    const theme = themes[themeName];
    expect(Object.keys(theme).sort()).toEqual(expectedColorKeys.sort());
  });

  it('default theme has correct colors', () => {
    expect(themes.default).toEqual({
      'bgColor-primary': '#1F1E25',
      'bgColor-secondary': '#1C1B22',
      'bgColor-tertiary': '#28272E',
      'bgColor-accent': '#007AFF',
      'fgColor-primary': '#F9F9FA',
      'fgColor-secondary': '#8C8C91',
      'fgColor-muted': '#99999C',
      'fgColor-active': '#52525D',
      'fgColor-hover': '#48484F',
      'fgColor-accent': '#007AFF',
      'fgColor-danger': '#E03C31',
    });
  });
});
