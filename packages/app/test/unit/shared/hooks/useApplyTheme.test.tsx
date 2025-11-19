import { renderHook } from '@testing-library/react';

import { customThemeAtom, themeAtom } from '@/app/providers/atoms';
import { useApplyTheme } from '@/shared/hooks/useApplyTheme';
import { MockJotaiProvider } from '~test/test-utils';

describe('useApplyTheme', () => {
  const originalDocumentElementClassName = document.documentElement.className;
  const originalAppendChild = document.head.appendChild;
  const originalRemoveChild = document.head.removeChild;
  const originalGetElementById = document.getElementById;

  afterEach(() => {
    document.documentElement.className = originalDocumentElementClassName;
    document.head.appendChild = originalAppendChild;
    document.head.removeChild = originalRemoveChild;
    document.getElementById = originalGetElementById;
    document.getElementById('custom-theme-style')?.remove();
  });

  it('applies default theme class to document element', () => {
    renderHook(() => useApplyTheme(), {
      wrapper: ({ children }) => (
        <MockJotaiProvider
          initialValues={[
            [themeAtom, 'dark'],
            [customThemeAtom, null],
          ]}
        >
          {children}
        </MockJotaiProvider>
      ),
    });

    expect(document.documentElement.className).toBe('dark');
    expect(document.getElementById('custom-theme-style')).toBeNull();
  });

  it('applies custom theme class when theme is custom', () => {
    renderHook(() => useApplyTheme(), {
      wrapper: ({ children }) => (
        <MockJotaiProvider
          initialValues={[
            [themeAtom, 'custom'],
            [customThemeAtom, null],
          ]}
        >
          {children}
        </MockJotaiProvider>
      ),
    });

    expect(document.documentElement.className).toBe('custom');
  });

  it('creates custom theme style element when custom theme is active', () => {
    const customTheme = {
      'bgColor-primary': '#00FF00',
      'fgColor-primary': '#FF0000',
    };

    renderHook(() => useApplyTheme(), {
      wrapper: ({ children }) => (
        <MockJotaiProvider
          initialValues={[
            [themeAtom, 'custom'],
            [customThemeAtom, customTheme],
          ]}
        >
          {children}
        </MockJotaiProvider>
      ),
    });

    const styleElement = document.getElementById('custom-theme-style');
    expect(styleElement).toBeInTheDocument();
    expect(styleElement?.textContent).toContain('--colors-fgColor-primary: 255 0 0;');
    expect(styleElement?.textContent).toContain('--colors-bgColor-primary: 0 255 0;');
  });

  it('creates and replaces custom theme style elements', () => {
    const customTheme1 = { 'fgColor-primary': '#111111' };
    const customTheme2 = { 'fgColor-primary': '#222222' };

    const { unmount } = renderHook(() => useApplyTheme(), {
      wrapper: ({ children }) => (
        <MockJotaiProvider
          initialValues={[
            [themeAtom, 'custom'],
            [customThemeAtom, customTheme1],
          ]}
        >
          {children}
        </MockJotaiProvider>
      ),
    });

    expect(document.getElementById('custom-theme-style')).toBeInTheDocument();
    expect(document.getElementById('custom-theme-style')?.textContent).toContain('--colors-fgColor-primary: 17 17 17;');

    unmount();
    document.getElementById('custom-theme-style')?.remove();

    renderHook(() => useApplyTheme(), {
      wrapper: ({ children }) => (
        <MockJotaiProvider
          initialValues={[
            [themeAtom, 'custom'],
            [customThemeAtom, customTheme2],
          ]}
        >
          {children}
        </MockJotaiProvider>
      ),
    });

    const styleElements = document.head.querySelectorAll('#custom-theme-style');
    expect(styleElements.length).toBe(1); // Only one should exist
    expect(styleElements[0]?.textContent).toContain('--colors-fgColor-primary: 34 34 34;');
  });

  it('removes custom theme style when switching to non-custom theme', () => {
    const customTheme = { 'fgColor-primary': '#FF0000' };

    const { unmount } = renderHook(() => useApplyTheme(), {
      wrapper: ({ children }) => (
        <MockJotaiProvider
          initialValues={[
            [themeAtom, 'custom'],
            [customThemeAtom, customTheme],
          ]}
        >
          {children}
        </MockJotaiProvider>
      ),
    });

    expect(document.getElementById('custom-theme-style')).toBeInTheDocument();

    unmount();
    document.getElementById('custom-theme-style')?.remove();

    renderHook(() => useApplyTheme(), {
      wrapper: ({ children }) => (
        <MockJotaiProvider
          initialValues={[
            [themeAtom, 'light'],
            [customThemeAtom, null],
          ]}
        >
          {children}
        </MockJotaiProvider>
      ),
    });

    expect(document.getElementById('custom-theme-style')).toBeNull();
    expect(document.documentElement.className).toBe('light');
  });

  it('handles hex color conversion correctly', () => {
    const customTheme = {
      'bgColor-secondary': '#010203',
      'fgColor-primary': '#AABBCC',
    };

    renderHook(() => useApplyTheme(), {
      wrapper: ({ children }) => (
        <MockJotaiProvider
          initialValues={[
            [themeAtom, 'custom'],
            [customThemeAtom, customTheme],
          ]}
        >
          {children}
        </MockJotaiProvider>
      ),
    });

    const styleElement = document.getElementById('custom-theme-style');
    expect(styleElement?.textContent).toContain('--colors-fgColor-primary: 170 187 204;');
    expect(styleElement?.textContent).toContain('--colors-bgColor-secondary: 1 2 3;');
  });

  it('handles empty custom theme gracefully', () => {
    renderHook(() => useApplyTheme(), {
      wrapper: ({ children }) => (
        <MockJotaiProvider
          initialValues={[
            [themeAtom, 'custom'],
            [customThemeAtom, {}],
          ]}
        >
          {children}
        </MockJotaiProvider>
      ),
    });

    const styleElement = document.getElementById('custom-theme-style');
    expect(styleElement).toBeInTheDocument();
    expect(styleElement?.textContent).not.toContain('--colors-'); // No variables should be set
  });

  it('updates theme class correctly', () => {
    const { unmount } = renderHook(() => useApplyTheme(), {
      wrapper: ({ children }) => (
        <MockJotaiProvider
          initialValues={[
            [themeAtom, 'light'],
            [customThemeAtom, null],
          ]}
        >
          {children}
        </MockJotaiProvider>
      ),
    });

    expect(document.documentElement.className).toBe('light');

    unmount();
    renderHook(() => useApplyTheme(), {
      wrapper: ({ children }) => (
        <MockJotaiProvider
          initialValues={[
            [themeAtom, 'dark'],
            [customThemeAtom, null],
          ]}
        >
          {children}
        </MockJotaiProvider>
      ),
    });

    expect(document.documentElement.className).toBe('dark');
  });
});
