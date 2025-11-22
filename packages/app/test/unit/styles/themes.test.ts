import { describe, expect, it } from 'vitest';
import { type ThemeColors, themes } from '@/styles/themes';

describe('themes', () => {
  const requiredColorKeys = [
    'bgColor-accent',
    'bgColor-primary',
    'bgColor-secondary',
    'bgColor-tertiary',
    'fgColor-accent',
    'fgColor-active',
    'fgColor-danger',
    'fgColor-hover',
    'fgColor-muted',
    'fgColor-primary',
    'fgColor-secondary',
  ];

  const themeNames = [
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

  describe('themes object', () => {
    it('should be defined', () => {
      expect(themes).toBeDefined();
    });

    it('should be an object', () => {
      expect(typeof themes).toBe('object');
    });

    it('should have all expected theme names', () => {
      const actualThemeNames = Object.keys(themes);
      expect(actualThemeNames).toEqual(expect.arrayContaining(themeNames));
    });

    it('should have exactly 12 themes', () => {
      expect(Object.keys(themes)).toHaveLength(12);
    });
  });

  describe.each(themeNames)('theme: %s', (themeName) => {
    it('should exist', () => {
      expect(themes[themeName]).toBeDefined();
    });

    it('should have all required color keys', () => {
      const theme = themes[themeName];
      const themeKeys = Object.keys(theme);

      requiredColorKeys.forEach((key) => {
        expect(themeKeys).toContain(key);
      });
    });

    it('should have valid hex color values', () => {
      const theme = themes[themeName];
      const hexColorRegex = /^#[0-9A-F]{6}$/i;

      Object.values(theme).forEach((value) => {
        expect(value).toMatch(hexColorRegex);
      });
    });

    it('should have uppercase hex color values', () => {
      const theme = themes[themeName];

      Object.values(theme).forEach((value) => {
        expect(value).toBe(value.toUpperCase());
      });
    });

    it('should have exactly 11 color properties', () => {
      expect(Object.keys(themes[themeName])).toHaveLength(11);
    });
  });

  describe('specific theme validations', () => {
    it.each([
      ['default', { 'bgColor-primary': '#1F1E25' }],
      ['dracula', { 'fgColor-accent': '#BD93F9' }],
      ['github-light', { 'bgColor-primary': '#FFFFFF' }],
      [
        'nord',
        {
          'bgColor-accent': '#88C0D0',
          'fgColor-primary': '#ECEFF4',
        },
      ],
    ])('%s theme should have expected palette', (themeName, expectedColors) => {
      const theme = themes[themeName];
      Object.entries(expectedColors).forEach(([key, expectedValue]) => {
        expect(theme[key]).toBe(expectedValue);
      });
    });
  });

  describe('ThemeColors type', () => {
    it('should match the structure of theme objects', () => {
      const theme: ThemeColors = themes.default;
      expect(theme).toBeDefined();
      expect(typeof theme).toBe('object');
    });
  });

  describe('color contrast and accessibility', () => {
    it.each(themeNames)('%s should have different primary and secondary background colors', (themeName) => {
      const theme = themes[themeName];
      expect(theme['bgColor-primary']).not.toBe(theme['bgColor-secondary']);
    });

    it.each(themeNames)('%s should have different primary and secondary foreground colors', (themeName) => {
      const theme = themes[themeName];
      expect(theme['fgColor-primary']).not.toBe(theme['fgColor-secondary']);
    });
  });
});
