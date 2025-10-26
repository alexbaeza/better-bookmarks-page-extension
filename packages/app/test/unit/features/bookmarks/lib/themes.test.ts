import { themes } from '@/styles/themes';

describe('themes', () => {
  const expectedThemeKeys = [
    'catppuccin-mocha',
    'default',
    'dracula',
    'github-dark',
    'github-light',
    'nord',
    'nord-light',
    'pink',
    'solarized-dark',
    'solarized-light',
    'tokyo-night',
    'vscode-dark',
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
    expect(Object.keys(themes)).toStrictEqual(expectedThemeKeys);
  });

  it.each(expectedThemeKeys)('%s theme has all required color keys', (themeName) => {
    const theme = themes[themeName];
    expect(Object.keys(theme).sort()).toStrictEqual(expectedColorKeys.sort());
  });

  it('default theme has correct colors', () => {
    expect(themes.default).toStrictEqual({
      'bgColor-accent': '#007AFF',
      'bgColor-primary': '#1F1E25',
      'bgColor-secondary': '#1C1B22',
      'bgColor-tertiary': '#28272E',
      'fgColor-accent': '#007AFF',
      'fgColor-active': '#52525D',
      'fgColor-danger': '#E03C31',
      'fgColor-hover': '#48484F',
      'fgColor-muted': '#99999C',
      'fgColor-primary': '#F9F9FA',
      'fgColor-secondary': '#8C8C91',
    });
  });
});
