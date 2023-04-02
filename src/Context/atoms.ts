import { atomWithStorage } from 'jotai/utils';
import { BookmarkDisplayMode } from '../types.d';

const settings = {
  theme: 'bb-theme',
  background: 'bb-background',
  backgroundOverlayOpacity: 'bb-backgroundOverlayOpacity',
  greetingEnabled: 'bb-greetingEnabled',
  greetingName: 'bb-greetingName',
  viewMode: 'bb-viewMode'
};
export const themeAtom = atomWithStorage<string>(settings.theme, 'default');
export const backgroundOverlayAtom = atomWithStorage<string>(
  settings.background,
  '/images/transparent.png'
);

export const backgroundOverlayOpacityAtom = atomWithStorage<number>(
  settings.backgroundOverlayOpacity,
  10
);

export const greetingEnabledAtom = atomWithStorage<boolean>(
  settings.greetingEnabled,
  false
);
export const greetingNameAtom = atomWithStorage<string>(
  settings.greetingName,
  'Astronaut 🧑‍🚀'
);
export const viewModeAtom = atomWithStorage<BookmarkDisplayMode>(
  settings.viewMode,
  BookmarkDisplayMode.Grid
);
