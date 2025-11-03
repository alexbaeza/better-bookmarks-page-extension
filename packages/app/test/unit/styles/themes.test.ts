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

      for (const key of requiredColorKeys) {
        expect(themeKeys).toContain(key);
      }
    });

    it('should have valid hex color values', () => {
      const theme = themes[themeName];
      const hexColorRegex = /^#[0-9A-F]{6}$/i;

      for (const [_key, value] of Object.entries(theme)) {
        expect(value).toMatch(hexColorRegex);
      }
    });

    it('should have uppercase hex color values', () => {
      const theme = themes[themeName];

      for (const value of Object.values(theme)) {
        expect(value).toBe(value.toUpperCase());
      }
    });

    it('should have exactly 11 color properties', () => {
      expect(Object.keys(themes[themeName])).toHaveLength(11);
    });
  });

  describe('specific theme validations', () => {
    it('default theme should have expected primary background color', () => {
      expect(themes.default['bgColor-primary']).toBe('#1F1E25');
    });

    it('dracula theme should have expected accent color', () => {
      expect(themes.dracula['fgColor-accent']).toBe('#BD93F9');
    });

    it('github-light theme should have light background', () => {
      expect(themes['github-light']['bgColor-primary']).toBe('#FFFFFF');
    });

    it('nord theme should have expected color palette', () => {
      expect(themes.nord['bgColor-accent']).toBe('#88C0D0');
      expect(themes.nord['fgColor-primary']).toBe('#ECEFF4');
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
    it('should have different primary and secondary background colors', () => {
      for (const themeName of themeNames) {
        const theme = themes[themeName];
        expect(theme['bgColor-primary']).not.toBe(theme['bgColor-secondary']);
      }
    });

    it('should have different primary and secondary foreground colors', () => {
      for (const themeName of themeNames) {
        const theme = themes[themeName];
        expect(theme['fgColor-primary']).not.toBe(theme['fgColor-secondary']);
      }
    });
  });
});
