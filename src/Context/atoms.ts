import { atomWithStorage } from 'jotai/utils';
export const backgroundOverlayAtom = atomWithStorage('background', '/images/transparent.png');
export const greetingEnabledAtom = atomWithStorage('greetingEnabled', false);
export const greetingNameAtom = atomWithStorage('greetingName', 'Astronaut 🧑‍🚀');
