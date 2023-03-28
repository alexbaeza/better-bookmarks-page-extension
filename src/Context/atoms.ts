import { atomWithStorage } from 'jotai/utils';

export const themeAtom = atomWithStorage('bb-theme', 'default');
export const backgroundOverlayAtom = atomWithStorage(
  'bb-background',
  '/images/transparent.png'
);

export const backgroundOverlayOpacityAtom = atomWithStorage(
  'bb-backgroundOverlayOpacity',
  10
);

export const greetingEnabledAtom = atomWithStorage('bb-greetingEnabled', false);
export const greetingNameAtom = atomWithStorage(
  'bb-greetingName',
  'Astronaut 🧑‍🚀'
);
