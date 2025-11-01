import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { LOCAL_STORAGE_PREFIX_KEY } from '@/config/constants.ts';
import type { BookmarksData } from '@/features/bookmarks/lib/bookmarks';
import { BookmarkDisplayMode } from '@/shared/types/ui';
import type { ThemeColors } from '@/styles/themes';

export const storageKey = (key: string) => {
  return `${LOCAL_STORAGE_PREFIX_KEY}${key}`;
};

const settings = {
  preferences: {
    background: {
      image: storageKey('background'),
      overlayOpacity: storageKey('background-overlay-opacity'),
    },
    greeting: {
      enabled: storageKey('greeting-enabled'),
      name: storageKey('greeting-name'),
    },
    ui: {
      customTheme: storageKey('custom-theme'),
      searchBarEnabled: storageKey('search-bar-enabled'),
      sidebarEnabled: storageKey('sidebar-enabled'),
      theme: storageKey('theme'),
      viewMode: storageKey('view-mode'),
      zoom: storageKey('zoom'),
    },
  },
  state: {
    bookmarks: storageKey('bookmarks'),
  },
};

// =============================
// Data: Bookmarks snapshot
// =============================
/** normalized + ordered bookmarks snapshot used for instant hydration. */
export const bookmarksAtom = atomWithStorage<BookmarksData>(settings.state.bookmarks, {
  folders: [],
  uncategorized: undefined,
});

// =============================
// Settings: Theme & Appearance
// =============================
/**
 * selected theme key. Defaults to 'nord'.
 * Stored in localStorage under settings.preferences.ui.theme.
 */
export const themeAtom = atomWithStorage<string>(settings.preferences.ui.theme, 'nord');
/**
 * custom theme colors when user selects 'custom' theme.
 * Null means no custom overrides.
 */
export const customThemeAtom = atomWithStorage<ThemeColors | null>(settings.preferences.ui.customTheme, null);

/**
 * background overlay image path. '/images/transparent.png' disables overlay.
 */
export const backgroundOverlayAtom = atomWithStorage<string>(settings.preferences.background.image, '/images/transparent.png');

/** toggle for showing the sidebar. */
export const sidebarEnabledAtom = atomWithStorage<boolean>(settings.preferences.ui.sidebarEnabled, true);
/** toggle for showing the header search bar. */
export const searchBarEnabledAtom = atomWithStorage<boolean>(settings.preferences.ui.searchBarEnabled, true);

/** background overlay opacity percentage (0-100). */
export const backgroundOverlayOpacityAtom = atomWithStorage<number>(settings.preferences.background.overlayOpacity, 10);

// =============================
// Preferences: Greeting & View
// =============================
/** bookmark view mode (Grid/List). */
export const viewModeAtom = atomWithStorage<BookmarkDisplayMode>(settings.preferences.ui.viewMode, BookmarkDisplayMode.Grid);
/** toggle for enabling the greeting block. */
export const greetingEnabledAtom = atomWithStorage<boolean>(settings.preferences.greeting.enabled, true);
/** display name used by the greeting block. */
export const greetingNameAtom = atomWithStorage<string>(settings.preferences.greeting.name, 'Astronaut 🧑‍🚀');
// Note: whether to show the greeting is controlled by greetingEnabledAtom.

// =============================
// Preferences: Zoom helpers
// =============================
/** Zoom helpers (1.0 = 100%). */
export const ZOOM_STEP = 0.1;
export const ZOOM_MIN_VALUE = 1.0;
export const ZOOM_MAX_VALUE = 2.0;

/** zoom scalar (1.0 = 100%). */
export const zoomAtom = atomWithStorage<number>(settings.preferences.ui.zoom, 1);
export const setZoomAtom = atom(null, (get, set, delta: number) => {
  const next = Math.min(ZOOM_MAX_VALUE, Math.max(ZOOM_MIN_VALUE, Number((get(zoomAtom) + delta).toFixed(2))));
  set(zoomAtom, next);
});

// Optional grouped exports (non-breaking). Keep using named atoms as before.
export const SETTINGS = {
  backgroundOverlayAtom,
  backgroundOverlayOpacityAtom,
  customThemeAtom,
  searchBarEnabledAtom,
  sidebarEnabledAtom,
  themeAtom,
} as const;

export const PREFERENCES = {
  greetingEnabledAtom,
  greetingNameAtom,
  setZoomAtom,
  viewModeAtom,
  ZOOM_MAX_VALUE,
  ZOOM_MIN_VALUE,
  ZOOM_STEP,
  zoomAtom,
} as const;

export const DATA = {
  bookmarksAtom,
} as const;
