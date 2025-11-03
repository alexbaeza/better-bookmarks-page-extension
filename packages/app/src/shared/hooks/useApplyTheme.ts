import { useAtomValue } from 'jotai';
import { useEffect } from 'react';

import { customThemeAtom, themeAtom } from '@/app/providers/atoms';

export function useApplyTheme() {
  const theme = useAtomValue(themeAtom);
  const customTheme = useAtomValue(customThemeAtom);

  useEffect(() => {
    const root = document.documentElement;

    // Set the theme class on the HTML element
    // If custom theme is active, use 'custom' as the class
    const themeClass = theme === 'custom' ? 'custom' : theme;
    root.className = themeClass;

    if (theme === 'custom' && customTheme) {
      // When custom theme is active, create a style element with custom CSS variables
      // Remove any existing custom theme style
      const existingStyle = document.getElementById('custom-theme-style');
      if (existingStyle) {
        existingStyle.remove();
      }

      // Create a new style element with custom CSS variables
      const style = document.createElement('style');
      style.id = 'custom-theme-style';

      // Generate CSS that overrides the theme variables
      // tailwindcss-themer uses --colors-* format and RGB values without rgb()
      const cssVariables = Object.entries(customTheme)
        .map(([key, value]) => {
          // Convert hex color to RGB values
          const hex = value.replace('#', '');
          const r = Number.parseInt(hex.substr(0, 2), 16);
          const g = Number.parseInt(hex.substr(2, 2), 16);
          const b = Number.parseInt(hex.substr(4, 2), 16);
          return `  --colors-${key}: ${r} ${g} ${b};`;
        })
        .join('\n');

      style.textContent = `
        :root {
${cssVariables}
        }
        
        /* Force override with theme class specificity */
        html.custom {
${cssVariables}
        }
        
        /* Use !important to ensure override */
        html.custom {
${cssVariables.replace(/;/g, ' !important;')}
        }
      `;

      document.head.appendChild(style);
    } else {
      // When no custom theme, remove the custom style element
      const existingStyle = document.getElementById('custom-theme-style');
      if (existingStyle) {
        existingStyle.remove();
      }
    }
  }, [theme, customTheme]);
}
