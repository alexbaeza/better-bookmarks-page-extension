import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import { BookmarkDisplayMode } from '@/shared/types/ui';
import type { ThemeColors } from '@/styles/themes';

import type { BookmarksData } from '@/features/bookmarks/lib/bookmarks';

const settings = {
  theme: 'bb-theme',
  background: 'bb-background',
  backgroundOverlayOpacity: 'bb-backgroundOverlayOpacity',
  greetingEnabled: 'bb-greetingEnabled',
  sidebarEnabled: 'bb-sidebarEnabled',
  greetingName: 'bb-greetingName',
  viewMode: 'bb-viewMode',
  customTheme: 'bb-customTheme',
  searchBarEnabled: 'bb-searchBarEnabled',
};
export const themeAtom = atomWithStorage<string>(settings.theme, 'default');
export const customThemeAtom = atomWithStorage<ThemeColors | null>(settings.customTheme, null);
export const backgroundOverlayAtom = atomWithStorage<string>(settings.background, '/images/transparent.png');

export const sidebarEnabledAtom = atomWithStorage<boolean>(settings.sidebarEnabled, true);
export const searchBarEnabledAtom = atomWithStorage<boolean>(settings.searchBarEnabled, true);

export const backgroundOverlayOpacityAtom = atomWithStorage<number>(settings.backgroundOverlayOpacity, 10);

export const greetingEnabledAtom = atomWithStorage<boolean>(settings.greetingEnabled, true);
export const greetingNameAtom = atomWithStorage<string>(settings.greetingName, 'Astronaut 🧑‍🚀');
// Controls showing any time-based greeting (Good morning, etc.)
export const greetingShownAtom = atomWithStorage<boolean>('bb-greetingShown', true);
export const viewModeAtom = atomWithStorage<BookmarkDisplayMode>(settings.viewMode, BookmarkDisplayMode.Grid);

// Persisted normalized + ordered bookmarks snapshot
export const bookmarksAtom = atomWithStorage<BookmarksData>('bb-bookmarks', {
  folders: [],
  uncategorized: undefined,
});

// Zoom (1.0 = 100%)
export const zoomAtom = atomWithStorage<number>('bb-zoom', 1);
export const zoomStep = 0.1;
export const minZoom = 0.8;
export const maxZoom = 2.0;
export const setZoomAtom = atom(null, (get, set, delta: number) => {
  const next = Math.min(maxZoom, Math.max(minZoom, Number((get(zoomAtom) + delta).toFixed(2))));
  set(zoomAtom, next);
});
